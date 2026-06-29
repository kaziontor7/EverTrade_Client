'use server'

import { protectedFetch } from "../core/server";

export const getUserPayments = async (userId) => {
    return await protectedFetch(`payments/${userId}`);
}
