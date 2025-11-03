'use client';

import { AddBankAccountCard } from './add-bank-account-card';
import { BankAccountCard } from './bank-account-card';
import { BankAccount } from '@/src/types';

interface BankAccountsCarouselProps {
    accounts: BankAccount[];
    onAddAccount?: () => void;
}

export function BankAccountsCarousel({
    accounts,
}: BankAccountsCarouselProps) {
    return (
        <div className="w-full overflow-x-hidden">
            <div className="overflow-x-auto pb-4 -mx-4 px-4">
                <div className="flex gap-4 w-max">
                    {accounts.map((account) => (
                        <BankAccountCard key={account.id} {...account} />
                    ))}
                    <AddBankAccountCard/>
                </div>
            </div>
        </div>
    );
}