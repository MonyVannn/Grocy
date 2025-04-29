/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as dashboard from "../dashboard.js";
import type * as expenseLists from "../expenseLists.js";
import type * as expenses from "../expenses.js";
import type * as groceries from "../groceries.js";
import type * as groceryLists from "../groceryLists.js";
import type * as http from "../http.js";
import type * as members from "../members.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  dashboard: typeof dashboard;
  expenseLists: typeof expenseLists;
  expenses: typeof expenses;
  groceries: typeof groceries;
  groceryLists: typeof groceryLists;
  http: typeof http;
  members: typeof members;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
