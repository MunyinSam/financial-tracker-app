import { SearchIcon } from 'lucide-react';
import Link from 'next/link';

import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from '@/components/ui/empty';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { Kbd } from '@/components/ui/kbd';

export default function NotFound() {  // ✅ Default export with correct name
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Empty>
                <EmptyHeader>
                    <EmptyTitle>404 - Not Found</EmptyTitle>
                    <EmptyDescription>
                        The page you&apos;re looking for doesn&apos;t exist. Try
                        searching for what you need below.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <InputGroup className="sm:w-3/4">
                        <InputGroupInput placeholder="Try searching for pages..." />
                        <InputGroupAddon>
                            <SearchIcon />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                            <Kbd>/</Kbd>
                        </InputGroupAddon>
                    </InputGroup>
                    <EmptyDescription>
                        Need help?{' '}
                        <Link href="/" className="text-primary hover:underline">
                            Go back home
                        </Link>
                        {' or '}
                        <a href="#" className="text-primary hover:underline">
                            contact support
                        </a>
                    </EmptyDescription>
                </EmptyContent>
            </Empty>
        </div>
    );
}