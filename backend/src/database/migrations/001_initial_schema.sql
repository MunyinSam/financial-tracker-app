-- This script creates the 4-table schema for a bank application in PostgreSQL.
-- We create tables in order of dependency: Person and Bank first,
-- then BankAccount, then Transactions.

-- Drop existing tables if they exist (for clean migration)
-- Drop in reverse order of dependencies
DROP TABLE IF EXISTS Transactions;
DROP TABLE IF EXISTS BankAccount;
DROP TABLE IF EXISTS Bank;
DROP TABLE IF EXISTS Person;

-- Table 1: Person
-- Stores personal details. We use DATE for DateOfBirth, not Age.
CREATE TABLE Person (
    PersonId SERIAL PRIMARY KEY,
    FName VARCHAR(100) NOT NULL,
    LName VARCHAR(100) NOT NULL,
    DateOfBirth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: Bank
-- Stores bank information (normalized to prevent data duplication).
CREATE TABLE Bank (
    BankId SERIAL PRIMARY KEY,
    BankName VARCHAR(255) NOT NULL,
    RoutingNumber VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 3: BankAccount
-- This table links a Person to a Bank.
CREATE TABLE BankAccount (
    AccountId SERIAL PRIMARY KEY,
    PersonId INT NOT NULL,
    BankId INT NOT NULL,
    AccountNumber VARCHAR(50) NOT NULL UNIQUE,
    Balance NUMERIC(19, 4) NOT NULL DEFAULT 0.00,
    AccountType VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_person
        FOREIGN KEY(PersonId) 
        REFERENCES Person(PersonId)
        ON DELETE CASCADE,

    CONSTRAINT fk_bank
        FOREIGN KEY(BankId) 
        REFERENCES Bank(BankId)
        ON DELETE CASCADE
);

-- Table 4: Transactions (renamed from Transaction to avoid reserved keyword)
-- Stores the transaction ledger for each account.
CREATE TABLE Transactions (
    TransactionId SERIAL PRIMARY KEY,
    AccountId INT NOT NULL,
    Amount NUMERIC(19, 4) NOT NULL,
    TransactionTimestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    TransactionType VARCHAR(50) NOT NULL,
    Description VARCHAR(255),

    CONSTRAINT fk_account
        FOREIGN KEY(AccountId) 
        REFERENCES BankAccount(AccountId)
        ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_bankaccount_person ON BankAccount(PersonId);
CREATE INDEX idx_bankaccount_bank ON BankAccount(BankId);
CREATE INDEX idx_transactions_account ON Transactions(AccountId);
CREATE INDEX idx_transactions_timestamp ON Transactions(TransactionTimestamp);