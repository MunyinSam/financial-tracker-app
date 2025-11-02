import fs from 'fs';
import path from 'path';

// Simple queries inline
export const bankAccountQueries = {
	findAll: `SELECT * FROM BankAccount ORDER BY AccountId DESC`,
	findById: `SELECT * FROM BankAccount WHERE AccountId = $1`,
	create: `
        INSERT INTO BankAccount (UserId, BankName, BankLogo, AccountNumber, AccountName, Balance, AccountType, OpenedDate)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `,
	update: `
        UPDATE BankAccount 
        SET BankName = $2, AccountName = $3, Balance = $4, AccountType = $5
        WHERE AccountId = $1
        RETURNING *
    `,
	delete: `DELETE FROM BankAccount WHERE AccountId = $1 RETURNING *`,
};

// Complex queries from .sql files (if needed later)
// const loadSqlFile = (filename: string) =>
//     fs.readFileSync(path.join(__dirname, 'sql', filename), 'utf-8');
//
// complexReport: loadSqlFile('complex-report.sql')
