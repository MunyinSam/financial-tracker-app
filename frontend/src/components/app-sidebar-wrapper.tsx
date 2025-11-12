'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const AppSidebarComponent = dynamic(
	() => import('./app-sidebar').then((mod) => ({ default: mod.AppSidebar })),
	{
		ssr: false,
		loading: () => (
			<div className="flex h-full w-[280px] flex-col gap-2 border-r bg-sidebar p-2">
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
			</div>
		),
	}
);

export function AppSidebarWrapper(props: any) {
	return <AppSidebarComponent {...props} />;
}
