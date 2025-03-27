'use server';
import postgres from "postgres";
import {Drive, Ship} from "@/lib/definitions";
import {unstable_cache} from "next/cache";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function fetchShips() {
    console.log("ships fetched");
    return sql<Ship[]>`
        SELECT *
        FROM ships
    `;
}

async function fetchDrives() {
    console.log("drives fetched");
    return sql<Drive[]>`
        SELECT *
        FROM drives
    `;
}

export const getCachedShips = unstable_cache(
    async () => fetchShips()
);

export const getCachedDrives = unstable_cache(
    async () => fetchDrives()
);