'use server'
import { headers } from "next/headers";
import { auth } from "../auth";

export const getUserSession = async () => {
    'use server'
    const session = await auth.api.getSession({
        headers: await headers()
    });
    return session?.user || null;
}