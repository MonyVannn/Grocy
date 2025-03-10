"use client";
/* eslint-disable  @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
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
import { Grocery, GroceryList, Member } from "@/app/types";

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

const owners = [
  { name: "All", avatar: "/placeholder.svg?height=32&width=32" },
  { name: "Sarah", avatar: "/placeholder.svg?height=32&width=32" },
  { name: "Michael", avatar: "/placeholder.svg?height=32&width=32" },
  { name: "Emma", avatar: "/placeholder.svg?height=32&width=32" },
];

export default function GroceryListDetail({
  list,
  groceries,
  members,
}: {
  list: GroceryList;
  groceries: Grocery[];
  members: Member[];
}) {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const router = useRouter();
  const [groceryList, setGroceryList] = useState<GroceryList>();
  const [groceryItems, setGroceryItems] = useState<Grocery[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Grocery>();
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Dairy",
    quantity: "",
    price: 0,
    owners: [] as string[],
  });

  useEffect(() => {
    setGroceryList(list);
    setGroceryItems(groceries);
  }, [groceries, list]);

  // Filter and sort the grocery items
  const filteredItems = groceryItems.filter((item) => {
    const matchesSearch = item.name
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
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortField === "price") {
      return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
    } else if (sortField === "category") {
      return sortDirection === "asc"
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    }
    return 0;
  });

  // Handle adding a new item
  const handleAddItem = async () => {
    if (!newItem.owners.length) {
      return; // prevent adding an item with no owners
    }

    const groceryId =
      Date.now().toString(36) + Math.random().toString(36).substr(2);
    const itemToAdd = {
      groceryId: groceryId,
      listId: list.listId,
      name: newItem.name,
      category: newItem.category,
      quantity: newItem.quantity,
      price: newItem.price,
      owners: newItem.owners,
    };

    // call the addGrocery mutation
    try {
      await convex.mutation(api.groceries.addGrocery, {
        groceryId: groceryId,
        listId: list.listId,
        name: newItem.name,
        category: newItem.category,
        quantity: newItem.quantity,
        price: newItem.price,
        owners: newItem.owners,
      });

      await convex.mutation(api.groceryLists.updateList, {
        listId: list.listId,
        itemAmount: groceryItems.length + 1,
        totalPrice:
          groceryItems.reduce((sum, item) => sum + item.price, 0) +
          newItem.price,
      });

      const updatedItems = [...groceryItems, itemToAdd];
      setGroceryItems(updatedItems);

      // Update the grocery list with new totals
      const updatedList: GroceryList = {
        ...groceryList!,
        itemsAmount: updatedItems.length,
        totalPrice: updatedItems.reduce((sum, item) => sum + item.price, 0),
      };
      setGroceryList(updatedList);

      setNewItem({
        name: "",
        category: "Dairy",
        quantity: "",
        price: 0,
        owners: [],
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding grocery item", error);
      return;
    }
  };

  // Handle editing an item
  const handleEditItem = async () => {
    if (!currentItem?.owners.length) {
      return; // prevent saving an item with no owners
    }

    const updatedItems: Grocery[] = groceryItems.map((item) =>
      item.groceryId === currentItem.groceryId
        ? {
            ...item,
            name: currentItem.name,
            category: currentItem.category,
            quantity: currentItem.quantity,
            price: Number.parseFloat(currentItem.price.toString()),
            owners: currentItem.owners,
          }
        : item
    );

    try {
      // call the updateGrocery mutation
      await convex.mutation(api.groceries.updateGrocery, {
        groceryId: currentItem.groceryId,
        name: currentItem.name,
        category: currentItem.category,
        quantity: currentItem.quantity,
        price: currentItem.price,
        owners: currentItem.owners,
      });

      await convex.mutation(api.groceryLists.updateList, {
        listId: list.listId,
        itemAmount: updatedItems.length,
        totalPrice: updatedItems.reduce((sum, item) => sum + item.price, 0),
      });

      setGroceryItems(updatedItems);

      // Update the grocery list with new totals
      const updatedList: GroceryList = {
        ...groceryList!,
        totalPrice: updatedItems.reduce((sum, item) => sum + item.price, 0),
      };

      setGroceryList(updatedList);

      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating grocery item", error);
      return;
    }
  };

  // Handle deleting an item
  const handleDeleteItem = async () => {
    const updatedItems: Grocery[] = groceryItems.filter(
      (item) => item.groceryId !== currentItem?.groceryId
    );
    setGroceryItems(updatedItems);

    // Update the grocery list with new totals
    const updatedList: GroceryList = {
      ...groceryList!,
      itemsAmount: updatedItems.length,
      totalPrice: updatedItems.reduce((sum, item) => sum + item.price, 0),
    };

    try {
      // call the deleteGrocery mutation
      await convex.mutation(api.groceries.deleteGrocery, {
        groceryId: currentItem!.groceryId,
      });

      await convex.mutation(api.groceryLists.updateList, {
        listId: list.listId,
        itemAmount: updatedItems.length,
        totalPrice: updatedItems.reduce((sum, item) => sum + item.price, 0),
      });

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
      (item) => !selectedItems.includes(item.groceryId)
    );
    setGroceryItems(updatedItems);

    // Update the grocery list with new totals
    const updatedList: GroceryList = {
      ...groceryList!,
      itemsAmount: updatedItems.length,
      totalPrice: updatedItems.reduce((sum, item) => sum + item.price, 0),
    };

    try {
      // call the bulkDeleteGroceries mutation
      await convex.mutation(api.groceries.bulkDeleteGroceries, {
        groceryIds: selectedItems,
      });

      await convex.mutation(api.groceryLists.updateList, {
        listId: list.listId,
        itemAmount: updatedItems.length,
        totalPrice: updatedItems.reduce((sum, item) => sum + item.price, 0),
      });

      setGroceryList(updatedList);

      setSelectedItems([]);
    } catch (error) {
      console.error("Error deleting grocery items", error);
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
      setSelectedItems(filteredItems.map((item) => item.groceryId));
    }
  };

  // Handle toggle owner selection for new or edited item
  const handleToggleOwner = (ownerName: string, isNewItem = true) => {
    if (isNewItem) {
      setNewItem({
        ...newItem,
        owners: newItem.owners.includes(ownerName)
          ? newItem.owners.filter((name) => name !== ownerName)
          : [...newItem.owners, ownerName],
      });
    } else {
      setCurrentItem({
        ...currentItem!,
        owners: currentItem?.owners.includes(ownerName)
          ? currentItem.owners.filter((name: any) => name !== ownerName)
          : [...currentItem!.owners, ownerName],
      });
    }
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
            {formatDate(new Date(groceryList.date).toISOString())} -{" "}
            {groceryList.note}
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groceryItems.length}</div>
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
              ${groceryList.totalPrice.toFixed(2)}
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
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
              <span className="">
                {
                  members.filter((m) => m.memberId === groceryList.shopperId)[0]
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
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
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
                  <select
                    id="category"
                    className="col-span-3 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({ ...newItem, category: e.target.value })
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
                    value={newItem.price}
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
                  <div className="col-span-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="owner-all"
                        checked={newItem.owners.length === members.length}
                        onCheckedChange={() => {
                          if (newItem.owners.length === members.length) {
                            setNewItem({ ...newItem, owners: [] });
                          } else {
                            setNewItem({
                              ...newItem,
                              owners: members.map(
                                (member) => member.memberName
                              ),
                            });
                          }
                        }}
                      />
                      <Label
                        htmlFor="owner-all"
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src="/placeholder.svg?height=32&width=32"
                            alt="All"
                          />
                          <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <span>All</span>
                      </Label>
                    </div>
                    {members.map((owner) => (
                      <div
                        key={owner.memberName}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`owner-${owner.memberName}`}
                          checked={newItem.owners.includes(owner.memberName)}
                          onCheckedChange={() =>
                            handleToggleOwner(owner.memberName)
                          }
                        />
                        <Label
                          htmlFor={`owner-${owner.memberName}`}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
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
                        </Label>
                      </div>
                    ))}
                    {newItem.owners.length === 0 && (
                      <p className="text-sm text-destructive">
                        Please select at least one owner
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
                  onClick={handleAddItem}
                  disabled={
                    !newItem.name ||
                    !newItem.quantity ||
                    !newItem.price ||
                    newItem.owners.length === 0
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
                    <TableRow key={item.groceryId}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(item.groceryId)}
                          onCheckedChange={() =>
                            handleSelectItem(item.groceryId)
                          }
                          aria-label={`Select ${item.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <AvatarGroup className="justify-start" limit={3}>
                          {item.owners.map((owner: string) => {
                            const ownerData =
                              owners.find((o) => o.name === owner) || owners[0];
                            return (
                              <Avatar
                                key={owner}
                                className="h-6 w-6 border-2 border-background"
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

      {/* Edit Dialog */}
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
                  value={currentItem.name}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, name: e.target.value })
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
                    setCurrentItem({ ...currentItem, quantity: e.target.value })
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
                  value={currentItem.price}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      price: Number.parseFloat(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Owners</Label>
                <div className="col-span-3 space-y-2">
                  {members.map((owner) => (
                    <div
                      key={owner.memberName}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`edit-owner-${owner.memberName}`}
                        checked={currentItem.owners.includes(owner.memberName)}
                        onCheckedChange={() =>
                          handleToggleOwner(owner.memberName, false)
                        }
                      />
                      <Label
                        htmlFor={`edit-owner-${owner.memberName}`}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={owner.memberName}
                            alt={owner.memberName}
                          />
                          <AvatarFallback>{owner.memberName[0]}</AvatarFallback>
                        </Avatar>
                        <span>{owner.memberName}</span>
                      </Label>
                    </div>
                  ))}
                  {currentItem.owners.length === 0 && (
                    <p className="text-sm text-destructive">
                      Please select at least one owner
                    </p>
                  )}
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
                (!currentItem.name ||
                  !currentItem.quantity ||
                  !currentItem.price ||
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
                You are about to delete: <strong>{currentItem.name}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Category: {currentItem.category} | Price: $
                {currentItem.price.toFixed(2)}
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
