"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  FiAnchor,
  FiBarChart,
  FiCheck,
  FiChevronDown,
  FiChevronRight,
  FiDollarSign,
  FiEye,
} from "react-icons/fi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";

const randomMembers = [
  {
    memberId: 1,
    memberName: "John Doe",
    memberEmail: "johndoe@example.com",
    role: "admin",
    createdAt: "2024-01-15",
  },
  {
    memberId: 2,
    memberName: "Jane Smith",
    memberEmail: "janesmith@example.com",
    role: "member",
    createdAt: "2024-02-10",
  },
  {
    memberId: 3,
    memberName: "Alice Johnson",
    memberEmail: "alicej@example.com",
    role: "member",
    createdAt: "2024-03-05",
  },
];

const IssuesComponent = () => {
  return (
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
              {randomMembers.map((member) => (
                <TableRow key={member.memberId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src="/avatar-placeholder.png"
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
                        <div className="font-medium">{member.memberName}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{member.memberEmail || "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={member.role === "admin" ? "default" : "outline"}
                    >
                      {member.role === "admin" ? "Admin" : "Member"}
                    </Badge>
                  </TableCell>
                  <TableCell>{member.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
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
  );
};

const KanbanComponent = () => {
  return (
    <div className="relative grid h-full w-full min-w-96 grid-cols-2 gap-2 p-4 pb-0 pr-0">
      <div className="relative z-0 h-full w-full rounded-t-xl bg-zinc-100 p-4">
        <div className="flex items-center justify-between">
          <span className="flex w-fit items-center gap-1 rounded bg-blue-100 px-1.5 py-0.5 text-sm text-blue-900">
            <FiEye />
            <span>Grocery Lists</span>
          </span>
          <FiChevronDown />
        </div>
        <div className="mt-4 space-y-2">
          <BGTask />
          <BGTask />
          <BGTask />
        </div>
      </div>
      <div className="relative z-0 h-full w-full rounded-t-xl bg-zinc-100 p-4">
        <div className="flex items-center justify-between">
          <span className="green-yellow-900 flex w-fit items-center gap-1 rounded bg-green-100 px-1.5 py-0.5 text-sm">
            <FiCheck />
            <span>Completed Tasks</span>
          </span>
          <FiChevronDown />
        </div>
        <div className="mt-4 space-y-2">
          <BGTask />
        </div>
      </div>

      <OverlayTask />
    </div>
  );
};

const BGTask = () => {
  return (
    <div className="w-full rounded-lg bg-white p-4 text-[0.5rem] text-zinc-400 shadow blur-[1px] sm:text-xs">
      Manage your grocery items efficiently with Grocy.
    </div>
  );
};

const OverlayTask = () => {
  return (
    <div className="absolute left-1/2 top-1/2 z-10 w-64 -translate-x-1/2 -translate-y-1/2 rotate-3 rounded-lg border-2 border-indigo-600 bg-white p-4 shadow-xl shadow-indigo-600/20">
      <div className="mb-2 flex items-center gap-1.5 text-xs">
        <span className="text-zinc-600">Grocy Team</span>
        <FiChevronRight />
        <div className="flex items-center gap-1 rounded bg-indigo-100 px-1.5 py-0.5 text-indigo-900">
          <FiAnchor />
          <span>Features</span>
        </div>
      </div>
      <span className="mb-0.5 block text-lg font-medium">
        Simplified Expense Tracking
      </span>
      <span className="block text-sm text-zinc-600">
        Manage shared grocery expenses effortlessly.
      </span>
    </div>
  );
};

const GanttComponent = () => {
  return (
    <div className="relative h-full min-w-96 p-4 pb-0 pt-0">
      <div className="grid h-full grid-cols-5">
        <span className="block h-full w-full pt-4 text-center text-sm">
          Sat
        </span>
        <span className="block h-full w-full bg-zinc-100 pt-4 text-center text-sm">
          Sun
        </span>
        <span className="block h-full w-full pt-4 text-center text-sm">
          Mon
        </span>
        <span className="block h-full w-full bg-zinc-100 pt-4 text-center text-sm">
          Tue
        </span>
        <span className="block h-full w-full pt-4 text-center text-sm">
          Wed
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 top-10 space-y-4 p-4">
        <div className="h-4 w-2/5 rounded-full bg-purple-500" />
        <div className="ml-[20%] h-4 w-3/5 rounded-full bg-blue-500" />
        <div className="flex w-full">
          <div className="h-4 w-3/5 rounded-full bg-green-500" />
          <div className="h-4 w-1/5 rounded-full bg-blue-500" />
        </div>
        <div className="ml-[60%] h-4 w-2/5 rounded-full bg-amber-500" />
        <div className="h-4 w-1/5 rounded-full bg-pink-500" />
        <div className="flex w-full">
          <div className="ml-[60%] h-4 w-1/5 rounded-full bg-purple-500" />
          <div className="h-4 w-1/5 rounded-full bg-pink-500" />
        </div>
        <div className="ml-[60%] h-4 w-2/5 rounded-full bg-green-500" />
        <div className="ml-[20%] h-4 w-3/5 rounded-full bg-amber-500" />
        <div className="flex w-full">
          <div className="h-4 w-2/5 rounded-full bg-red-500" />
          <div className="ml-[20%] h-4 w-1/5 rounded-full bg-red-500" />
        </div>
      </div>

      <div className="absolute bottom-0 left-1/3 top-0 w-0.5 bg-indigo-600">
        <span className="absolute left-0 top-0 -translate-x-1/2 rounded-b bg-indigo-500 px-1.5 pb-0.5 text-xs font-medium text-white">
          Now
        </span>
      </div>
    </div>
  );
};

const trendData = [
  { name: "Week 1", spending: 100 },
  { name: "Week 2", spending: 150 },
  { name: "Week 3", spending: 110 },
  { name: "Week 4", spending: 250 },
  { name: "Week 5", spending: 75 },
];

const AnalyticsComponent = () => {
  return (
    <div className="relative p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {/* Total Expenses Card */}
        <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md">
          <div className="flex items-center">
            <FiDollarSign className="text-3xl text-green-500" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold">Total Expenses</h3>
              <p className="text-sm text-zinc-600">$500.00</p>{" "}
              {/* Replace with dynamic data */}
            </div>
          </div>
        </div>

        {/* Average Spending Card */}
        <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md">
          <div className="flex items-center">
            <FiBarChart className="text-3xl text-blue-500" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold">Average Spending</h3>
              <p className="text-sm text-zinc-600">$125.00</p>{" "}
              {/* Replace with dynamic data */}
            </div>
          </div>
        </div>

        {/* Spending Trends Card with Line Trend Graph */}
        <div className="flex flex-col items-center justify-between rounded-lg bg-white p-4 shadow-md col-span-2">
          <div className="flex items-center">
            <FiBarChart className="text-3xl text-purple-500" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold">Spending Trends</h3>
              <p className="text-sm text-zinc-600">View detailed trends</p>
            </div>
          </div>
          <LineChart width={350} height={200} data={trendData} className="mt-4">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="spending"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export const data = [
  {
    id: 1,
    title: "Members",
    Component: IssuesComponent,
    cardTitle: "Manage Your Team",
    cardSubtitle:
      "Add members to your family group and assign them grocery items to help manage shared expenses.",
  },
  {
    id: 2,
    title: "Grocery Lists",
    Component: KanbanComponent,
    cardTitle: "Organize Your Groceries",
    cardSubtitle:
      "Create and manage grocery lists effortlessly, keeping track of what you need to buy.",
  },
  {
    id: 3,
    title: "Expense Tracking",
    Component: GanttComponent,
    cardTitle: "Track Your Spending",
    cardSubtitle:
      "Easily monitor your grocery expenses and see how much each member contributes.",
  },
  {
    id: 4,
    title: "Analytics Dashboard",
    Component: AnalyticsComponent,
    cardTitle: "Insights at a Glance",
    cardSubtitle:
      "Utilize the analytics dashboard to track spending patterns and manage your grocery budget effectively.",
  },
];
