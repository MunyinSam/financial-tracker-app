import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { BankAccountsCarousel } from '@/src/components/dashboard/bank-account-carousel';

const mockBankAccounts = [
    {
        id: '1',
        bankName: 'Kasikorn Bank',
        bankLogo: '/Kbank.svg',
        accountNumber: '****1234',
        accountName: 'John Doe Savings',
        balance: 125420.5,
        accountType: 'Savings' as const,
        openedDate: '2023-01-15',
        lastTransaction: '2024-10-28',
        monthlyChange: 2250.75,
    },
    {
        id: '2',
        bankName: 'Bangkok Bank',
        bankLogo: '/BangkokBank.svg',
        accountNumber: '****5678',
        accountName: 'Business Checking',
        balance: 85750.25,
        accountType: 'Savings' as const, // Changed from 'Fixed'
        openedDate: '2022-06-10',
        lastTransaction: '2024-10-29',
        monthlyChange: -1320.0,
    },
    {
        id: '3',
        bankName: 'SCB Bank',
        bankLogo: '/SCB.svg',
        accountNumber: '****9012',
        accountName: 'Premium Credit Card',
        balance: -15250.8,
        accountType: 'Savings' as const, // Changed from 'Fixed' - or update interface
        openedDate: '2021-03-22',
        lastTransaction: '2024-10-29',
        monthlyChange: -2185.3,
    },
    {
        id: '4',
        bankName: 'Krung Thai Bank',
        bankLogo: '/Krungthai.svg',
        accountNumber: '****3456',
        accountName: 'Fixed Deposit',
        balance: 500000.0,
        accountType: 'Fixed' as const,
        openedDate: '2023-08-05',
        lastTransaction: '2024-09-15',
        monthlyChange: 4250.0,
    },
    {
        id: '5',
        bankName: 'KKP Bank',
        bankLogo: '/Kkp.svg',
        accountNumber: '****7890',
        accountName: 'Travel Savings',
        balance: 45680.9,
        accountType: 'Savings' as const,
        openedDate: '2024-02-10',
        lastTransaction: '2024-10-27',
        monthlyChange: 890.45,
    },
];

export default function Page() {
    return (
        <div>
            <div className="pb-3 text-2xl font-semibold">Bank Accounts</div>
            <div className="w-full">
                <BankAccountsCarousel accounts={mockBankAccounts} />
            </div>
        </div>
    );
}