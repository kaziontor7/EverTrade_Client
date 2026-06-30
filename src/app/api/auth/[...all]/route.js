import { auth } from "../../../../lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const { GET, POST } = toNextJsHandler(auth);
