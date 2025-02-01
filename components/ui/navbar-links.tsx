"use client";

import Link from 'next/link';
import {usePathname} from "next/navigation";
import clsx from "clsx";
import Home from "@/public/home.svg";
import RaceFlag from "@/public/race-flag.svg";
import CompareArrows from "@/public/compare_arrows.svg";

const links = [
    {
        name: 'Home',
        href: '/',
        icon: Home},
    {
        name: 'Quantum Race',
        href: '/race',
        icon: RaceFlag},
    {
        name: 'Ship Compare',
        href: '/compare',
        icon: CompareArrows},
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
                        href={link.href}
                        className={clsx(
                            "flex h-[48px] grow items-center justify-center gap-2 bg-_dark-gray text-_white p-3 text-sm font-medium hover:bg-_light-gray  md:flex-none md:justify-start md:p-2 md:px-3",
                            {
                                "bg-_light-gray text-_white": pathname === link.href,
                            }
                        )}
                    >
                        <LinkIcon fill={"white"}/>
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}
