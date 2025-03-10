import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getGroceries = query({
  args: { listId: v.string() },
  handler: async (ctx, args) => {
    const groceries = await ctx.db
      .query("groceries")
      .filter((q) => q.eq(q.field("listId"), args.listId))
      .collect();

    return groceries;
  },
});

export const addGrocery = mutation({
  args: {
    groceryId: v.string(),
    listId: v.string(),
    name: v.string(),
    category: v.string(),
    quantity: v.string(),
    price: v.number(),
    owners: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const grocery = await ctx.db.insert("groceries", {
      groceryId: args.groceryId,
      listId: args.listId,
      name: args.name,
      category: args.category,
      quantity: args.quantity,
      price: args.price,
      owners: args.owners,
      createdAt: Date.now(),
      updatedAt: Date.now(),
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
      .query("groceries")
      .filter((q) => q.eq(q.field("groceryId"), args.groceryId))
      .first();

    if (existingGrocery) {
      await ctx.db.patch(existingGrocery._id, {
        name: args.name,
        category: args.category,
        quantity: args.quantity,
        price: args.price,
        owners: args.owners,
        updatedAt: Date.now(),
      });
    }

    return existingGrocery;
  },
});

export const deleteGrocery = mutation({
  args: { groceryId: v.string() },
  handler: async (ctx, args) => {
    const existingGrocery = await ctx.db
      .query("groceries")
      .filter((q) => q.eq(q.field("groceryId"), args.groceryId))
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
        .query("groceries")
        .filter((q) => q.eq(q.field("groceryId"), groceryId))
        .first();

      if (existingGrocery) {
        await ctx.db.delete(existingGrocery._id);
      }
    }
  },
});
