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
import { AvatarGroup } from "@/components/ui/avatar-group";
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

// Sample data for grocery lists
const initialGroceryLists = [
  {
    id: 1,
    date: "2023-06-15",
    totalItems: 12,
    totalCost: 74.32,
    primaryOwners: ["Sarah", "Michael"],
    note: "Weekly grocery shopping",
  },
  {
    id: 2,
    date: "2023-06-08",
    totalItems: 8,
    totalCost: 45.99,
    primaryOwners: ["Sarah"],
    note: "Quick midweek run",
  },
  {
    id: 3,
    date: "2023-06-01",
    totalItems: 15,
    totalCost: 82.75,
    primaryOwners: ["Michael", "Emma"],
    note: "Monthly stock up",
  },
  {
    id: 4,
    date: "2023-05-25",
    totalItems: 6,
    totalCost: 32.48,
    primaryOwners: ["All"],
    note: "Essential items only",
  },
  {
    id: 5,
    date: "2023-05-18",
    totalItems: 10,
    totalCost: 67.21,
    primaryOwners: ["Emma"],
    note: "Weekend shopping",
  },
];

const owners = [
  { name: "All", avatar: "/placeholder.svg?height=32&width=32" },
  { name: "Sarah", avatar: "/placeholder.svg?height=32&width=32" },
  { name: "Michael", avatar: "/placeholder.svg?height=32&width=32" },
  { name: "Emma", avatar: "/placeholder.svg?height=32&width=32" },
];

export default function GroceryListsPage() {
  const [groceryLists, setGroceryLists] = useState(initialGroceryLists);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortColumn, setSortColumn] = useState<
    "date" | "totalItems" | "totalCost"
  >("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentList, setCurrentList] = useState<any>(null);
  const [newList, setNewList] = useState({
    date: new Date().toISOString().split("T")[0],
    note: "",
    primaryOwners: [] as string[],
  });

  // Filter and sort the grocery lists
  const filteredLists = groceryLists.filter((list) => {
    const matchesSearch =
      list.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.date.includes(searchQuery) ||
      list.primaryOwners.some((owner) =>
        owner.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesSearch;
  });

  const sortedLists = [...filteredLists].sort((a, b) => {
    if (sortColumn === "date") {
      return sortDirection === "asc"
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date);
    } else if (sortColumn === "totalItems") {
      return sortDirection === "asc"
        ? a.totalItems - b.totalItems
        : b.totalItems - a.totalItems;
    } else if (sortColumn === "totalCost") {
      return sortDirection === "asc"
        ? a.totalCost - b.totalCost
        : b.totalCost - a.totalCost;
    }
    return 0;
  });

  // Calculate summary statistics
  const totalLists = filteredLists.length;
  const totalSpent = filteredLists.reduce(
    (sum, list) => sum + list.totalCost,
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
  const handleAddList = () => {
    if (!newList.primaryOwners.length) {
      return; // prevent adding a list with no owners
    }

    const newId = Math.max(...groceryLists.map((list) => list.id)) + 1;
    const listToAdd = {
      id: newId,
      date: newList.date,
      totalItems: 0, // New list starts with 0 items
      totalCost: 0, // New list starts with $0
      primaryOwners: newList.primaryOwners,
      note: newList.note || "Grocery shopping",
    };
    setGroceryLists([listToAdd, ...groceryLists]);
    setNewList({
      date: new Date().toISOString().split("T")[0],
      note: "",
      primaryOwners: [],
    });
    setIsAddDialogOpen(false);
  };

  // Handle deleting a list
  const handleDeleteList = () => {
    const updatedLists = groceryLists.filter(
      (list) => list.id !== currentList.id
    );
    setGroceryLists(updatedLists);
    setIsDeleteDialogOpen(false);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    const updatedLists = groceryLists.filter(
      (list) => !selectedItems.includes(list.id)
    );
    setGroceryLists(updatedLists);
    setSelectedItems([]);
  };

  // Handle checkbox selection
  const handleSelectItem = (id: number) => {
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
      setSelectedItems(filteredLists.map((list) => list.id));
    }
  };

  // Handle toggle owner selection
  const handleToggleOwner = (ownerName: string) => {
    setNewList({
      ...newList,
      primaryOwners: newList.primaryOwners.includes(ownerName)
        ? newList.primaryOwners.filter((name) => name !== ownerName)
        : [...newList.primaryOwners, ownerName],
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
            <Button variant="outline" size="sm" onClick={handleBulkDelete}>
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
                  <Label className="text-right pt-2">Primary Shoppers</Label>
                  <div className="col-span-3 space-y-2">
                    {owners.map((owner) => (
                      <div
                        key={owner.name}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`owner-${owner.name}`}
                          checked={newList.primaryOwners.includes(owner.name)}
                          onCheckedChange={() => handleToggleOwner(owner.name)}
                        />
                        <Label
                          htmlFor={`owner-${owner.name}`}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={owner.avatar} alt={owner.name} />
                            <AvatarFallback>{owner.name[0]}</AvatarFallback>
                          </Avatar>
                          <span>{owner.name}</span>
                        </Label>
                      </div>
                    ))}
                    {newList.primaryOwners.length === 0 && (
                      <p className="text-sm text-destructive">
                        Please select at least one shopper
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
                <Button
                  onClick={handleAddList}
                  disabled={newList.primaryOwners.length === 0}
                >
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
                  <TableHead>Shoppers</TableHead>
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
                    <TableRow key={list.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(list.id)}
                          onCheckedChange={() => handleSelectItem(list.id)}
                          aria-label={`Select list from ${list.date}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/application/shopping-lists/${list.id}`}
                          className="hover:underline font-medium"
                        >
                          {formatDate(list.date)}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <AvatarGroup>
                          {list.primaryOwners.map((owner) => {
                            const ownerData =
                              owners.find((o) => o.name === owner) || owners[0];
                            return (
                              <Avatar
                                key={owner}
                                className="h-8 w-8 border-2 border-background"
                              >
                                <AvatarImage
                                  src={ownerData.avatar}
                                  alt={owner}
                                />
                                <AvatarFallback>{owner[0]}</AvatarFallback>
                              </Avatar>
                            );
                          })}
                        </AvatarGroup>
                      </TableCell>
                      <TableCell>{list.totalItems}</TableCell>
                      <TableCell>${list.totalCost.toFixed(2)}</TableCell>
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
                              <Link href={`/shopping-lists/${list.id}`}>
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
                <strong>{formatDate(currentList.date)}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Items: {currentList.totalItems} | Total Cost: $
                {currentList.totalCost.toFixed(2)}
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
    </div>
  );
}
