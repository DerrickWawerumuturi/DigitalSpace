import express from "express";
import { webhookRequest } from "./server";
import { stripe } from "./lib/stripe";
import type Stripe from "stripe";
import { getPayloadClient } from "./get-payload";
import { Product } from "./payload-types";
import { Resend } from "resend";
import { ReceiptEmailHtml } from "./components/emails/ReceiptEmail";
import Mailjet from "node-mailjet";

const mailjet = Mailjet.apiConnect(
  `${process.env.EMAIL_API_KEY}`,
  `${process.env.EMAIL_API_SECRET_KEY}`
);

export const stripeWebhookHandler = async (
  req: express.Request,
  res: express.Response
) => {
  const webhookRequest = req as any as webhookRequest;
  const body = webhookRequest.rawBody;
  const signature = req.headers["stripe-signature"] || "";

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    return res
      .status(400)
      .send(
        `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`
      );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (!session?.metadata?.userId || !session?.metadata?.orderId) {
    return res.status(400).send(`Webhook Error: No user present in metadata`);
  }

  if (event.type === "checkout.session.completed") {
    const payload = await getPayloadClient();

    const { docs: users } = await payload.find({
      collection: "users",
      where: {
        id: {
          equals: session.metadata.userId,
        },
      },
    });

    const [user] = users;

    if (!user) return res.status(404).json({ error: "No such user exists." });

    const { docs: orders } = await payload.find({
      collection: "orders",
      depth: 2,
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    });

    const [order] = orders;

    if (!user) return res.status(404).json({ error: "No such order exists." });

    await payload.update({
      collection: "orders",
      data: {
        _isPaid: true,
      },
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    });

    // send receipt
    try {
      const request = mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "wawerumuturi57@gmail.com",
              Name: "DigitalSpace",
            },
            To: [
              {
                Email: user.email,
                Name: user.name,
              },
            ],
            Subject: "Thanks for your order! This is your receipt.",
            HTMLPart: ReceiptEmailHtml({
              date: new Date(),
              email: String(user.email),
              orderId: session.metadata.orderId,
              products: order.products as Product[],
            }),
          },
        ],
      });

      const result = await request;
      console.log(result.body);
    } catch (err) {
      console.error("Error sending email:", err);
    }
  }

  return res.status(200).send();
};
