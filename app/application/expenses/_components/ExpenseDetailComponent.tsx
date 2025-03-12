"use client";
/* eslint-disable  @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Expense, ExpenseList, Member } from "@/app/types";

interface ExpenseSheet {
  items: any;
  totals: any;
}

export default function ExpenseDetailComponent({
  expenses,
  members,
  expenseList,
}: {
  expenses: Expense;
  members: Member[];
  expenseList: ExpenseList;
}) {
  const router = useRouter();
  const [expense, setExpense] = useState<Expense>();
  const [expenseSheet, setExpenseSheet] = useState<ExpenseSheet>();

  useEffect(() => {
    setExpense(expenses);

    const taxRate = 0.0275; // 10% tax rate
    const sheet = expenses.items.map((item) => {
      const tax = taxRate * item.price; // Calculate the tax
      const totalDue = item.totalDue + tax; // Use the total due from the item

      // Create a contributions object based on the owners
      const memberContributions = members.reduce(
        (acc, member) => {
          const owner = Array.isArray(item.owners)
            ? item.owners.find((o) => o.memberId === member.memberId)
            : undefined;
          acc[member.memberId] = owner ? owner.amount + tax : 0; // Use the amount contributed by the member
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
        members.forEach((member) => {
          acc[member.memberId] += item[member.memberId];
        });
        acc.totalDue += item.totalDue;
        return acc;
      },
      {
        totalPrice: 0,
        tax: 0,
        ...members.reduce(
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
  }, [expenses, members]);

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
            {formatDate(expenseList.listDate)} - {expenseList.note}
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
                ${expense.totalAmount.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Items
              </div>
              <div className="text-2xl font-bold">{expense.items.length}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Paid By
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>
                    {
                      members.find((m) => m.memberId === expenseList.payerId)
                        ?.memberName[0]
                    }
                  </AvatarFallback>
                </Avatar>
                <span>
                  {
                    members.find((m) => m.memberId === expenseList.payerId)
                      ?.memberName
                  }
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Status
              </div>
              <Badge variant={expenseList.isPaid ? "default" : "secondary"}>
                {expenseList.isPaid ? "Paid" : "Unpaid"}
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
                  {members.map((member) => (
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
                    {members.map((member) => (
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
                  {members.map((member) => (
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
