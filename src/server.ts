import express from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { inferAsyncReturnType } from "@trpc/server";
import nextBuild from "next/dist/build";
import { PayloadRequest } from "payload/types";
import { parse } from "url";
import path from "path";
import bodyParser from "body-parser";
import { IncomingMessage } from "http";
import { stripeWebhookHandler } from "./webhooks";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

export type ExpressContext = inferAsyncReturnType<typeof createContext>;
export type webhookRequest = IncomingMessage & { rawBody: Buffer };

const start = async () => {
  const webhookMiddleWare = bodyParser.json({
    verify: (req: webhookRequest, _, buffer) => {
      req.rawBody = buffer;
    },
  });

  app.post("/api/webhooks/stripe", webhookMiddleWare, stripeWebhookHandler);

  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL ${cms.getAPIURL()}`);
      },
    },
  });

  app.use((req, res) => nextHandler(req, res));

  app.use(
    `/api/trpc`,
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  const cartRouter = express.Router();

  cartRouter.use(payload.authenticate);

  cartRouter.get("/", (req, res) => {
    const request = req as PayloadRequest;

    if (!request.user) return res.redirect("/sign-in?origin=cart");

    const pareUrl = parse(req.url, true);

    return nextApp.render(req, res, "/cart", pareUrl.query);
  });

  app.use("/cart", cartRouter);
  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info("Next js is building for production ");
      // @ts-expect-error
      await nextBuild(path.join(__dirname, "../"));
      process.exit();
    });
    return;
  }
  app.use((req, res) => nextHandler(req, res));

  nextApp.prepare().then(() => {
    payload.logger.info("Next.js started");

    app.listen(PORT, async () => {
      payload.logger.info(
        `Next.js APP URL :${process.env.NEXT_PUBLIC_SERVER_URL}`
      );
    });
  });
};

start();
