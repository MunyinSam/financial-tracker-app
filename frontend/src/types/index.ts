// Bank Account

export interface BankAccount {
    id: string;
    bankName: string;
    bankLogo: string;
    accountNumber: string;
    accountName: string;
    balance: number;
    accountType?: 'Savings' | 'Fixed' ;
    openedDate?: string;
    lastTransaction?: string;
    monthlyChange?: number;
}

export interface BankAccountsCarouselProps {
    accounts: BankAccount[];
    onAddAccount?: () => void;
}