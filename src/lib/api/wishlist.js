import { protectedFetch } from "../core/server";

export const getWishList = async (userId) => {
    return await protectedFetch(`wishlist/${userId}`);
}

