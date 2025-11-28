# CashCashApp 💰

Application de gestion immobilière et de trésorerie développée avec Electron, Vue 3 et Prisma.

## 🚀 Installation et Configuration

Suivez ces étapes pour lancer le projet sur une nouvelle machine.

### 1. Prérequis

*   **Node.js** (v16 ou supérieur)
*   **MySQL** (Serveur en cours d'exécution)
*   **Git**

### 2. Récupération du projet

```bash
git clone https://github.com/Indesix/CashCash.git
cd CashCash/cashcashapp
```

### 3. Configuration de l'environnement

1.  Créez un fichier nommé `.env` à la racine du dossier `cashcashapp`.
2.  Ajoutez-y la configuration de votre base de données locale :

```env
# Remplacez user, password et le nom de la base de données par vos informations
DATABASE_URL="mysql://root:password@localhost:3306/cash_cash"
```

### 4. Installation

Cette commande installe les dépendances et génère automatiquement le client Prisma.

```bash
npm install
```

### 5. Initialisation de la Base de Données

Si votre base de données est vide, créez les tables automatiquement avec cette commande :

```bash
npm run db:push
```

*(Si vous avez déjà une base de données existante et que vous voulez mettre à jour le code en fonction de celle-ci, utilisez `npm run db:pull`)*

### 6. Lancer l'application

```bash
npm start
```

## 🛠️ Commandes Utiles

*   `npm run generate` : Régénère le client Prisma (utile si vous changez de machine ou si vous avez des erreurs de type "Prisma Client not found").
*   `npm run db:push` : Envoie le schéma du code vers la base de données (Création/Mise à jour des tables).
*   `npm run db:pull` : Récupère le schéma de la base de données vers le code.

## ✨ Fonctionnalités principales

Objectif: permettre à un investisseur en immobilier de gérer son patrimoine (achat, vente, entretien, location) et visualiser sa trésorerie.

- **Gestion de Trésorerie** : 
  - Ajouter un nouveau compte bancaire.
  - Voir le solde des comptes.
- **Gestion Immobilière** : 
  - Ajouter un immeuble.
  - Modifier les informations d'un immeuble.
  - Supprimer un immeuble.
  - Gérer les locataires (Ajout/Suppression/Lien avec immeuble).
  - Gérer les entretiens..git

