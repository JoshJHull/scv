"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import clsx from "clsx";
import {House, Atom, ArrowLeftRight} from "lucide-react";

const links = [
    {
        name: 'SCV',
        href: '/',
        icon: House},
    {
        name: 'Quantum Race',
        href: '/race',
        icon: Atom},
    {
        name: 'Ship Compare',
        href: '/compare',
        icon: ArrowLeftRight},
];

export default function NavbarLinks() {
    const pathname = usePathname();
    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.name}
                        href={{pathname: link.href}}
                        className={clsx(
                            "flex h-[48px] grow items-center justify-center gap-2 bg-gray-600 text-white p-3 text-sm font-medium hover:bg-gray-400  md:flex-none md:justify-start md:p-2 md:px-3",
                            {
                                "bg-gray-700 text-white":
                                    pathname === link.href,
                            },
                        )}
                    >
                        <LinkIcon />
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}
