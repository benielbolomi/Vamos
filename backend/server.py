from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, APIRouter, HTTPException, Request, UploadFile, File, Depends, Form
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from bson import ObjectId
import base64

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'vamos-couture-secret-key-2024-secure')
JWT_ALGORITHM = "HS256"

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============ Auth Helpers ============
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Non authentifié")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Token invalide")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="Utilisateur non trouvé")
        return {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user.get("name", "Admin"),
            "role": user.get("role", "admin")
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expiré")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")

# ============ Pydantic Models ============
class LoginRequest(BaseModel):
    email: str
    password: str

class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = ""

class CategoryResponse(BaseModel):
    id: str
    name: str
    description: str
    created_at: str

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category_id: str
    sizes: List[str] = ["S", "M", "L", "XL"]
    featured: bool = False
    image_url: Optional[str] = ""

class ProductResponse(BaseModel):
    id: str
    name: str
    description: str
    price: float
    category_id: str
    category_name: Optional[str] = ""
    sizes: List[str]
    featured: bool
    image_url: str
    created_at: str

class ContactCreate(BaseModel):
    name: str
    email: str
    message: str

class ContactResponse(BaseModel):
    id: str
    name: str
    email: str
    message: str
    created_at: str
    read: bool

# ============ Auth Endpoints ============
@api_router.post("/auth/login")
async def login(request: LoginRequest):
    user = await db.users.find_one({"email": request.email.lower()})
    if not user or not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    token = create_access_token(str(user["_id"]), user["email"])
    response = JSONResponse(content={
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name", "Admin"),
        "token": token
    })
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=86400,
        path="/"
    )
    return response

@api_router.post("/auth/logout")
async def logout():
    response = JSONResponse(content={"message": "Déconnecté"})
    response.delete_cookie("access_token", path="/")
    return response

@api_router.get("/auth/me")
async def get_me(user: dict = Depends(get_current_user)):
    return user

# ============ Categories Endpoints ============
@api_router.get("/categories", response_model=List[CategoryResponse])
async def get_categories():
    categories = await db.categories.find({}, {"_id": 1, "name": 1, "description": 1, "created_at": 1}).to_list(100)
    return [
        CategoryResponse(
            id=str(cat["_id"]),
            name=cat["name"],
            description=cat.get("description", ""),
            created_at=cat.get("created_at", datetime.now(timezone.utc).isoformat())
        )
        for cat in categories
    ]

