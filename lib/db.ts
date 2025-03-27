'use server';
import postgres from "postgres";
import {Drive, Ship} from "@/lib/definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchShips() {
    return sql<Ship[]>`
        SELECT *
        FROM ships
    `;
}

export async function fetchDrives() {
    return sql<Drive[]>`
        SELECT *
        FROM drives
    `;
}