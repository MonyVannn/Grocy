"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample data (as before)
const sampleMembers = [
  {
    memberId: "m1",
    userId: "u1",
    memberName: "Sarah",
    memberEmail: "sarah@example.com",
    role: "admin",
  },
  {
    memberId: "m2",
    userId: "u1",
    memberName: "Michael",
    memberEmail: "michael@example.com",
    role: "member",
  },
  {
    memberId: "m3",
    userId: "u1",
    memberName: "Emma",
    memberEmail: "emma@example.com",
    role: "member",
  },
];

const sampleGroceryLists = [
  {
    listId: "l1",
    userId: "u1",
    date: Date.now(),
    shopperId: "m1",
    isPaid: true,
    note: "Weekly shopping",
    itemsAmount: 5,
    totalPrice: 45.5,
    items: ["g1", "g2", "g3", "g4", "g5"],
  },
  {
    listId: "l2",
    userId: "u1",
    date: Date.now() - 7 * 24 * 60 * 60 * 1000, // 1 week ago
    shopperId: "m2",
    isPaid: true,
    note: "Quick run",
    itemsAmount: 3,
    totalPrice: 15.75,
    items: ["g6", "g7", "g8"],
  },
];

const sampleGroceries = [
  {
    groceryId: "g1",
    listId: "l1",
    name: "Milk",
    category: "Dairy",
    quantity: "1 gallon",
    price: 3.99,
    owners: ["m1", "m2"],
  },
  {
    groceryId: "g2",
    listId: "l1",
    name: "Eggs",
    category: "Dairy",
    quantity: "1 dozen",
    price: 2.99,
    owners: ["m1", "m2", "m3"],
  },
  {
    groceryId: "g3",
    listId: "l1",
    name: "Bread",
    category: "Bakery",
    quantity: "1 loaf",
    price: 2.49,
    owners: ["m1", "m3"],
  },
  {
    groceryId: "g4",
    listId: "l1",
    name: "Apples",
    category: "Fruits",
    quantity: "3 lbs",
    price: 4.99,
    owners: ["m2", "m3"],
  },
  {
    groceryId: "g5",
    listId: "l1",
    name: "Chicken",
    category: "Meat",
    quantity: "2 lbs",
    price: 8.99,
    owners: ["m1", "m2", "m3"],
  },
  {
    groceryId: "g6",
    listId: "l2",
    name: "Yogurt",
    category: "Dairy",
    quantity: "32 oz",
    price: 3.5,
    owners: ["m2", "m3"],
  },
  {
    groceryId: "g7",
    listId: "l2",
    name: "Bananas",
    category: "Fruits",
    quantity: "1 bunch",
    price: 1.99,
    owners: ["m1", "m2", "m3"],
  },
  {
    groceryId: "g8",
    listId: "l2",
    name: "Cereal",
    category: "Breakfast",
    quantity: "1 box",
    price: 3.99,
    owners: ["m2"],
  },
];

export default function ExpenseDetailComponent({
  expenseId,
}: {
  expenseId: string;
}) {
  const router = useRouter();
  const [expense, setExpense] = useState<any>(null);
  const [expenseSheet, setExpenseSheet] = useState<any>(null);

  useEffect(() => {
    const foundExpense = sampleGroceryLists.find(
      (list) => list.listId === expenseId
    );
    if (foundExpense) {
      setExpense(foundExpense);

      const taxRate = 0.1; // 10% tax rate
      const sheet = sampleGroceries
        .filter((item) => item.listId === expenseId)
        .map((item) => {
          const tax = item.price * taxRate;
          const totalDue = item.price + tax;
          const memberContributions = sampleMembers.reduce(
            (acc, member) => {
              acc[member.memberId] = item.owners.includes(member.memberId)
                ? totalDue / item.owners.length
                : 0;
              return acc;
            },
            {} as Record<string, number>
          );

          return {
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            totalPrice: item.price,
            tax: tax,
            ...memberContributions,
            totalDue: totalDue,
          } as Record<string, number> & {
            name: string;
            category: string;
            quantity: string;
            totalPrice: number;
            tax: number;
            totalDue: number;
          };
        });

      const totals = sheet.reduce(
        (acc, item) => {
          acc.totalPrice += item.totalPrice;
          acc.tax += item.tax;
          sampleMembers.forEach((member) => {
            acc[member.memberId] += item[member.memberId];
          });
          acc.totalDue += item.totalDue;
          return acc;
        },
        {
          totalPrice: 0,
          tax: 0,
          ...sampleMembers.reduce(
            (acc, member) => ({ ...acc, [member.memberId]: 0 }),
            {} as Record<string, number>
          ),
          totalDue: 0,
        } as Record<string, number> & {
          totalPrice: number;
          tax: number;
          totalDue: number;
        }
      );

      setExpenseSheet({ items: sheet, totals });
    } else {
      // Expense not found, redirect back to expenses page
      router.push("/application/expenses");
    }
  }, [expenseId, router]);

  if (!expense || !expenseSheet) {
    return <div>Loading...</div>;
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/application/expenses")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expense Details</h1>
          <p className="text-muted-foreground">
            {formatDate(expense.date)} - {expense.note}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Summary</CardTitle>
          <CardDescription>Overview of the expense</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Total Amount
              </div>
              <div className="text-2xl font-bold">
                ${expense.totalPrice.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Items
              </div>
              <div className="text-2xl font-bold">{expense.itemsAmount}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Paid By
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                  <AvatarFallback>
                    {
                      sampleMembers.find(
                        (m) => m.memberId === expense.shopperId
                      )?.memberName[0]
                    }
                  </AvatarFallback>
                </Avatar>
                <span>
                  {
                    sampleMembers.find((m) => m.memberId === expense.shopperId)
                      ?.memberName
                  }
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Status
              </div>
              <Badge variant={expense.isPaid ? "default" : "secondary"}>
                {expense.isPaid ? "Paid" : "Unpaid"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expense Sheet</CardTitle>
          <CardDescription>
            Detailed breakdown of items and individual contributions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Tax (10%)</TableHead>
                  {sampleMembers.map((member) => (
                    <TableHead key={member.memberId}>
                      {member.memberName}
                    </TableHead>
                  ))}
                  <TableHead>Total Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseSheet.items.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>${item.tax.toFixed(2)}</TableCell>
                    {sampleMembers.map((member) => (
                      <TableCell key={member.memberId}>
                        ${item[member.memberId].toFixed(2)}
                      </TableCell>
                    ))}
                    <TableCell>${item.totalDue.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    ${expenseSheet.totals.totalPrice.toFixed(2)}
                  </TableCell>
                  <TableCell>${expenseSheet.totals.tax.toFixed(2)}</TableCell>
                  {sampleMembers.map((member) => (
                    <TableCell key={member.memberId}>
                      ${expenseSheet.totals[member.memberId].toFixed(2)}
                    </TableCell>
                  ))}
                  <TableCell>
                    ${expenseSheet.totals.totalDue.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
