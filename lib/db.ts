'use server';
import postgres from "postgres";
import {Ship} from "@/lib/definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchShips() {
    return sql<Ship[]>`
        SELECT *
        FROM ships
    `;
}

export async function fetchDrives(size: number) {
    return sql`
        SELECT id
        FROM drives
        WHERE size = ${size}
    `;
}