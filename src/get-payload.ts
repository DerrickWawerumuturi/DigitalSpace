import dotenv from "dotenv";
import path from "path";
import payload, { Payload } from "payload";
import { InitOptions } from "payload/config";
import Mailjet from "node-mailjet";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { PrimaryActionEmailHtml } from "./components/emails/PrimaryActionEmail";
import bcrypt from "bcrypt";
import { Users } from "./collections/users";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// Generate JWT Secret
const generateJWTSecret = () => {
  return crypto.randomBytes(8).toString("hex");
};

const jwtSecret = generateJWTSecret();

const mailJet = Mailjet.apiConnect(
  `${process.env.EMAIL_API_KEY}`,
  `${process.env.EMAIL_API_SECRET_KEY}`
);

let cached = (global as any).payload;

if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null,
  };
}

interface Args {
  initOptions?: Partial<InitOptions>;
}

interface VerifyProps {
  userId: string | number;
  userEmail: string;
}

export const sendVerificationEmail = async ({
  userEmail,
  userId,
}: VerifyProps) => {
  const token = jwt.sign({ id: userId }, jwtSecret, { expiresIn: "1h" });
  const hashedToken = bcrypt.hashSync(token, 10);

  await payload.update({
    collection: "users",
    id: userId,
    data: {
      _verified: false,
      _verificationToken: hashedToken,
    },
  });

  const verificationLink = `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${hashedToken}`;

  const emailHTML = PrimaryActionEmailHtml({
    actionLabel: "Verify Your Account",
    buttonText: "Verify your account",
    href: verificationLink,
  });

  const emailData = {
    Messages: [
      {
        From: {
          Email: "wawerumuturi57@gmail.com",
          Name: "Digital Space",
        },
        To: [
          {
            Email: userEmail,
            Name: "User",
          },
        ],
        Subject: "Confirm Your Email",
        HTMLPart: emailHTML,
      },
    ],
  };

  try {
    const response = await mailJet
      .post("send", { version: "v3.1" })
      .request(emailData);
    console.log("Email sent:", response.body);
    return true;
  } catch (err) {
    console.error("Error sending email:", err);
    return false;
  }
};

export const getPayloadClient = async ({
  initOptions,
}: Args = {}): Promise<Payload> => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET is missing");
  }

  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    cached.promise = payload.init({
      secret: process.env.PAYLOAD_SECRET,
      local: initOptions?.express ? false : true,
      ...(initOptions || {}),
    });
  }

  try {
    cached.client = await cached.promise;
  } catch (e: unknown) {
    cached.promise = null;
    throw e;
  }
  return cached.client;
};
