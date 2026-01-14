import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../../server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { NextRequest } from "next/server";

const createContext = async (req: NextRequest) => {
    return createTRPCContext({ headers: req.headers, req });
};

const handler = (req: NextRequest) =>
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext: () => createContext(req),
    });

export { handler as GET, handler as POST };
