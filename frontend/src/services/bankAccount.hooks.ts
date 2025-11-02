import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bankAccountApi, BankAccountCreatePayload } from './backAccount.service';

// Simple query keys
export const bankAccountKeys = {
    all: ['bank-accounts'] as const,
};

// GET all accounts
export const useBankAccounts = () => {
    return useQuery({
        queryKey: bankAccountKeys.all, // will save cache
        queryFn: bankAccountApi.getAll,
    });
};

// POST create account
export const useCreateBankAccount = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: bankAccountApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bankAccountKeys.all });
        },
    });
};