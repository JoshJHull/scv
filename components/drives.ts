'use server';
import sql from "@/lib/db";

export async function getDrives(size: number) {
    return await sql`
        select id from drives
        where size = ${size}
    `;
}