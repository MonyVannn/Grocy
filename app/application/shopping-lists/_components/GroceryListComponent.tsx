"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  Calendar,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GroceryList, Member, User } from "@/app/types";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export default function GroceryLists({
  user,
  members,
  lists,
}: {
  user: User;
  members: Member[];
  lists: GroceryList[];
}) {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const [groceryLists, setGroceryLists] = useState<GroceryList[]>(lists);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<
    "date" | "totalItems" | "totalCost"
  >("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [currentList, setCurrentList] = useState<GroceryList>();
  const [newList, setNewList] = useState({
    date: new Date().toISOString().split("T")[0],
    note: "",
    shopperId: "",
  });

  // Filter and sort the grocery lists
  const filteredLists = groceryLists.filter((list) => {
    // Get the shopper name from members array using the shopperId
    const shopperName =
      members.find((m) => m.memberId === list.shopperId)?.memberName || "";

    const matchesSearch =
      (list.note ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      shopperName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      new Date(list.date).toISOString().includes(searchQuery);

    return matchesSearch;
  });

  const sortedLists = [...filteredLists].sort((a, b) => {
    if (sortColumn === "date") {
      return sortDirection === "asc"
        ? new Date(a.date)
            .toISOString()
            .localeCompare(new Date(b.date).toISOString())
        : new Date(b.date)
            .toISOString()
            .localeCompare(new Date(a.date).toISOString());
    } else if (sortColumn === "totalItems") {
      return sortDirection === "asc"
        ? a.itemsAmount - b.itemsAmount
        : b.itemsAmount - a.itemsAmount;
    } else if (sortColumn === "totalCost") {
      return sortDirection === "asc"
        ? a.totalPrice - b.totalPrice
        : b.totalPrice - a.totalPrice;
    }
    return 0;
  });

  // Calculate summary statistics
  const totalLists = filteredLists.length;
  const totalSpent = filteredLists.reduce(
    (sum, list) => sum + list.totalPrice,
    0
  );

  // Handle sort change
  const handleSortChange = (column: "date" | "totalItems" | "totalCost") => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  // Handle adding a new list
  const handleAddList = async () => {
    if (!newList.shopperId) {
      return; // prevent adding a list with no shopper
    }

    const newListId =
      Date.now().toString(36) + Math.random().toString(36).substr(2);

    const listToAdd: GroceryList = {
      listId: newListId,
      userId: user.userId,
      date: new Date(newList.date).getTime() + 86400000, // Add one day (in milliseconds)
      note: newList.note || "Grocery shopping",
      shopperId: newList.shopperId,
      itemsAmount: 0,
      totalPrice: 0,
      items: [],
    };

    try {
      // Call the Convex API to add the new list
      await convex.mutation(api.groceryLists.addList, {
        listId: newListId,
        userId: user.userId,
        date: new Date(newList.date).getTime() + 86400000, // Add one day (in milliseconds)
        shopperId: newList.shopperId,
        note: newList.note || "Grocery shopping",
      });

      setGroceryLists([listToAdd, ...groceryLists]);
      setNewList({
        date: new Date().toISOString().split("T")[0],
        note: "",
        shopperId: "",
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding grocery list:", error);
      return;
    }
  };

  // Handle deleting a list
  const handleDeleteList = async () => {
    const updatedLists = groceryLists.filter(
      (list) => list.listId !== currentList?.listId
    );

    try {
      // call the Convex API to delete the list
      await convex.mutation(api.groceryLists.deleteList, {
        listId: currentList?.listId ?? "",
      });

      setGroceryLists(updatedLists);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting grocery list:", error);
      return;
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    const updatedLists = groceryLists.filter(
      (list) => !selectedItems.includes(list.listId)
    );

    try {
      // call the Convex API to delete the selected lists
      await convex.mutation(api.groceryLists.bulkDeleteLists, {
        listIds: selectedItems.map((id) => id.toString()),
      });

      setGroceryLists(updatedLists);
      setSelectedItems([]);
      setIsBulkDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting grocery lists:", error);
      return;
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
    if (selectedItems.length === filteredLists.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredLists.map((list) => list.listId));
    }
  };

  // Handle toggle owner selection
  const handleSetPrimaryShopper = (memberId: string) => {
    setNewList({
      ...newList,
      shopperId: memberId,
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Grocery Lists</h1>
        <p className="text-muted-foreground">
          View and manage your grocery shopping history
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Shopping Trips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLists}</div>
            <p className="text-xs text-muted-foreground">
              shopping trips recorded
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              across all shopping trips
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
              placeholder="Search lists..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBulkDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected ({selectedItems.length})
            </Button>
          )}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Grocery List
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Grocery List</DialogTitle>
                <DialogDescription>
                  Start a new grocery shopping list. You can add items to it
                  after creation.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newList.date}
                    onChange={(e) =>
                      setNewList({ ...newList, date: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="note" className="text-right">
                    Note
                  </Label>
                  <Input
                    id="note"
                    value={newList.note}
                    onChange={(e) =>
                      setNewList({ ...newList, note: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="e.g., Weekly shopping, Special occasion, etc."
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="pt-2">Primary Shopper</Label>
                  <div className="col-span-3">
                    <Select
                      value={newList.shopperId}
                      onValueChange={handleSetPrimaryShopper}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a shopper" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((owner) => (
                          <SelectItem
                            key={owner.memberId}
                            value={owner.memberId}
                          >
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={owner.memberName}
                                  alt={owner.memberName}
                                />
                                <AvatarFallback>
                                  {owner.memberName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span>{owner.memberName}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!newList.shopperId && (
                      <p className="text-sm text-destructive mt-2">
                        Please select a shopper
                      </p>
                    )}
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
                <Button onClick={handleAddList} disabled={!newList.shopperId}>
                  Create List
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grocery Lists Table */}
      <Card>
        <CardHeader>
          <CardTitle>Grocery Shopping History</CardTitle>
          <CardDescription>
            Click on a grocery list to view its items
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
                        filteredLists.length > 0 &&
                        selectedItems.length === filteredLists.length
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSortChange("date")}
                  >
                    <div className="flex items-center">
                      Date
                      <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead>Shopper</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSortChange("totalItems")}
                  >
                    <div className="flex items-center">
                      Items
                      <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSortChange("totalCost")}
                  >
                    <div className="flex items-center">
                      Total Cost
                      <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLists.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No grocery lists found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedLists.map((list) => (
                    <TableRow key={list.listId}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(list.listId)}
                          onCheckedChange={() => handleSelectItem(list.listId)}
                          aria-label={`Select list from ${list.date}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/application/shopping-lists/${list.listId}`}
                          className="hover:underline font-medium"
                        >
                          {formatDate(new Date(list.date).toISOString()) ?? "-"}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {
                          members.find((m) => m.memberId === list.shopperId)
                            ?.memberName
                        }
                      </TableCell>
                      <TableCell>{list.itemsAmount}</TableCell>
                      <TableCell>${list.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className="line-clamp-1">{list.note}</span>
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
                                href={`/application/shopping-lists/${list.listId}`}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                View Items
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setCurrentList(list);
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
            Showing {sortedLists.length} of {groceryLists.length} grocery lists
          </div>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
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
                You are about to delete the grocery list from:{" "}
                <strong>
                  {formatDate(new Date(currentList.date).toISOString())}
                </strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Items: {currentList.totalPrice} | Total Cost: $
                {currentList.totalPrice.toFixed(2)}
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
            <Button variant="destructive" onClick={handleDeleteList}>
              Delete List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the selected grocery lists? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-2">
              You are about to delete {selectedItems.length} grocery lists.
            </p>
            <p className="text-sm text-muted-foreground">
              Total cost: $
              {selectedItems
                .map((id) => groceryLists.find((list) => list.listId === id))
                .reduce((sum, list) => sum + list!.totalPrice, 0)
                .toFixed(2)}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedItems([]);
                setIsBulkDeleteDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete Lists
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
