import { Id } from "@/convex/_generated/dataModel";

export interface User {
  _id: Id<"users">;
  clerkUserId: string;
  email: string;
  name: string;
  role: string;
}

export interface Member {
  _id: Id<"members">;
  userId: Id<"users">;
  memberName: string;
  memberEmail: string;
  role: string;
  _creationTime: number;
}

export interface GroceryList {
  _id?: Id<"lists">;
  listId: string;
  userId: string;
  listName: string;
  listDate: number;
  payerMemberId: string;
  notes?: string;
  isSettled: boolean;
  totalAmount: number;
  totalItems: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface Grocery {
  _id?: Id<"items">;
  userId: string;
  listId: string;
  itemName: string;
  category?: string;
  quantity?: number;
  totalItemPrice: number;
  owners: string[];
  createdAt?: number;
  updatedAt?: number;
}

export interface Splits {
  _id?: string;
  itemName: string;
  splits: {
    memberName: string;
    shareAmount: number;
    isPaid: boolean;
    note: string;
  }[];
}
