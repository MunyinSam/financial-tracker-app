import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	bankAccountApi,
	BankAccountCreatePayload,
	BankAccountUpdatePayload,
} from './backAccount.service';

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

// PUT update account
export const useUpdateBankAccount = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			accountId,
			payload,
		}: {
			accountId: string;
			payload: BankAccountUpdatePayload;
		}) => bankAccountApi.update(accountId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: bankAccountKeys.all });
		},
	});
};

// DELETE account
export const useDeleteBankAccount = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: bankAccountApi.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: bankAccountKeys.all });
		},
	});
};
