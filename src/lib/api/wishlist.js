import { serverFetch } from "../core/server";

export const getWishList = async (userId) => {
    return await serverFetch(`wishlist/${userId}`);
}

