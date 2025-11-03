import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	stockHoldingsApi,
	CreateStockHoldingRequest,
	UpdateStockHoldingRequest,
} from './stockHoldings.service';
import { toast } from 'sonner';

export const stockHoldingsKeys = {
	all: ['stockHoldings'] as const,
	user: (userId: number) =>
		[...stockHoldingsKeys.all, 'user', userId] as const,
	detail: (stockId: number) =>
		[...stockHoldingsKeys.all, 'detail', stockId] as const,
};

// Get all holdings for a user
export const useUserStockHoldings = (userId: number) => {
	return useQuery({
		queryKey: stockHoldingsKeys.user(userId),
		queryFn: () => stockHoldingsApi.getUserHoldings(userId),
		enabled: !!userId,
	});
};

// Get a specific holding
export const useStockHolding = (stockId: number, userId: number) => {
	return useQuery({
		queryKey: stockHoldingsKeys.detail(stockId),
		queryFn: () => stockHoldingsApi.getHoldingById(stockId, userId),
		enabled: !!stockId && !!userId,
	});
};

// Create a new holding
export const useCreateStockHolding = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateStockHoldingRequest) =>
			stockHoldingsApi.create(data),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: stockHoldingsKeys.user(data.userid),
			});
			toast.success('Stock added to portfolio successfully!');
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Failed to add stock to portfolio');
		},
	});
};

// Update a holding
export const useUpdateStockHolding = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			stockId,
			data,
		}: {
			stockId: number;
			data: UpdateStockHoldingRequest;
		}) => stockHoldingsApi.update(stockId, data),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: stockHoldingsKeys.detail(data.stockid),
			});
			queryClient.invalidateQueries({
				queryKey: stockHoldingsKeys.user(data.userid),
			});
			toast.success('Stock holding updated successfully!');
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Failed to update stock holding');
		},
	});
};

// Delete a holding
export const useDeleteStockHolding = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			stockId,
			userId,
		}: {
			stockId: number;
			userId: number;
		}) => stockHoldingsApi.delete(stockId, userId),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: stockHoldingsKeys.user(variables.userId),
			});
			toast.success('Stock removed from portfolio successfully!');
		},
		onError: (error: Error) => {
			toast.error(
				error.message || 'Failed to remove stock from portfolio'
			);
		},
	});
};
