"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Clock, Filter, Package } from "lucide-react";

import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

// Sample data for the dashboard
const weeklyExpenses = 187.45;
const lastWeekExpenses = 165.2;
const percentChange =
  ((weeklyExpenses - lastWeekExpenses) / lastWeekExpenses) * 100;

const categoryData = [
  { name: "Fruits & Vegetables", value: 52.3, color: "#10b981" },
  { name: "Dairy", value: 38.75, color: "#3b82f6" },
  { name: "Meat & Fish", value: 45.2, color: "#ef4444" },
  { name: "Bakery", value: 22.1, color: "#f59e0b" },
  { name: "Snacks", value: 18.9, color: "#8b5cf6" },
  { name: "Other", value: 10.2, color: "#6b7280" },
];

const familyMembers = [
  {
    id: 1,
    name: "Sarah",
    avatar: "/placeholder.svg?height=40&width=40",
    contributed: 82.5,
    owed: -15.2,
    color: "#3b82f6",
  },
  {
    id: 2,
    name: "Michael",
    avatar: "/placeholder.svg?height=40&width=40",
    contributed: 45.75,
    owed: 21.4,
    color: "#10b981",
  },
  {
    id: 3,
    name: "Emma",
    avatar: "/placeholder.svg?height=40&width=40",
    contributed: 59.2,
    owed: -6.2,
    color: "#f59e0b",
  },
];

const spendingTrendsData = [
  { date: "Week 1", total: 165.2, Sarah: 75.3, Michael: 40.5, Emma: 49.4 },
  { date: "Week 2", total: 178.9, Sarah: 68.2, Michael: 52.3, Emma: 58.4 },
  { date: "Week 3", total: 152.4, Sarah: 62.1, Michael: 38.9, Emma: 51.4 },
  { date: "Week 4", total: 187.45, Sarah: 82.5, Michael: 45.75, Emma: 59.2 },
];

const recentTransactions = [
  {
    id: 1,
    date: "2023-06-01",
    items: "Milk, Eggs, Bread",
    amount: 15.75,
    member: "Sarah",
    memberAvatar: "/placeholder.svg?height=32&width=32",
    category: "Dairy",
  },
  {
    id: 2,
    date: "2023-06-02",
    items: "Chicken, Beef, Fish",
    amount: 32.5,
    member: "Michael",
    memberAvatar: "/placeholder.svg?height=32&width=32",
    category: "Meat & Fish",
  },
  {
    id: 3,
    date: "2023-06-03",
    items: "Apples, Bananas, Oranges",
    amount: 12.3,
    member: "Emma",
    memberAvatar: "/placeholder.svg?height=32&width=32",
    category: "Fruits & Vegetables",
  },
  {
    id: 4,
    date: "2023-06-04",
    items: "Pasta, Rice, Cereal",
    amount: 18.9,
    member: "Sarah",
    memberAvatar: "/placeholder.svg?height=32&width=32",
    category: "Other",
  },
  {
    id: 5,
    date: "2023-06-05",
    items: "Cookies, Chips, Soda",
    amount: 14.25,
    member: "Michael",
    memberAvatar: "/placeholder.svg?height=32&width=32",
    category: "Snacks",
  },
];

export function Dashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [selectedMember, setSelectedMember] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Find the member who contributed the most this week
  const topContributor = [...familyMembers].sort(
    (a, b) => b.contributed - a.contributed
  )[0];

  // Calculate average spending per family member
  const averageSpending = weeklyExpenses / familyMembers.length;

  // Calculate previous average spending (from last week)
  const previousAverageSpending = lastWeekExpenses / familyMembers.length;

  // Calculate average spending change percentage
  const averageChangePercent =
    ((averageSpending - previousAverageSpending) / previousAverageSpending) *
    100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Grocery Dashboard</h1>
        <p className="text-muted-foreground">
          Track and manage your family's grocery expenses
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Expenses Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <CardDescription>Current week spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between mb-4">
              <div className="text-2xl font-bold">
                ${weeklyExpenses.toFixed(2)}
              </div>
              <div
                className={`flex items-center text-xs ${
                  percentChange >= 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                {percentChange >= 0 ? (
                  <ArrowUp className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3" />
                )}
                {Math.abs(percentChange).toFixed(1)}% from last week
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `$${Number(value).toFixed(2)}`,
                      "Amount",
                    ]}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Average Spending Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Spending
            </CardTitle>
            <CardDescription>Per family member</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                ${averageSpending.toFixed(2)}
              </div>
              <div
                className={`flex items-center text-xs ${
                  averageChangePercent >= 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                {averageChangePercent >= 0 ? (
                  <ArrowUp className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3" />
                )}
                {Math.abs(averageChangePercent).toFixed(1)}% from last week
              </div>
            </div>
            <div className="mt-4">
              <div className="space-y-2">
                {familyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member.name}</span>
                    </div>
                    <span className="text-sm font-medium">
                      ${member.contributed.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center text-xs text-muted-foreground">
                <p>Based on the last 4 weeks of spending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Individual Contributions Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Individual Contributions
            </CardTitle>
            <CardDescription>Who paid what</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src={topContributor.avatar}
                    alt={topContributor.name}
                  />
                  <AvatarFallback>{topContributor.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">
                    {topContributor.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Top contributor this week
                  </div>
                </div>
                <Badge className="ml-auto">
                  ${topContributor.contributed.toFixed(2)}
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              {familyMembers.map((member) => (
                <div key={member.id} className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member.name}</span>
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        member.owed > 0
                          ? "text-green-500"
                          : member.owed < 0
                            ? "text-red-500"
                            : ""
                      }`}
                    >
                      {member.owed > 0
                        ? `Owed $${Math.abs(member.owed).toFixed(2)}`
                        : member.owed < 0
                          ? `Owes $${Math.abs(member.owed).toFixed(2)}`
                          : "Settled"}
                    </div>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${
                          (member.contributed / weeklyExpenses) * 100
                        }%`,
                        backgroundColor: member.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spending Trends */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Spending Trends</CardTitle>
              <CardDescription>Track your spending over time</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                value={selectedTimeframe}
                onValueChange={setSelectedTimeframe}
              >
                <SelectTrigger className="h-8 w-[110px]">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Weekly</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="year">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger className="h-8 w-[110px]">
                  <SelectValue placeholder="Member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  {familyMembers.map((member) => (
                    <SelectItem
                      key={member.id}
                      value={member.name.toLowerCase()}
                    >
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="h-8 w-[110px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryData.map((category) => (
                    <SelectItem
                      key={category.name}
                      value={category.name.toLowerCase()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={spendingTrendsData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    `$${(value as number).toFixed(2)}`,
                    "Amount",
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#6b7280"
                  activeDot={{ r: 8 }}
                  name="Total"
                />
                <Line
                  type="monotone"
                  dataKey="Sarah"
                  stroke="#3b82f6"
                  name="Sarah"
                />
                <Line
                  type="monotone"
                  dataKey="Michael"
                  stroke="#10b981"
                  name="Michael"
                />
                <Line
                  type="monotone"
                  dataKey="Emma"
                  stroke="#f59e0b"
                  name="Emma"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest grocery purchases</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.date}
                    </TableCell>
                    <TableCell>{transaction.items}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={transaction.memberAvatar}
                            alt={transaction.member}
                          />
                          <AvatarFallback>
                            {transaction.member[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{transaction.member}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      ${transaction.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" size="sm">
              View All Transactions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
