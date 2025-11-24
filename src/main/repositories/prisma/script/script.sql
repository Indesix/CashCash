-- ==========================================================
-- 1. NETTOYAGE ABSOLU (Pour éviter les conflits)
-- ==========================================================
SET FOREIGN_KEY_CHECKS = 0; -- On force la suppression sans vérifier les liens

DROP TABLE IF EXISTS Transaction;
DROP TABLE IF EXISTS Immeuble;
DROP TABLE IF EXISTS Tresorerie;

SET FOREIGN_KEY_CHECKS = 1; -- On réactive la sécurité


-- ==========================================================
-- 2. CRÉATION DES PARENTS (D'ABORD)
-- ==========================================================

-- A. TRESORERIE (Doit être créée en PREMIER car Transaction en a besoin)
CREATE TABLE Tresorerie (
    IdTresorerie    INT PRIMARY KEY,
    NomCompte       VARCHAR(50),
    SoldeInitial    DECIMAL(12,2) DEFAULT 0
);

-- B. IMMEUBLE (Doit être créée en DEUXIEME car Transaction en a besoin)
CREATE TABLE Immeuble (
    IdImmeuble      INT PRIMARY KEY,
    TypeImmeuble    VARCHAR(20) NOT NULL,
    Adresse         VARCHAR(255),
    RC              INT,
    Surface         DECIMAL(10,2),
    ValeurAchat     DECIMAL(12,2),
    
    -- Détails logement
    Chambres        INT,
    WC              INT,
    Grenier         BOOLEAN,
    Garage          BOOLEAN,
    Jardin          BOOLEAN,
    Balcon          BOOLEAN,
    Ascenseur       BOOLEAN,

    -- Détails commerce / Kot
    LoyerCommerce   DECIMAL(10,2),
    TypeCommerce    VARCHAR(50),
    Studio          BOOLEAN,
    Commun          BOOLEAN,
    NbColocs        INT
);


-- ==========================================================
-- 3. CRÉATION DE L'ENFANT (EN DERNIER)
-- ==========================================================

-- C. TRANSACTION (Doit être créée en DERNIER car elle pointe vers les deux autres)
CREATE TABLE Transaction (
    IdTransaction   INT PRIMARY KEY,
    DateTransaction DATETIME NOT NULL,
    Montant         DECIMAL(12,2) NOT NULL,
    TypeTransaction VARCHAR(50) NOT NULL,
    Description     VARCHAR(255),
    
    IdImmeuble      INT,          -- Peut être vide
    IdTresorerie    INT NOT NULL, -- Obligatoire

    -- C'est ici qu'on crée les liens. 
    -- Si Tresorerie ou Immeuble n'existent pas au dessus, ça plante.
    CONSTRAINT fk_transaction_tresorerie 
        FOREIGN KEY (IdTresorerie) REFERENCES Tresorerie(IdTresorerie),

    CONSTRAINT fk_transaction_immeuble 
        FOREIGN KEY (IdImmeuble) REFERENCES Immeuble(IdImmeuble)
);
