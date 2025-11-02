import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	bankAccountApi,
	BankAccountUpdatePayload,
} from './backAccount.service';

// Query keys or Cache
export const bankAccountKeys = {
	all: ['bank-accounts'] as const,
	summary: (userId: string) => ['bank-accounts', 'summary', userId] as const,
};

// GET all accounts
export const useBankAccounts = () => {
	return useQuery({
		queryKey: bankAccountKeys.all, // will save cache
		queryFn: bankAccountApi.getAll,
	});
};

// GET summary
export const useBankAccountSummary = (userId: string) => {
	return useQuery({
		queryKey: bankAccountKeys.summary(userId),
		queryFn: () => bankAccountApi.getSummary(userId),
		enabled: !!userId,
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
