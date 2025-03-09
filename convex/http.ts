import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",

  handler: httpAction(async (ctx, req) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("CLERK_WEBHOOK_SECRET is not set");
    }

    const svix_id = req.headers.get("svix-id");
    const svix_signature = req.headers.get("svix-signature");
    const svix_timestamp = req.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      throw new Response("Missing headers", { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-signature": svix_signature,
        "svix-timestamp": svix_timestamp,
      }) as WebhookEvent;
    } catch (e) {
      console.error("Errow verifying webhook", e);
      return new Response("Invalid signature", { status: 400 });
    }

    const eventType = evt.type;
    if (eventType === "user.created") {
      // Send user data to Convex
      const { id, email_addresses, first_name, last_name } = evt.data;

      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        // Save user to Convex
        await ctx.runMutation(api.users.syncUser, {
          userId: id,
          email,
          name,
        });
      } catch (e) {
        console.error("Error saving user", e);
        return new Response("Error saving user", { status: 500 });
      }
    }
    return new Response("User saved", { status: 200 });
  }),
});

export default http;
