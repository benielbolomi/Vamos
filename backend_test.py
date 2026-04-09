#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class VamosCoutureAPITester:
    def __init__(self, base_url="https://atelier-couture-4.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.session = requests.Session()
        
        # Test credentials
        self.admin_email = "lufarangae@gmail.com"
        self.admin_password = "555554444333221"
        
        # Test data storage
        self.test_category_id = None
        self.test_product_id = None
        self.test_message_id = None

    def log_result(self, test_name, success, details="", status_code=None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name} - PASSED")
            if details:
                print(f"   {details}")
        else:
            self.failed_tests.append({
                "test": test_name,
                "details": details,
                "status_code": status_code
            })
            print(f"❌ {test_name} - FAILED")
            if details:
                print(f"   {details}")
            if status_code:
                print(f"   Status Code: {status_code}")

    def make_request(self, method, endpoint, data=None, files=None, expected_status=200):
        """Make HTTP request with proper headers"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        
        if files:
            headers.pop('Content-Type', None)  # Let requests set it for multipart
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=headers)
            elif method == 'POST':
                if files:
                    response = self.session.post(url, files=files, headers=headers)
                else:
                    response = self.session.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=headers)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            success = response.status_code == expected_status
            response_data = {}
            
            try:
                response_data = response.json()
            except:
                response_data = {"text": response.text}
            
            return success, response_data, response.status_code
            
        except Exception as e:
            return False, {"error": str(e)}, None

    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, data, status = self.make_request('GET', '')
        expected_message = "VAMOS Couture API"
        
        if success and data.get('message') == expected_message:
            self.log_result("Root Endpoint", True, f"Message: {data.get('message')}")
        else:
            self.log_result("Root Endpoint", False, f"Expected message '{expected_message}', got: {data}", status)

    def test_admin_login(self):
        """Test admin login"""
        login_data = {
            "email": self.admin_email,
            "password": self.admin_password
        }
        
        success, data, status = self.make_request('POST', 'auth/login', login_data)
        
        if success and 'token' in data:
            self.token = data['token']
            self.log_result("Admin Login", True, f"Token received, User: {data.get('email')}")
            return True
        else:
            self.log_result("Admin Login", False, f"Login failed: {data}", status)
            return False

    def test_auth_me(self):
        """Test getting current user info"""
        if not self.token:
            self.log_result("Auth Me", False, "No token available")
            return
        
        success, data, status = self.make_request('GET', 'auth/me')
        
        if success and data.get('email') == self.admin_email:
            self.log_result("Auth Me", True, f"User info retrieved: {data.get('name')}")
        else:
            self.log_result("Auth Me", False, f"Failed to get user info: {data}", status)

    def test_get_categories(self):
        """Test getting categories"""
        success, data, status = self.make_request('GET', 'categories')
        
        if success and isinstance(data, list):
            self.log_result("Get Categories", True, f"Found {len(data)} categories")
            if data:
                # Store first category ID for later tests
                self.test_category_id = data[0]['id']
            return data
        else:
            self.log_result("Get Categories", False, f"Failed to get categories: {data}", status)
            return []

    def test_create_category(self):
        """Test creating a category"""
        if not self.token:
            self.log_result("Create Category", False, "No auth token")
            return
        
        category_data = {
            "name": f"Test Category {datetime.now().strftime('%H%M%S')}",
            "description": "Test category for API testing"
        }
        
        success, data, status = self.make_request('POST', 'categories', category_data, expected_status=200)
        
        if success and data.get('name') == category_data['name']:
            self.test_category_id = data['id']
            self.log_result("Create Category", True, f"Category created: {data['name']}")
            return data['id']
        else:
            self.log_result("Create Category", False, f"Failed to create category: {data}", status)
            return None

    def test_update_category(self):
        """Test updating a category"""
        if not self.token or not self.test_category_id:
            self.log_result("Update Category", False, "No auth token or category ID")
            return
        
        update_data = {
            "name": f"Updated Test Category {datetime.now().strftime('%H%M%S')}",
            "description": "Updated test category description"
        }
        
        success, data, status = self.make_request('PUT', f'categories/{self.test_category_id}', update_data)
        
        if success and data.get('name') == update_data['name']:
            self.log_result("Update Category", True, f"Category updated: {data['name']}")
        else:
            self.log_result("Update Category", False, f"Failed to update category: {data}", status)

    def test_get_products(self):
        """Test getting products"""
        success, data, status = self.make_request('GET', 'products')
        
        if success and isinstance(data, list):
            self.log_result("Get Products", True, f"Found {len(data)} products")
            return data
        else:
            self.log_result("Get Products", False, f"Failed to get products: {data}", status)
            return []

    def test_create_product(self):
        """Test creating a product"""
        if not self.token or not self.test_category_id:
            self.log_result("Create Product", False, "No auth token or category ID")
            return
        
        product_data = {
            "name": f"Test Product {datetime.now().strftime('%H%M%S')}",
            "description": "Test product for API testing",
            "price": 99.99,
            "category_id": self.test_category_id,
            "sizes": ["S", "M", "L", "XL"],
            "featured": True,
            "image_url": ""
        }
        
        success, data, status = self.make_request('POST', 'products', product_data, expected_status=200)
        
        if success and data.get('name') == product_data['name']:
            self.test_product_id = data['id']
            self.log_result("Create Product", True, f"Product created: {data['name']}")
            return data['id']
        else:
            self.log_result("Create Product", False, f"Failed to create product: {data}", status)
            return None

    def test_get_single_product(self):
        """Test getting a single product"""
        if not self.test_product_id:
            self.log_result("Get Single Product", False, "No product ID available")
            return
        
        success, data, status = self.make_request('GET', f'products/{self.test_product_id}')
        
        if success and data.get('id') == self.test_product_id:
            self.log_result("Get Single Product", True, f"Product retrieved: {data['name']}")
        else:
            self.log_result("Get Single Product", False, f"Failed to get product: {data}", status)

    def test_update_product(self):
        """Test updating a product"""
        if not self.token or not self.test_product_id or not self.test_category_id:
            self.log_result("Update Product", False, "Missing auth token, product ID, or category ID")
            return
        
        update_data = {
            "name": f"Updated Test Product {datetime.now().strftime('%H%M%S')}",
            "description": "Updated test product description",
            "price": 149.99,
            "category_id": self.test_category_id,
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "featured": False,
            "image_url": ""
        }
        
        success, data, status = self.make_request('PUT', f'products/{self.test_product_id}', update_data)
        
        if success and data.get('name') == update_data['name']:
            self.log_result("Update Product", True, f"Product updated: {data['name']}")
        else:
            self.log_result("Update Product", False, f"Failed to update product: {data}", status)

    def test_contact_form(self):
        """Test contact form submission"""
        contact_data = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": "test@example.com",
            "message": "This is a test message from the API testing suite."
        }
        
        success, data, status = self.make_request('POST', 'contact', contact_data, expected_status=200)
        
        if success and data.get('name') == contact_data['name']:
            self.test_message_id = data['id']
            self.log_result("Contact Form", True, f"Message submitted: {data['name']}")
            return data['id']
        else:
            self.log_result("Contact Form", False, f"Failed to submit contact: {data}", status)
            return None

    def test_get_messages(self):
        """Test getting contact messages (admin only)"""
        if not self.token:
            self.log_result("Get Messages", False, "No auth token")
            return
        
        success, data, status = self.make_request('GET', 'contact')
        
        if success and isinstance(data, list):
            self.log_result("Get Messages", True, f"Found {len(data)} messages")
        else:
            self.log_result("Get Messages", False, f"Failed to get messages: {data}", status)

    def test_logout(self):
        """Test logout"""
        success, data, status = self.make_request('POST', 'auth/logout')
        
        if success:
            self.log_result("Logout", True, "Successfully logged out")
            self.token = None
        else:
            self.log_result("Logout", False, f"Failed to logout: {data}", status)

    def cleanup_test_data(self):
        """Clean up test data"""
        if not self.token:
            # Re-login for cleanup
            self.test_admin_login()
        
        cleanup_results = []
        
        # Delete test product
        if self.test_product_id:
            success, data, status = self.make_request('DELETE', f'products/{self.test_product_id}')
            cleanup_results.append(f"Product cleanup: {'✅' if success else '❌'}")
        
        # Delete test category
        if self.test_category_id:
            success, data, status = self.make_request('DELETE', f'categories/{self.test_category_id}')
            cleanup_results.append(f"Category cleanup: {'✅' if success else '❌'}")
        
        # Delete test message
        if self.test_message_id:
            success, data, status = self.make_request('DELETE', f'contact/{self.test_message_id}')
            cleanup_results.append(f"Message cleanup: {'✅' if success else '❌'}")
        
        if cleanup_results:
            print(f"\n🧹 Cleanup: {', '.join(cleanup_results)}")

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting VAMOS Couture API Tests")
        print(f"📍 Base URL: {self.base_url}")
        print("=" * 60)
        
        # Basic tests
        self.test_root_endpoint()
        
        # Auth tests
        if self.test_admin_login():
            self.test_auth_me()
        
        # Category tests
        categories = self.test_get_categories()
        if categories:
            # Use existing category for product tests
            self.test_category_id = categories[0]['id']
        
        # Create new category for testing
        self.test_create_category()
        self.test_update_category()
        
        # Product tests
        self.test_get_products()
        self.test_create_product()
        self.test_get_single_product()
        self.test_update_product()
        
        # Contact tests
        self.test_contact_form()
        self.test_get_messages()
        
        # Auth tests
        self.test_logout()
        
        # Cleanup
        self.cleanup_test_data()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print(f"✅ Passed: {self.tests_passed}/{self.tests_run}")
        print(f"❌ Failed: {len(self.failed_tests)}/{self.tests_run}")
        
        if self.failed_tests:
            print("\n🔍 FAILED TESTS:")
            for failure in self.failed_tests:
                print(f"  • {failure['test']}: {failure['details']}")
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"\n📈 Success Rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    """Main function"""
    tester = VamosCoutureAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())