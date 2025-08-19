"use client";
/* eslint-disable  @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpDown,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Grocery, GroceryList, listMember, Member, Splits } from "@/app/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultipleSelector, { Option } from "@/components/ui/multi-select";
import { Id } from "@/convex/_generated/dataModel";

const categories = [
  "All Categories",
  "Dairy",
  "Bakery",
  "Fruits & Vegetables",
  "Meat & Fish",
  "Pantry",
  "Breakfast",
  "Beverages",
  "Snacks",
  "Other",
];

export default function GroceryListDetail({
  list,
  groceries,
  members,
  splits,
}: {
  list: GroceryList;
  groceries: Grocery[];
  members: Member[];
  splits: Splits[];
}) {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const router = useRouter();
  const [groceryList, setGroceryList] = useState<GroceryList>();
  const [groceryItems, setGroceryItems] = useState<Grocery[]>([]);
  const [expenses, setExpenses] = useState<Splits[]>([]);
  const [listMembers, setListMembers] = useState<listMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPaidDialogOpen, setIsPaidDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Grocery>();
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Dairy",
    quantity: "",
    price: 0,
    owners: [] as Option[],
  });
  const [owners, setOwners] = useState<Option[]>([]);
  const [payment, setPayment] = useState({
    memberId: "",
    isPaid: "",
    note: "",
  });

  useEffect(() => {
    setGroceryList(list);
    setGroceryItems(
      groceries.map((item) => {
        return {
          _id: item._id,
          userId: item.userId,
          listId: item.listId,
          itemName: item.itemName,
          category: item.category,
          quantity: item.quantity,
          totalItemPrice: item.totalItemPrice,
          owners: item.owners,
        };
      })
    );
    setExpenses(splits);

    const memberMap = new Map();

    splits.forEach((item) => {
      item.splits.forEach((split) => {
        if (!memberMap.has(split.memberId)) {
          memberMap.set(split.memberId, {
            memberId: split.memberId,
            memberName: split.memberName,
          });
        }
      });
    });

    const uniqueMembers = Array.from(memberMap.values());

    setListMembers(uniqueMembers);
  }, [groceries, list, splits]);

  // Filter and sort the grocery items
  const filteredItems = groceryItems.filter((item) => {
    const matchesSearch = item.itemName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc"
        ? a.itemName.localeCompare(b.itemName)
        : b.itemName.localeCompare(a.itemName);
    } else if (sortField === "price") {
      return sortDirection === "asc"
        ? a.totalItemPrice - b.totalItemPrice
        : b.totalItemPrice - a.totalItemPrice;
    } else if (sortField === "category") {
      return sortDirection === "asc"
        ? (a.category ?? "").localeCompare(b.category ?? "")
        : (b.category ?? "").localeCompare(a.category ?? "");
    }
    return 0;
  });

  // Handle adding a new item
  const handleAddItem = async () => {
    if (!owners.length) {
      return; // prevent adding an item with no owners
    }

    const itemToAdd = {
      _id: new Date().getTime().toString() as Id<"items">,
      userId: list.userId,
      listId: list.listId,
      itemName: newItem.name,
      category: newItem.category,
      quantity: Number(newItem.quantity),
      totalItemPrice: newItem.price,
      owners: owners.map((owner) => owner.value),
    };

    const expenseToAdd = {
      _id: new Date().getTime().toString() as Id<"itemSplits">,
      itemName: newItem.name,
      splits: owners.map((owner) => ({
        memberName: owner.label,
        shareAmount: newItem.price / owners.length,
        isPaid: false,
        note: "",
      })),
    };

    // call the addGrocery mutation
    try {
      const item = await convex.mutation(api.groceries.addGrocery, {
        listId: list._id as Id<"lists">,
        userId: list.userId as Id<"users">,
        name: newItem.name,
        category: newItem.category,
        quantity: newItem.quantity,
        price: newItem.price,
        owners: owners.map((owner) => owner.value),
      });

      const updatedItems = [...groceryItems, itemToAdd];
      setGroceryItems(updatedItems);

      await convex.mutation(api.groceryLists.updateListAmount, {
        listId: list._id as Id<"lists">,
        totalPrice: updatedItems.reduce(
          (sum, item) => sum + item.totalItemPrice,
          0
        ),
        itemAmount: updatedItems.length,
      });

      await Promise.all(
        owners.map(async (owner) => {
          await convex.mutation(api.expenses.addExpense, {
            listId: list._id as Id<"lists">,
            userId: list.userId as Id<"users">,
            memberId: owner.value as Id<"members">,
            itemId: item as Id<"items">,
            shareAmount: newItem.price / owners.length,
          });
        })
      );

      // Update the grocery list with new totals
      const updatedList: GroceryList = {
        ...groceryList!,
        totalItems: updatedItems.length,
        totalAmount: updatedItems.reduce(
          (sum, item) => sum + item.totalItemPrice,
          0
        ),
      };

      // Update the expense list
      const updatedExpense = [...expenses, expenseToAdd];

      setGroceryList(updatedList);
      setExpenses(updatedExpense);
      setNewItem({
        name: "",
        category: "Dairy",
        quantity: "",
        price: 0,
        owners: [],
      });
      setOwners([]);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding grocery item", error);
      return;
    }
  };

  // Handle editing an item
  const handleEditItem = async () => {
    if (!currentItem?.owners.length || !currentItem.itemName) {
      return; // prevent saving an item with no owners
    }

    const updatedItems: Grocery[] = groceryItems.map((item) =>
      item._id === currentItem._id
        ? {
            ...item,
            name: currentItem.itemName,
            category: currentItem.category,
            quantity: currentItem.quantity,
            price: Number.parseFloat(currentItem.totalItemPrice.toString()),
            owners: currentItem.owners,
          }
        : item
    );

    const updatedExpense = expenses.map((expense) =>
      expense._id === currentItem._id
        ? {
            ...expense,
            itemName: currentItem.itemName,
            splits: currentItem.owners.map((owner) => {
              const member = members.find((m) => m._id === owner);
              return {
                memberName: member?.memberName || "",
                shareAmount:
                  currentItem.totalItemPrice / currentItem.owners.length,
                isPaid: false,
                note: "",
              };
            }),
          }
        : expense
    );

    try {
      // call the updateGrocery mutation
      await convex.mutation(api.groceries.updateGrocery, {
        groceryId: currentItem._id as Id<"items">,
        name: currentItem.itemName,
        category: currentItem.category || "",
        quantity: String(currentItem.quantity || 0),
        price: currentItem.totalItemPrice,
        owners: currentItem.owners,
      });

      await convex.mutation(api.groceryLists.updateListAmount, {
        listId: list._id as Id<"lists">,
        itemAmount: updatedItems.length,
        totalPrice: updatedItems.reduce(
          (sum, item) => sum + item.totalItemPrice,
          0
        ),
      });

      await convex.mutation(api.expenses.deleteExpensesByItemId, {
        itemId: currentItem._id as Id<"items">,
      });

      await Promise.all(
        currentItem.owners.map(async (owner) => {
          await convex.mutation(api.expenses.addExpense, {
            listId: list._id as Id<"lists">,
            userId: list.userId as Id<"users">,
            memberId: owner as Id<"members">,
            itemId: currentItem._id as Id<"items">,
            shareAmount: currentItem.totalItemPrice / currentItem.owners.length,
          });
        })
      );

      // Update the grocery list with new totals
      const updatedList: GroceryList = {
        ...groceryList!,
        totalAmount: updatedItems.reduce(
          (sum, item) => sum + item.totalItemPrice,
          0
        ),
      };

      setGroceryList(updatedList);
      setGroceryItems(updatedItems);
      setExpenses(updatedExpense);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating grocery item", error);
      return;
    }
  };

  // Handle deleting an item
  const handleDeleteItem = async () => {
    const updatedItems: Grocery[] = groceryItems.filter(
      (item) => item._id !== currentItem?._id
    );
    setGroceryItems(updatedItems);

    // Update the grocery list with new totals
    const updatedList: GroceryList = {
      ...groceryList!,
      totalItems: updatedItems.length,
      totalAmount: updatedItems.reduce(
        (sum, item) => sum + item.totalItemPrice,
        0
      ),
    };

    try {
      // call the deleteGrocery mutation
      await convex.mutation(api.groceries.deleteGrocery, {
        groceryId: currentItem!._id || "",
      });

      await convex.mutation(api.groceryLists.updateListAmount, {
        listId: list._id as Id<"lists">,
        itemAmount: updatedItems.length,
        totalPrice: updatedItems.reduce(
          (sum, item) => sum + item.totalItemPrice,
          0
        ),
      });

      await convex.mutation(api.expenses.deleteExpensesByItemId, {
        itemId: currentItem!._id as Id<"items">,
      });

      const updatedExpenses = expenses.filter(
        (expense) => expense._id !== currentItem?._id
      );

      setExpenses(updatedExpenses);
      setGroceryList(updatedList);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting grocery item", error);
      return;
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    const updatedItems: Grocery[] = groceryItems.filter(
      (item) => !selectedItems.includes(item._id!)
    );
    setGroceryItems(updatedItems);

    // Update the grocery list with new totals
    const updatedList: GroceryList = {
      ...groceryList!,
      totalItems: updatedItems.length,
      totalAmount: updatedItems.reduce(
        (sum, item) => sum + item.totalItemPrice,
        0
      ),
    };

    try {
      // call the bulkDeleteGroceries mutation
      await convex.mutation(api.groceries.bulkDeleteGroceries, {
        groceryIds: selectedItems,
      });

      await convex.mutation(api.groceryLists.updateListAmount, {
        listId: list._id as Id<"lists">,
        itemAmount: updatedItems.length,
        totalPrice: updatedItems.reduce(
          (sum, item) => sum + item.totalItemPrice,
          0
        ),
      });

      selectedItems.map(async (itemId) => {
        await convex.mutation(api.expenses.deleteExpensesByItemId, {
          itemId: itemId as Id<"items">,
        });
      });

      const updatedExpenses = expenses.filter(
        (expense) => !selectedItems.includes(expense._id!)
      );

      setExpenses(updatedExpenses);
      setGroceryList(updatedList);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error deleting grocery items", error);
      return;
    }
  };

  // Handle payment
  const handlePayment = async () => {
    if (payment.memberId === "" || payment.isPaid === "") return;

    try {
      const updatedIsPaid = payment.isPaid === "true";

      await convex.mutation(api.expenses.markPaid, {
        listId: list._id as Id<"lists">,
        memberId: payment.memberId,
        isPaid: updatedIsPaid,
        note: payment.note,
      });

      // Update frontend state by mapping each expense and its internal splits
      const updatedExpenses = expenses.map((expense) => {
        const updatedSplits = expense.splits.map((split) => {
          if (
            members.find((m) => m._id === payment.memberId)?.memberName ===
            split.memberName
          ) {
            return {
              ...split,
              isPaid: updatedIsPaid,
              note: payment.note,
            };
          }
          return split;
        });

        return {
          ...expense,
          splits: updatedSplits,
        };
      });

      setExpenses(updatedExpenses);
      setIsPaidDialogOpen(false);
      setPayment({
        memberId: "",
        isPaid: "",
        note: "",
      });
    } catch (error) {
      console.error("Error updating payment", error);
      return;
    }
  };

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle checkbox selection
  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((item) => item._id || ""));
    }
  };

  const memberTotals: Record<string, number> = {};

  expenses.forEach(({ splits }) => {
    splits.forEach(({ memberName, shareAmount }) => {
      if (!memberTotals[memberName]) {
        memberTotals[memberName] = 0;
      }
      memberTotals[memberName] += shareAmount;
    });
  });

  const memberNames = Object.keys(memberTotals);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (!groceryList) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">
            Please wait while we fetch your grocery list
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/application/shopping-lists")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Groceries</h1>
          <p className="text-muted-foreground">
            {formatDate(new Date(groceryList.listDate).toISOString())} -{" "}
            {groceryList.notes}
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {groceryItems.reduce(
                (sum, item) => sum + (item.quantity ?? 0),
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              items in this grocery list
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${groceryList.totalAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              estimated cost for this list
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shopper</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="Shopper"
                />
                <AvatarFallback>
                  {members
                    .filter((m) => m._id === groceryList.payerMemberId)[0]
                    .memberName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>
                {
                  members.filter((m) => m._id === groceryList.payerMemberId)[0]
                    .memberName
                }
              </span>
            </div>
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
              placeholder="Search items..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Diary" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          {selectedItems.length > 1 && (
            <Button variant="outline" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected ({selectedItems.length})
            </Button>
          )}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Grocery Item</DialogTitle>
                <DialogDescription>
                  Add a new item to your grocery list. Fill in all the details
                  below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Item name"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select
                    value={newItem.category}
                    onValueChange={(e) =>
                      setNewItem({ ...newItem, category: e })
                    }
                  >
                    <SelectTrigger className="w-full col-span-3">
                      <SelectValue placeholder="Diary" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem({ ...newItem, quantity: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="e.g., 2 liters, 500g"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price ($)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        price: Number.parseFloat(e.target.value),
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Owners</Label>
                  <div className="col-span-3">
                    <MultipleSelector
                      defaultOptions={members.map((member) => ({
                        label: member.memberName,
                        value: member._id,
                      }))}
                      value={owners}
                      onChange={setOwners}
                      placeholder="Select owner(s)"
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          no results found.
                        </p>
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddItem}
                  disabled={
                    !newItem.name || !newItem.quantity || !newItem.price
                  }
                >
                  Add Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grocery Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Grocery Items</CardTitle>
          <CardDescription>
            Manage your grocery items. Click on column headers to sort.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        filteredItems.length > 0 &&
                        selectedItems.length === filteredItems.length
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSortChange("name")}
                  >
                    <div className="flex items-center">
                      Item Name
                      <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSortChange("category")}
                  >
                    <div className="flex items-center">
                      Category
                      <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSortChange("price")}
                  >
                    <div className="flex items-center">
                      Price
                      <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead>Owners</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-muted-foreground">
                          No grocery items found in this list.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsAddDialogOpen(true)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add your first item
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(item._id!)}
                          onCheckedChange={() => handleSelectItem(item._id!)}
                          aria-label={`Select ${item.itemName}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.itemName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.totalItemPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <AvatarGroup className="justify-start" limit={3}>
                          {item.owners.map((owner: string) => {
                            const ownerData = members.filter(
                              (m) => m._id === owner
                            )[0];
                            return (
                              <Avatar
                                key={owner}
                                className="h-6 w-6 border-2 border-background"
                              >
                                <AvatarImage
                                  src={ownerData.memberName}
                                  alt={ownerData.memberName}
                                />
                                <AvatarFallback>
                                  {ownerData.memberName[0]}
                                </AvatarFallback>
                              </Avatar>
                            );
                          })}
                        </AvatarGroup>
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
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentItem(item);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setCurrentItem(item);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {sortedItems.length} of {groceryItems.length} items
          </div>
        </CardFooter>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Expenses</CardTitle>
              <CardDescription>
                View the details for the expenses of the whole trip.
              </CardDescription>
            </div>
            <Button onClick={() => setIsPaidDialogOpen(true)}>Mark Paid</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Member Name</TableHead>
                  <TableHead>Share Amount</TableHead>
                  <TableHead>Is Paid</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length !== 0 ? (
                  expenses.map(({ _id, itemName, splits }) => (
                    <React.Fragment key={_id}>
                      <TableRow
                        className="bg-muted font-semibold"
                        key={`group-${itemName}`}
                      >
                        <TableCell>
                          {itemName} ($
                          {splits.reduce(
                            (sum, split) => sum + split.shareAmount,
                            0
                          )}
                          )
                        </TableCell>
                        <TableCell colSpan={5}></TableCell>
                      </TableRow>
                      {splits.map((split, index) => (
                        <TableRow
                          key={`${itemName}-${split.memberName}-${index}`}
                        >
                          <TableCell></TableCell>
                          <TableCell>{split.memberName}</TableCell>
                          <TableCell>${split.shareAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                split.isPaid
                                  ? "text-green-700 border-green-200 bg-green-50"
                                  : "text-red-700 border-red-200 bg-red-50"
                              }
                            >
                              {split.isPaid ? "Yes" : "No"}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize">
                            {split.note || ""}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow className="text-center">
                    <TableCell colSpan={5} className="text-muted-foreground">
                      No Items yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {expenses.length !== 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-10">
              {memberNames.map((name) => {
                const subtotal = memberTotals[name] || 0;
                const tax = subtotal * 0.1;
                const total = subtotal + tax;
                const isPaid = expenses.some((expense) =>
                  expense.splits.some(
                    (split) => split.memberName === name && split.isPaid
                  )
                );

                return (
                  <Card key={name}>
                    <CardHeader className="flex justify-between items-center">
                      <CardTitle className="flex items-center justify-between w-full font-medium">
                        {name}
                        <Badge
                          className={
                            isPaid
                              ? "text-green-700 border-green-200 bg-green-50"
                              : "text-red-700 border-red-200 bg-red-50"
                          }
                        >
                          {isPaid ? "Paid" : "Unpaid"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="text-2xl font-bold">
                        <span>${total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Tax (10%)</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit item dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Grocery Item</DialogTitle>
            <DialogDescription>
              Make changes to the grocery item. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          {currentItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={currentItem.itemName}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, itemName: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Category
                </Label>
                <select
                  id="edit-category"
                  className="col-span-3 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={currentItem.category}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, category: e.target.value })
                  }
                >
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="edit-quantity"
                  value={currentItem.quantity}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      quantity: Number(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">
                  Price ($)
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={currentItem.totalItemPrice}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      totalItemPrice: Number.parseFloat(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Owners</Label>
                <div className="col-span-3">
                  <MultipleSelector
                    defaultOptions={members.map((member) => ({
                      label: member.memberName,
                      value: member._id,
                    }))}
                    value={currentItem.owners.map((owner) => ({
                      label:
                        members.find((member) => member._id === owner)
                          ?.memberName || owner,
                      value: owner,
                    }))}
                    onChange={(options) =>
                      setCurrentItem({
                        ...currentItem!,
                        owners: options.map((option) => option.value),
                      })
                    }
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        no results found.
                      </p>
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditItem}
              disabled={
                currentItem &&
                (!currentItem.itemName ||
                  !currentItem.quantity ||
                  !currentItem.totalItemPrice ||
                  currentItem.owners.length === 0)
              }
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit expense dialog */}
      <Dialog open={isPaidDialogOpen} onOpenChange={setIsPaidDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit member details</DialogTitle>
            <DialogDescription>
              Make changes to the member regarding their payments
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-4 gap-2">
              <Label className="pt-2">Owners</Label>
              <Select
                value={payment.memberId}
                onValueChange={(value) =>
                  setPayment({ ...payment, memberId: value })
                }
              >
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue placeholder="Member" />
                </SelectTrigger>
                <SelectContent>
                  {listMembers.map((member) => (
                    <SelectItem value={member.memberId} key={member.memberId}>
                      {member.memberName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Label>Is Paid</Label>
              <Select
                value={payment.isPaid}
                onValueChange={(value) =>
                  setPayment({ ...payment, isPaid: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Yes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Label>Note</Label>
              <Input
                value={payment.note}
                onChange={(e) =>
                  setPayment({ ...payment, note: e.target.value })
                }
                type="text"
                placeholder="Note..."
                className="col-span-3"
              ></Input>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaidDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={
                currentItem &&
                (!currentItem.itemName ||
                  !currentItem.quantity ||
                  !currentItem.totalItemPrice ||
                  currentItem.owners.length === 0)
              }
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {currentItem && (
            <div className="py-4">
              <p className="mb-2">
                <strong>{currentItem.itemName}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Category: {currentItem.category} | Price: $
                {currentItem.totalItemPrice.toFixed(2)}
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
            <Button variant="destructive" onClick={handleDeleteItem}>
              Delete Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
