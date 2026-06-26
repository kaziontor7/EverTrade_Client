import { auth } from "@/lib/auth";
import { toNextRouteHandler } from "better-auth/next-action";

export const { GET, POST } = toNextRouteHandler(auth);
