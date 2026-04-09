# VAMOS Couture - PRD (Product Requirements Document)

## Énoncé du problème original
Site web simple et épuré pour VAMOS - Centre de Formation Professionnelle "Crois Seulement", une maison de couture à Kinshasa, RDC.

## Architecture
- **Frontend**: React avec Tailwind CSS, Shadcn/UI
- **Backend**: FastAPI (Python)
- **Base de données**: MongoDB
- **Authentification**: JWT avec bcrypt

## Personas utilisateurs
1. **Clients**: Visiteurs cherchant des vêtements sur mesure
2. **Admin (M. Ramazani Usseni)**: Gestion des produits et commandes

## Exigences principales (statiques)
- Design simple, épuré, professionnel
- Couleurs: Bleu nuit (#0F172A), Rose pâle (#FCE7F3), Blanc
- Commandes via WhatsApp (pas de paiement en ligne)
- Interface admin pour CRUD produits/catégories
- Responsive mobile

## Fonctionnalités implémentées (09/04/2026)
- ✅ Page d'accueil avec hero, produits vedettes, CTA WhatsApp
- ✅ Page Boutique avec filtres par catégories
- ✅ Page Détails produit avec sélection taille/quantité
- ✅ Page À propos avec historique et tarifs formation
- ✅ Page Contact avec formulaire
- ✅ Dashboard Admin (produits, catégories, messages)
- ✅ Système de commande WhatsApp dynamique
- ✅ Upload d'images produits
- ✅ Catégories pré-définies: Homme, Femme, Traditionnel, Mariage, Décontracté

## Backlog priorisé
### P0 - Critique
(Aucun - MVP complet)

### P1 - Important
- [ ] Ajout de produits de démonstration avec vraies images
- [ ] Galerie d'images multiples par produit

### P2 - Souhaitable
- [ ] Statistiques de visites
- [ ] Mode sombre
- [ ] Optimisation SEO

## Prochaines tâches
1. Ajouter des produits réels via le dashboard admin
2. Personnaliser les images des produits
3. Configurer le numéro WhatsApp définitif si différent

## Informations de contact
- **Email**: lufarangae@gmail.com
- **WhatsApp**: +243 814 773 188
- **Adresse**: Av/ Sama n° 32, Q/Ngombankikusa, C/Ngaliema, Kinshasa
- **Instagram**: @croisseulement
- **TikTok**: @ussenimode
