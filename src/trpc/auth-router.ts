import { AuthCredentialsValidator } from "../lib/Validators/account-credentials-validator";
import { publicProcedure, router } from "./trpc";
import { sendVerificationEmail } from "../get-payload";
import { getPayloadClient } from "../get-payload";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const authRouter = router({
  createPayloadUser: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const payload = await getPayloadClient();

      // Check if the user already exists
      const { docs: users } = await payload.find({
        collection: "users",
        overrideAccess: true,
        where: {
          email: {
            equals: email,
          },
        },
      });
      if (users.length !== 0) throw new TRPCError({ code: "CONFLICT" });

      // Create a new user
      const newUser = await payload.create({
        collection: "users",
        data: {
          email,
          password,
          role: "user",
        },
      });

      const emailSent = await sendVerificationEmail({
        userEmail: email,
        userId: newUser.id,
      });

      if (!emailSent) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send verification email",
        });
      }

      return { success: true, sentToEmail: email };
    }),
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const { token } = input;

      const payload = await getPayloadClient();

      const isVerified = await payload.verifyEmail({
        collection: "users",
        token,
      });
      if (!isVerified) throw new TRPCError({ code: "UNAUTHORIZED" });

      return { success: true };
    }),

  signIn: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const { res } = ctx;
      const payload = await getPayloadClient();

      try {
        await payload.login({
          collection: "users",
          data: {
            email,
            password,
          },
          res,
        });

        return { success: true };
      } catch (err) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
    }),
});
