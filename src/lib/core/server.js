'use server'

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
    const res = await fetch(`${API_URL}/${endpoint}`,
        {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }
    )

    return handleStatus(res);
}


