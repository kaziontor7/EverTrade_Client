import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function getUserSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user || null;
}

export async function getUserToken() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.session?.token || null;
}

export async function requireRole(role) {
  const user = await getUserSession();
  if (!user) {
    redirect("/signin");
  }
  if (user.role !== role) {
    redirect("/unauthorized");
  }
  return user;
}
