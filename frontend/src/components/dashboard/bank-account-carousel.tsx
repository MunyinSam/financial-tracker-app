'use client'

import { BankAccount, BankAccountsCarouselProps } from "@/src/types"
import { BankAccountCard } from "./back-account-card";

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
                    {/* <AddBankAccountCard onAddAccount={onAddAccount} /> */}
                </div>
            </div>
        </div>
    );
}