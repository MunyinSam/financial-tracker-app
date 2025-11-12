'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	const pathname = usePathname();
	const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
		// Initialize from localStorage on mount
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('sidebar-open-items');
			if (saved) {
				return JSON.parse(saved);
			}
		}
		// Default: open items that match current path or are marked active
		const defaults: Record<string, boolean> = {};
		items.forEach((item) => {
			const isCurrentPath = item.items?.some((subItem) =>
				pathname.startsWith(subItem.url)
			);
			defaults[item.title] = item.isActive || isCurrentPath || false;
		});
		return defaults;
	});

	// Save to localStorage whenever openItems changes
	useEffect(() => {
		localStorage.setItem('sidebar-open-items', JSON.stringify(openItems));
	}, [openItems]);

	// Auto-open parent menu when navigating to a child page
	useEffect(() => {
		items.forEach((item) => {
			const isCurrentPath = item.items?.some((subItem) =>
				pathname.startsWith(subItem.url)
			);
			if (isCurrentPath && !openItems[item.title]) {
				setOpenItems((prev) => ({ ...prev, [item.title]: true }));
			}
		});
	}, [pathname, items]);

	const toggleItem = (title: string) => {
		setOpenItems((prev) => ({ ...prev, [title]: !prev[title] }));
	};

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					const isOpen = openItems[item.title] ?? false;

					return (
						<Collapsible
							key={item.title}
							asChild
							open={isOpen}
							onOpenChange={() => toggleItem(item.title)}
							className="group/collapsible"
						>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton tooltip={item.title}>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
										<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items?.map((subItem) => {
											const isActive =
												pathname === subItem.url;
											return (
												<SidebarMenuSubItem
													key={subItem.title}
												>
													<SidebarMenuSubButton
														asChild
														isActive={isActive}
													>
														<a href={subItem.url}>
															<span>
																{subItem.title}
															</span>
														</a>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											);
										})}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
