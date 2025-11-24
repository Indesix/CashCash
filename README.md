git clone https://github.com/Indesix/# CashCashApp 💰

Application de gestion immobilière et de trésorerie développée avec Electron, Vue 3 et Prisma.

## 🚀 Installation et Configuration

Suivez ces étapes pour lancer le projet localement.

### 1. Cloner le projet

```bash
git clone https://github.com/Indesix/CashCash.git cashcashapp
cd cashcashapp
```

### 2. Création de la base de données MySQL

Assurez-vous d'avoir un serveur MySQL en cours d'exécution.
Créez une nouvelle base de données (par exemple `cash_cash`).

### 3. Installation des dépendances

Installez les paquets nécessaires via npm :

```bash
npm install
```

### 4. Configuration de Prisma

1. Créez un fichier `.env` à la racine du dossier `cashcashapp`.
2. Ajoutez-y la variable de connexion suivante (adaptez `user:password` et le port si nécessaire) :

```env
DATABASE_URL="mysql://user:password@localhost:3306/cash_cash"
```

3. Générez le client Prisma pour faire le lien avec la base de données :

```bash
npx prisma generate
```

*(Optionnel : Si votre base de données est vide, vous pouvez pousser le schéma avec `npx prisma db push`)*

### 5. Lancer l'application

Démarrez l'application en mode développement :

```bash
npm run start
```

## ✨ Fonctionnalités principales

- **Gestion de Trésorerie** : 
  - Ajouter un nouveau compte bancaire.
  - Voir le solde des comptes.
- **Gestion Immobilière** : 
  - Ajouter un immeuble.
  - Modifier les informations d'un immeuble.
  - Supprimer un immeuble..git

