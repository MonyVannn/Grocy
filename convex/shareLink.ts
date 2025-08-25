// convex/shareLinks.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { nanoid } from "nanoid";

export const createShareLink = mutation({
  args: { tripId: v.id("trips") },
  handler: async (ctx, { tripId }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Not authenticated");

    const token = nanoid(16);
    const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24h

    const id = await ctx.db.insert("shareLinks", {
      token,
      tripId,
      createdBy: user.subject,
      expiresAt,
    });

    return { url: `${process.env.NEXT_PUBLIC_APP_URL}/share/${token}` };
  },
});

// convex/shareLinks.ts
export const getSharedTrip = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const link = await ctx.db
      .query("shareLinks")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique();

    if (!link) throw new Error("Invalid link");
    if (Date.now() > link.expiresAt) throw new Error("Link expired");

    const trip = await ctx.db
      .query("lists")
      .filter((q) => q.eq(q.field("_id"), link.tripId));
    if (!trip) throw new Error("Trip not found");

    return trip;
  },
});
