import { appRouter } from "@/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { error } from "console";

const handler = async (req: Request) => {
  try {
    return await fetchRequestHandler({
      onError: (error) => console.log(error),
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      //@ts-expect-error
      createContext: () => ({}),
    });
  } catch (err) {
    console.error("Error in tRPC handler:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export { handler as GET, handler as POST };
