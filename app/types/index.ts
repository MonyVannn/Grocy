export interface User {
  userId: string;
  email: string;
  name: string;
  role: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface Member {
  memberId: string;
  userId: string;
  memberName: string;
  memberEmail: string;
  role: string;
  createdAt?: number;
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
  items: string[];
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
      itemName: string;
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
