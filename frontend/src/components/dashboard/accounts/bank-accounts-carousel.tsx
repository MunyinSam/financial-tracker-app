'use client';

import { BankAccountCard } from './bank-account-card';
import { AddBankAccountCard } from './add-bank-account-card';

interface BankAccount {
    id: string;
    bankName: string;
    bankLogo: string;
    accountNumber: string;
    accountName: string;
    balance: number;
    accountType?: 'Savings' | 'Checking' | 'Credit';
    openedDate?: string;
    lastTransaction?: string;
    monthlyChange?: number;
}

interface BankAccountsCarouselProps {
    accounts: BankAccount[];
    onAddAccount?: () => void;
}

export function BankAccountsCarousel({
    accounts,
    onAddAccount,
}: BankAccountsCarouselProps) {
    return (
        <div className="w-full">
            <div className="overflow-x-auto pb-4 -mx-4 px-4">
                <div className="flex gap-4 w-max">
                    {accounts.map((account) => (
                        <BankAccountCard key={account.id} {...account} />
                    ))}
                    <AddBankAccountCard onAddAccount={onAddAccount} />
                </div>
            </div>
        </div>
    );
}