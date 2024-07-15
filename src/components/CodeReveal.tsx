'use client';

import { JSX, SVGProps, useState } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface CodeProps {
    code: string;
}

export default function CodeReveal({ code }: CodeProps) {
    const [isCopied, setIsCopied] = useState(false);
    const [isOpened, setIsOpened] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleOpen = () => {
        if (isOpened) setIsOpened(false);
        if (!isOpened) setIsOpened(true);
    };

    return (
        <div className="flex flex-col justify-center items-center ">
            <div className="mb-5 mt-3">
                <Button variant={'outline'} onClick={handleOpen}>
                    Code
                </Button>
            </div>
            <div
                className={cn(
                    'flex space-x-4 border-2 border-gray-200 p-4 rounded-md',
                    {
                        hidden: !isOpened,
                    }
                )}
            >
                <div className="lg:max-w-2xl">
                    <pre className="">
                        <code className="whitespace-pre-wrap break-words">{code}</code>
                    </pre>
                </div>
                <div>
                    <Button
                        variant="outline"
                        onClick={handleCopy}
                        size="sm"
                        className="-mr-3 -mt-5"
                    >
                        <CopyIcon className="mr-2 h-4 w-4" />
                        {isCopied ? 'Copied' : 'Copy'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function CopyIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
    );
}

function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}
