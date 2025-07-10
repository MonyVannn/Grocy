import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getGroceries = query({
  args: { listId: v.string() },
  handler: async (ctx, args) => {
    const groceries = await ctx.db
      .query("items")
      .filter((q) => q.eq(q.field("listId"), args.listId))
      .collect();

    return groceries;
  },
});

export const addGrocery = mutation({
  args: {
    userId: v.id("users"),
    listId: v.id("lists"),
    name: v.string(),
    category: v.string(),
    quantity: v.string(),
    price: v.number(),
    owners: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const grocery = await ctx.db.insert("items", {
      userId: args.userId,
      listId: args.listId,
      itemName: args.name,
      category: args.category,
      quantity: Number(args.quantity),
      totalItemPrice: args.price,
      owners: args.owners,
    });

    return grocery;
  },
});

export const updateGrocery = mutation({
  args: {
    groceryId: v.string(),
    name: v.string(),
    category: v.string(),
    quantity: v.string(),
    price: v.number(),
    owners: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existingGrocery = await ctx.db
      .query("items")
      .filter((q) => q.eq(q.field("_id"), args.groceryId))
      .first();

    if (existingGrocery) {
      await ctx.db.patch(existingGrocery._id, {
        itemName: args.name,
        category: args.category,
        quantity: Number(args.quantity),
        totalItemPrice: args.price,
        owners: args.owners,
      });
    }

    return existingGrocery;
  },
});

export const deleteGrocery = mutation({
  args: { groceryId: v.string() },
  handler: async (ctx, args) => {
    const existingGrocery = await ctx.db
      .query("items")
      .filter((q) => q.eq(q.field("_id"), args.groceryId))
      .first();

    if (existingGrocery) {
      await ctx.db.delete(existingGrocery._id);
    }
  },
});

export const bulkDeleteGroceries = mutation({
  args: { groceryIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    for (const groceryId of args.groceryIds) {
      const existingGrocery = await ctx.db
        .query("items")
        .filter((q) => q.eq(q.field("_id"), groceryId))
        .first();

      if (existingGrocery) {
        await ctx.db.delete(existingGrocery._id);
      }
    }
  },
});
