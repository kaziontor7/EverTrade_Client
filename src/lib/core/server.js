'use server'

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const handleStatus = (res) => {
    if (res.status === 401) {
        redirect("/unauthorized");
    }
    if (res.status === 403) {
        redirect("/not-found");
    }
    return res.json();
}

export const serverFetch = async (path) => {
    const res = await fetch(`${API_URL}/${path}`)
    return res.json();
}


export const serverMutation = async (endpoint, data, method = "POST") => {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    if (data) {
        options.body = JSON.stringify(data);
    }
    const res = await fetch(`${API_URL}/${endpoint}`, options);

    return handleStatus(res);
}

export const revalidate = async (path) => {
    'use server'
    return revalidatePath(path);
}

