"use client";
/* eslint-disable  @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Edit, MoreHorizontal, Search, Trash2, UserPlus } from "lucide-react";

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
import { useToast } from "@/components/hooks/use-toast";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Member, User } from "@/app/types";

const roles = [
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
];

export default function MemberComponent({
  user,
  convexMembers,
}: {
  user: User;
  convexMembers: Member[];
}) {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const { toast } = useToast();
  const [members, setMembers] = useState(convexMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<any>(null);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "member",
  });
  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
  });

  // Filter members based on search query and role filter
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.memberEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Calculate summary statistics
  const totalMembers = members.length;
  const adminCount = members.filter((member) => member.role === "admin").length;
  const memberCount = members.filter(
    (member) => member.role === "member",
  ).length;

  // Handle adding a new member
  const handleAddMember = async () => {
    // Validate form
    const errors = {
      name: !newMember.name.trim(),
      email: newMember.email ? !/^\S+@\S+\.\S+$/.test(newMember.email) : false,
    };

    setFormErrors(errors);

    if (errors.name || errors.email) {
      return;
    }

    try {
      // Call the addMember mutation
      const newMemberFromDb = await convex.mutation(api.members.addMember, {
        userId: user._id,
        memberName: newMember.name.trim(),
        memberEmail: newMember.email.trim(),
        role: newMember.role,
      });

      if (!newMemberFromDb) return;

      // Update local state
      setMembers([...members, newMemberFromDb]);
      setNewMember({
        name: "",
        email: "",
        role: "member",
      });
      setIsAddDialogOpen(false);

      toast({
        title: "Member Added",
        description: `${newMemberFromDb.memberName} has been added successfully.`,
      });
    } catch (error) {
      console.error("Error adding member:", error);
      toast({
        title: "Error",
        description: "There was an error adding the member.",
        variant: "destructive",
      });
    }
  };

  // Handle editing a member
  const handleEditMember = async () => {
    // Validate form
    const errors = {
      name: !currentMember.memberName.trim(),
      email: currentMember.memberEmail
        ? !/^\S+@\S+\.\S+$/.test(currentMember.memberEmail)
        : false,
    };

    setFormErrors(errors);

    if (errors.name || errors.email) {
      return;
    }

    const updatedMembers = members.map((member) =>
      member.memberId === currentMember.memberId
        ? {
            ...member,
            memberName: currentMember.memberName.trim(),
            memberEmail: currentMember.memberEmail.trim(),
            role: currentMember.role,
          }
        : member,
    );

    try {
      // Call the editMember mutation
      await convex.mutation(api.members.editMember, {
        memberId: currentMember.memberId,
        memberName: currentMember.memberName.trim(),
        memberEmail: currentMember.memberEmail.trim(),
        role: currentMember.role,
      });

      setMembers(updatedMembers);
      setIsEditDialogOpen(false);

      toast({
        title: "Member Updated",
        description: `${currentMember.memberName} has been updated successfully.`,
      });
    } catch (error) {
      console.error("Error updating member:", error);
      toast({
        title: "Error",
        description: "There was an error updating the member.",
        variant: "destructive",
      });
    }
  };

  // Handle deleting a member
  const handleDeleteMember = async () => {
    const memberName = currentMember.memberName;

    try {
      // Call the deleteMember mutation
      await convex.mutation(api.members.deleteMember, {
        memberId: currentMember.memberId,
      });

      const updatedMembers = members.filter(
        (member) => member.memberId !== currentMember.memberId,
      );
      setMembers(updatedMembers);
      setIsDeleteDialogOpen(false);

      toast({
        title: "Member Removed",
        description: `${memberName} has been removed successfully.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error deleting member:", error);
      toast({
        title: "Error",
        description: "There was an error removing the member.",
        variant: "destructive",
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Family Members</h1>
        <p className="text-muted-foreground">
          Manage your family members and their roles
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              people in your family group
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminCount}</div>
            <p className="text-xs text-muted-foreground">
              members with admin privileges
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Regular Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberCount}</div>
            <p className="text-xs text-muted-foreground">
              members with standard access
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
              placeholder="Search members..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Family Member</DialogTitle>
              <DialogDescription>
                Add a new member to your family group. They will be able to
                access and contribute to your grocery lists.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <div className="col-span-3 space-y-1">
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) =>
                      setNewMember({ ...newMember, name: e.target.value })
                    }
                    className={formErrors.name ? "border-destructive" : ""}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-destructive">Name is required</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <div className="col-span-3 space-y-1">
                  <Input
                    id="email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) =>
                      setNewMember({ ...newMember, email: e.target.value })
                    }
                    className={formErrors.email ? "border-destructive" : ""}
                    placeholder="Optional"
                  />
                  {formErrors.email && (
                    <p className="text-xs text-destructive">
                      Please enter a valid email address
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select
                  value={newMember.role}
                  onValueChange={(value) =>
                    setNewMember({ ...newMember, role: value })
                  }
                >
                  <SelectTrigger id="role" className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setFormErrors({ name: false, email: false });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddMember}>Add Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Family Members</CardTitle>
          <CardDescription>
            Manage your family members and their access roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No members found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={member.memberName}
                              alt={member.memberName}
                            />
                            <AvatarFallback>
                              {member.memberName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {member.memberName}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{member.memberEmail || "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            member.role === "admin" ? "default" : "outline"
                          }
                        >
                          {member.role === "admin" ? "Admin" : "Member"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {member?._createdAt
                          ? formatDate(
                              new Date(member._createdAt).toISOString(),
                            )
                          : formatDate(new Date().toLocaleDateString())}
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
                                setCurrentMember(member);
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
                                setCurrentMember(member);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
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
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>
              Update the details for this family member.
            </DialogDescription>
          </DialogHeader>
          {currentMember && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <div className="col-span-3 space-y-1">
                  <Input
                    id="edit-name"
                    defaultValue={currentMember.memberName}
                    onChange={(e) =>
                      setCurrentMember({
                        ...currentMember,
                        memberName: e.target.value,
                      })
                    }
                    className={formErrors.name ? "border-destructive" : ""}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-destructive">Name is required</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <div className="col-span-3 space-y-1">
                  <Input
                    id="edit-email"
                    type="email"
                    defaultValue={currentMember.memberEmail}
                    onChange={(e) =>
                      setCurrentMember({
                        ...currentMember,
                        memberEmail: e.target.value,
                      })
                    }
                    className={formErrors.email ? "border-destructive" : ""}
                    placeholder="Optional"
                  />
                  {formErrors.email && (
                    <p className="text-xs text-destructive">
                      Please enter a valid email address
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Role
                </Label>
                <Select
                  value={currentMember.role}
                  onValueChange={(value) =>
                    setCurrentMember({ ...currentMember, role: value })
                  }
                >
                  <SelectTrigger id="edit-role" className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setFormErrors({ name: false, email: false });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditMember}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this member? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {currentMember && (
            <div className="py-4">
              <div className="flex items-center gap-3 mb-2">
                <Avatar>
                  <AvatarImage
                    src={currentMember.memberName}
                    alt={currentMember.memberName}
                  />
                  <AvatarFallback>
                    {currentMember.memberName
                      .split(" ")
                      .map((n: any) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{currentMember.memberName}</div>
                  <div className="text-sm text-muted-foreground">
                    {currentMember.memberEmail}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Removing this member will revoke their access to your family
                grocery lists and data.
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
            <Button variant="destructive" onClick={handleDeleteMember}>
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
