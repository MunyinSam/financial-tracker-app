'use client';

import * as React from 'react';
import {
    Building2,
    Briefcase,
    CreditCard,
    DollarSign,
    FileText,
    TrendingUp,
    Wallet,
    Receipt,
    Package,
    Send,
    Settings,
    BarChart3,
} from 'lucide-react';

import { NavMain } from '@/src/components/nav-main';
import { NavProjects } from '@/src/components/nav-projects';
import { NavUser } from '@/src/components/nav-user';
import { TeamSwitcher } from '@/src/components/team-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';

// Financial Tracker Data
const data = {
    user: {
        name: 'John Doe',
        email: 'john@company.com',
        avatar: '/avatars/user.jpg',
    },
    teams: [
        {
            name: 'Personal Finance',
            logo: Wallet,
            plan: 'Premium',
        },
        {
            name: 'Business Account',
            logo: Building2,
            plan: 'Enterprise',
        },
        {
            name: 'Investment Portfolio',
            logo: TrendingUp,
            plan: 'Pro',
        },
    ],
    navMain: [
        {
            title: 'Bank Accounts',
            url: '/dashboard/accounts',
            icon: CreditCard,
            isActive: true,
            items: [
                {
                    title: 'Summary',
                    url: '/dashboard/accounts/summary',
                },
                {
                    title: 'Checking Account',
                    url: '/dashboard/accounts/checking',
                },
                {
                    title: 'Savings Account',
                    url: '/dashboard/accounts/savings',
                },
                {
                    title: 'Credit Cards',
                    url: '/dashboard/accounts/credit-cards',
                },
            ],
        },
        {
            title: 'Stocks & Investment',
            url: '/dashboard/investments',
            icon: TrendingUp,
            items: [
                {
                    title: 'Portfolio Overview',
                    url: '/dashboard/investments/portfolio',
                },
                {
                    title: 'Stocks',
                    url: '/dashboard/investments/stocks',
                },
                {
                    title: 'Mutual Funds',
                    url: '/dashboard/investments/mutual-funds',
                },
                {
                    title: 'Performance',
                    url: '/dashboard/investments/performance',
                },
            ],
        },
        {
            title: 'Paychecks',
            url: '/dashboard/paychecks',
            icon: DollarSign,
            items: [
                {
                    title: 'Recent Paychecks',
                    url: '/dashboard/paychecks/recent',
                },
                {
                    title: 'Pay Stubs',
                    url: '/dashboard/paychecks/stubs',
                },
                {
                    title: 'Tax Documents',
                    url: '/dashboard/paychecks/tax',
                },
                {
                    title: 'Benefits',
                    url: '/dashboard/paychecks/benefits',
                },
            ],
        },
        {
            title: 'Company',
            url: '/dashboard/company',
            icon: Building2,
            items: [
                {
                    title: 'Overview',
                    url: '/dashboard/company/overview',
                },
                {
                    title: 'Departments',
                    url: '/dashboard/company/departments',
                },
                {
                    title: 'Employees',
                    url: '/dashboard/company/employees',
                },
                {
                    title: 'Reports',
                    url: '/dashboard/company/reports',
                },
            ],
        },
        {
            title: 'Settings',
            url: '/dashboard/settings',
            icon: Settings,
            items: [
                {
                    title: 'Profile',
                    url: '/dashboard/settings/profile',
                },
                {
                    title: 'Security',
                    url: '/dashboard/settings/security',
                },
                {
                    title: 'Notifications',
                    url: '/dashboard/settings/notifications',
                },
                {
                    title: 'Preferences',
                    url: '/dashboard/settings/preferences',
                },
            ],
        },
    ],
    projects: [
        {
            name: 'Purchase Orders',
            url: '/dashboard/purchase-orders',
            icon: Package,
        },
        {
            name: 'Delivery Orders',
            url: '/dashboard/delivery-orders',
            icon: Send,
        },
        {
            name: 'Invoices',
            url: '/dashboard/invoices',
            icon: Receipt,
        },
        {
            name: 'Analytics',
            url: '/dashboard/analytics',
            icon: BarChart3,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}