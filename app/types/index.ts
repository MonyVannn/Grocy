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
  listId: string;
  userId: string;
  date: number;
  shopperId: string;
  note?: string;
  isPaid: boolean;
  itemsAmount: number;
  totalPrice: number;
  items: [
    {
      listId: string;
      groceryId: string;
      name: string;
      category: string;
      quantity: string;
      price: number;
      owners: string[];
    },
  ];
  createdAt?: number;
  updatedAt?: number;
}

export interface Grocery {
  groceryId: string;
  listId: string;
  name: string;
  category: string;
  quantity: string;
  price: number;
  owners: string[];
  createdAt?: number;
  updatedAt?: number;
}

export interface ExpenseList {
  listId: string;
  userId: string;
  expenseListId: string;
  payerId: string;
  listDate: number;
  note?: string;
  isPaid: boolean;
  itemsAmount: number;
  totalPrice: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface Expense {
  expenseId: string;
  listId: string;
  totalAmount: number;
  totalTax: number;
  items: [
    {
      name: string;
      category: string;
      quantity: string;
      price: number;
      tax: number;
      totalDue: number;
      owners: {
        memberId: string;
        amount: number;
      };
    },
  ];
  createdAt?: number;
  updatedAt?: number;
}