@api_router.post("/categories", response_model=CategoryResponse)
async def create_category(category: CategoryCreate, user: dict = Depends(get_current_user)):
    doc = {
        "name": category.name,
        "description": category.description,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    result = await db.categories.insert_one(doc)
    return CategoryResponse(
        id=str(result.inserted_id),
        name=doc["name"],
        description=doc["description"],
        created_at=doc["created_at"]
    )

@api_router.put("/categories/{category_id}", response_model=CategoryResponse)
async def update_category(category_id: str, category: CategoryCreate, user: dict = Depends(get_current_user)):
    result = await db.categories.update_one(
        {"_id": ObjectId(category_id)},
        {"$set": {"name": category.name, "description": category.description}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    updated = await db.categories.find_one({"_id": ObjectId(category_id)})
    return CategoryResponse(
        id=str(updated["_id"]),
        name=updated["name"],
        description=updated.get("description", ""),
        created_at=updated.get("created_at", datetime.now(timezone.utc).isoformat())
    )

@api_router.delete("/categories/{category_id}")
async def delete_category(category_id: str, user: dict = Depends(get_current_user)):
    result = await db.categories.delete_one({"_id": ObjectId(category_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    return {"message": "Catégorie supprimée"}

# ============ Products Endpoints ============
@api_router.get("/products", response_model=List[ProductResponse])
async def get_products(category_id: Optional[str] = None, featured: Optional[bool] = None):
    query = {}
    if category_id:
        query["category_id"] = category_id
    if featured is not None:
        query["featured"] = featured
    
    products = await db.products.find(query).to_list(100)
    
    # Get category names
    category_ids = list(set([p.get("category_id") for p in products if p.get("category_id")]))
    categories = {}
    if category_ids:
        cat_docs = await db.categories.find({"_id": {"$in": [ObjectId(cid) for cid in category_ids]}}).to_list(100)
        categories = {str(c["_id"]): c["name"] for c in cat_docs}
    
    return [
        ProductResponse(
            id=str(p["_id"]),
            name=p["name"],
            description=p["description"],
            price=p["price"],
            category_id=p.get("category_id", ""),
            category_name=categories.get(p.get("category_id", ""), ""),
            sizes=p.get("sizes", ["S", "M", "L", "XL"]),
            featured=p.get("featured", False),
            image_url=p.get("image_url", ""),
            created_at=p.get("created_at", datetime.now(timezone.utc).isoformat())
        )
        for p in products
    ]

@api_router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    product = await db.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    category_name = ""
    if product.get("category_id"):
        cat = await db.categories.find_one({"_id": ObjectId(product["category_id"])})
        if cat:
            category_name = cat["name"]
    
    return ProductResponse(
        id=str(product["_id"]),
        name=product["name"],
        description=product["description"],
        price=product["price"],
        category_id=product.get("category_id", ""),
        category_name=category_name,
        sizes=product.get("sizes", ["S", "M", "L", "XL"]),
        featured=product.get("featured", False),
        image_url=product.get("image_url", ""),
        created_at=product.get("created_at", datetime.now(timezone.utc).isoformat())
    )

@api_router.post("/products", response_model=ProductResponse)
async def create_product(product: ProductCreate, user: dict = Depends(get_current_user)):
    doc = {
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "category_id": product.category_id,
        "sizes": product.sizes,
        "featured": product.featured,
        "image_url": product.image_url,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    result = await db.products.insert_one(doc)
    
    category_name = ""
    if product.category_id:
        cat = await db.categories.find_one({"_id": ObjectId(product.category_id)})
        if cat:
            category_name = cat["name"]
    
    return ProductResponse(
        id=str(result.inserted_id),
        name=doc["name"],
        description=doc["description"],
        price=doc["price"],
        category_id=doc["category_id"],
        category_name=category_name,
        sizes=doc["sizes"],
        featured=doc["featured"],
        image_url=doc["image_url"],
        created_at=doc["created_at"]
    )

@api_router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(product_id: str, product: ProductCreate, user: dict = Depends(get_current_user)):
    update_data = {
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "category_id": product.category_id,
        "sizes": product.sizes,
        "featured": product.featured,
        "image_url": product.image_url
    }
    result = await db.products.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    updated = await db.products.find_one({"_id": ObjectId(product_id)})
    category_name = ""
    if updated.get("category_id"):
        cat = await db.categories.find_one({"_id": ObjectId(updated["category_id"])})
        if cat:
            category_name = cat["name"]
    
    return ProductResponse(
        id=str(updated["_id"]),
        name=updated["name"],
        description=updated["description"],
        price=updated["price"],
        category_id=updated.get("category_id", ""),
        category_name=category_name,
        sizes=updated.get("sizes", ["S", "M", "L", "XL"]),
        featured=updated.get("featured", False),
        image_url=updated.get("image_url", ""),
        created_at=updated.get("created_at", datetime.now(timezone.utc).isoformat())
    )

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, user: dict = Depends(get_current_user)):
    result = await db.products.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    return {"message": "Produit supprimé"}

# ============ Image Upload Endpoint ============
@api_router.post("/upload")
async def upload_image(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    contents = await file.read()
    base64_image = base64.b64encode(contents).decode("utf-8")
    content_type = file.content_type or "image/jpeg"
    data_url = f"data:{content_type};base64,{base64_image}"
    return {"url": data_url}

# ============ Contact Endpoints ============
@api_router.post("/contact", response_model=ContactResponse)
async def create_contact(contact: ContactCreate):
    doc = {
        "name": contact.name,
        "email": contact.email,
        "message": contact.message,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "read": False
    }
    result = await db.messages.insert_one(doc)
    return ContactResponse(
        id=str(result.inserted_id),
        name=doc["name"],
        email=doc["email"],
        message=doc["message"],
        created_at=doc["created_at"],
        read=doc["read"]
    )

@api_router.get("/contact", response_model=List[ContactResponse])
async def get_contacts(user: dict = Depends(get_current_user)):
    messages = await db.messages.find({}).sort("created_at", -1).to_list(100)
    return [
        ContactResponse(
            id=str(m["_id"]),
            name=m["name"],
            email=m["email"],
            message=m["message"],
            created_at=m.get("created_at", datetime.now(timezone.utc).isoformat()),
            read=m.get("read", False)
        )
        for m in messages
    ]

@api_router.put("/contact/{message_id}/read")
async def mark_message_read(message_id: str, user: dict = Depends(get_current_user)):
    await db.messages.update_one({"_id": ObjectId(message_id)}, {"$set": {"read": True}})
    return {"message": "Message marqué comme lu"}

@api_router.delete("/contact/{message_id}")
async def delete_message(message_id: str, user: dict = Depends(get_current_user)):
    result = await db.messages.delete_one({"_id": ObjectId(message_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message non trouvé")
    return {"message": "Message supprimé"}

# ============ Root Endpoint ============
@api_router.get("/")
async def root():
    return {"message": "VAMOS Couture API"}

# Include the router
app.include_router(api_router)

# CORS
frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[frontend_url, "http://localhost:3000", "https://atelier-couture-4.preview.emergentagent.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed admin and categories on startup
@app.on_event("startup")
async def seed_data():
    # Seed admin user
    admin_email = os.environ.get("ADMIN_EMAIL", "lufarangae@gmail.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "555554444333221")
    
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin VAMOS",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        logger.info(f"Admin user created: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
        logger.info(f"Admin password updated: {admin_email}")
    
    # Create indexes
    await db.users.create_index("email", unique=True)
    
    # Seed default categories if none exist
    cat_count = await db.categories.count_documents({})
    if cat_count == 0:
        default_cats = [
            {"name": "Homme", "description": "Vêtements pour hommes", "created_at": datetime.now(timezone.utc).isoformat()},
            {"name": "Femme", "description": "Vêtements pour femmes", "created_at": datetime.now(timezone.utc).isoformat()},
            {"name": "Traditionnel", "description": "Tenues traditionnelles africaines", "created_at": datetime.now(timezone.utc).isoformat()},
            {"name": "Mariage", "description": "Tenues de mariage", "created_at": datetime.now(timezone.utc).isoformat()},
            {"name": "Décontracté", "description": "Vêtements décontractés", "created_at": datetime.now(timezone.utc).isoformat()},
        ]
        await db.categories.insert_many(default_cats)
        logger.info("Default categories created")
    
    # Write test credentials
    try:
        with open("/app/memory/test_credentials.md", "w") as f:
            f.write(f"# Test Credentials\n\n")
            f.write(f"## Admin Account\n")
            f.write(f"- Email: {admin_email}\n")
            f.write(f"- Password: {admin_password}\n")
            f.write(f"- Role: admin\n\n")
            f.write(f"## Auth Endpoints\n")
            f.write(f"- POST /api/auth/login\n")
            f.write(f"- POST /api/auth/logout\n")
            f.write(f"- GET /api/auth/me\n")
    except Exception as e:
        logger.warning(f"Could not write test credentials: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
