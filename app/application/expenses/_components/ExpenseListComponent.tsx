"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExpenseList, GroceryList, Member } from "@/app/types";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export default function ExpenseListComponent({
  lists,
  groceryLists,
  members,
}: {
  lists: ExpenseList[];
  groceryLists: GroceryList[];
  members: Member[];
}) {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const [expenses, setExpenses] = useState<ExpenseList[]>(lists);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [memberFilter, setMemberFilter] = useState("all");
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedGroceryList, setSelectedGroceryList] = useState<string | null>(
    null
  );
  const [newExpenseNote, setNewExpenseNote] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentList, setCurrentList] = useState<ExpenseList | null>(null);

  // Calculate total expenses and average spending
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.totalPrice,
    0
  );
  const averageSpending = totalExpenses / expenses.length;

  // Filter expenses based on search query, date filter, and member filter
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.note &&
      expense.note.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate =
      dateFilter === "all" ||
      new Date(expense.createdAt || 0).toISOString().startsWith(dateFilter);
    const matchesMember =
      memberFilter === "all" || expense.payerId === memberFilter;
    return matchesSearch && matchesDate && matchesMember;
  });

  // Handle adding a new expense
  const handleAddExpense = async () => {
    if (!selectedGroceryList) {
      toast.warning("Please select a grocery list to add as an expense.");
      return;
    }

    const selectedList = groceryLists.find(
      (list) => list.listId === selectedGroceryList
    );

    console.log(selectedList);
    if (!selectedList) return;

    const existingExpense = expenses.find(
      (expense) => expense.listId === selectedGroceryList
    );

    if (existingExpense) {
      toast.error("This grocery list has already been added as an expense.");
      return;
    }

    const listToAdd: ExpenseList = {
      listId: selectedGroceryList,
      userId: selectedList.userId,
      payerId: selectedList.shopperId,
      expenseListId: selectedGroceryList,
      listDate: selectedList.date,
      note: newExpenseNote || selectedList.note || "",
      isPaid: false,
      itemsAmount: selectedList.itemsAmount,
      totalPrice: selectedList.totalPrice,
      createdAt: Date.now(),
    };

    try {
      console.log("Adding expense list", selectedList);
      // call the addExpenseList mutation
      await convex.mutation(api.expenseLists.addExpenseList, {
        expenseListId: selectedGroceryList,
        listId: selectedGroceryList,
        userId: selectedList.userId,
        payerId: selectedList.shopperId,
        listDate: selectedList.date,
        note: newExpenseNote || selectedList.note || "",
        itemsAmount: selectedList.itemsAmount,
        totalPrice: selectedList.totalPrice,
      });

      // call the addExpenses mutation
      await convex.mutation(api.expenses.addExpenses, {
        expenseId: selectedGroceryList,
        listId: selectedGroceryList,
        totalAmount: selectedList.totalPrice,
        totalTax: 0,
        items: selectedList.items.map((item) => ({
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          price: item.price,
          tax: 0,
          totalDue: item.price,
          owners: item.owners.map((owner) => ({
            memberId: owner,
            amount: item.price / item.owners.length,
          })),
        })),
      });

      setExpenses([listToAdd, ...expenses]);

      setIsAddExpenseOpen(false);
      setSelectedGroceryList(null);
      setNewExpenseNote("");

      toast.success("Expense added successfully");
    } catch (error) {
      console.error("Failed to add expense", error);
      toast.error("Failed to add expense. Please try again.");
      return;
    }
  };

  // Handling deleting an expense
  const handleDeleteExpense = async (id: string) => {
    const updatedLists = expenses.filter((list) => list.expenseListId !== id);

    try {
      // call the Convex API to delete the list
      await convex.mutation(api.expenseLists.deleteExpenseList, {
        expenseListId: id,
      });

      toast.success("Expense deleted successfully");
      setExpenses(updatedLists);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting grocery list:", error);
      toast.error("Failed to delete expense. Please try again.");
      return;
    }
  };

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
        <p className="text-muted-foreground">
          Track and manage your grocery expenses
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalExpenses.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              total spent on groceries
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Spending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${averageSpending.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              average per grocery trip
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search expenses..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="2023-06">June 2023</SelectItem>
              <SelectItem value="2023-05">May 2023</SelectItem>
              <SelectItem value="2023-04">April 2023</SelectItem>
            </SelectContent>
          </Select>
          <Select value={memberFilter} onValueChange={setMemberFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by member" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              {members.map((member) => (
                <SelectItem key={member.memberId} value={member.memberId}>
                  {member.memberName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Select an unpaid grocery list to add as an expense.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="grocery-list" className="text-right">
                  Grocery List
                </Label>
                <Select
                  value={selectedGroceryList || ""}
                  onValueChange={(value) => setSelectedGroceryList(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select grocery list" />
                  </SelectTrigger>
                  <SelectContent>
                    {groceryLists
                      .filter((list) => !list.isPaid)
                      .map((list) => (
                        <SelectItem key={list.listId} value={list.listId}>
                          {formatDate(list.date)} - $
                          {list.totalPrice.toFixed(2)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="note" className="text-right">
                  Note
                </Label>
                <Input
                  id="note"
                  value={newExpenseNote}
                  onChange={(e) => setNewExpenseNote(e.target.value)}
                  className="col-span-3"
                  placeholder="Optional note for this expense"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddExpenseOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddExpense}>Add Expense</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>
            A list of your recent grocery expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Date</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      No expenses found.
                    </TableCell>
                  </TableRow>
                )}
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.listId}>
                    <TableCell className="font-medium">
                      {formatDate(expense.listDate)}
                    </TableCell>
                    <TableCell>{expense.note}</TableCell>
                    <TableCell>${expense.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            {
                              members.find(
                                (m) => m.memberId === expense.payerId
                              )?.memberName[0]
                            }
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {
                            members.find((m) => m.memberId === expense.payerId)
                              ?.memberName
                          }
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={expense.isPaid ? "default" : "secondary"}>
                        {expense.isPaid ? "Paid" : "Unpaid"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/application/expenses/${expense.listId}`}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setIsDeleteDialogOpen(true);
                              setCurrentList(expense);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this grocery list? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentList && (
            <div className="py-4">
              <p className="mb-2">
                <strong>Grocery Date:</strong>{" "}
                {formatDate(currentList.listDate)}
                <br />
                <strong>Note:</strong> {currentList.note}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteExpense(currentList!.expenseListId)}
            >
              Delete List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
