"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";

import {
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
} from "recharts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Summary } from "@/types";

// Sample data for the dashboard - using the original data
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

export function Dashboard(data: Summary | undefined) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [selectedMember, setSelectedMember] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const currentYear = new Date().getFullYear();

  // Find the member who contributed the most this week
  const topContributor = [...familyMembers].sort(
    (a, b) => b.contributed - a.contributed,
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
    <div className="min-h-screen">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {/* Main Stats */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1">
            <div className="flex items-baseline">
              <h3 className="text-3xl font-bold">
                ${weeklyExpenses.toFixed(2)}
              </h3>
              <Badge className="ml-2 bg-red-100 text-red-800 rounded-full text-xs">
                {percentChange >= 0 ? (
                  <ArrowUp className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3" />
                )}
                {Math.abs(percentChange).toFixed(1)}%
              </Badge>
              <Badge className="ml-1 bg-red-100 text-red-800 rounded-full text-xs">
                ${Math.abs(weeklyExpenses - lastWeekExpenses).toFixed(2)}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card className="rounded-xl border border-gray-100 shadow-sm">
                <CardContent className="p-4">
                  <div className="text-sm font-medium">Top spender</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xl font-bold">
                      ${topContributor.contributed.toFixed(2)}
                    </div>
                    <Avatar className="h-6 w-6 border border-gray-100">
                      <AvatarImage
                        src={topContributor.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {topContributor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl border border-gray-100 shadow-sm">
                <CardContent className="p-4">
                  <div className="text-sm font-medium">Average Spending</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xl font-bold">
                      ${averageSpending.toFixed(2)}
                    </div>
                    <Badge className="bg-gray-800 text-white rounded-full text-xs">
                      Per Person
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-2">
                <Card className="rounded-xl border border-gray-100 shadow-sm">
                  <CardContent className="p-2 flex flex-col items-center justify-center">
                    <div className="text-xs text-gray-500">Items</div>
                    <div className="text-sm font-medium mt-1">
                      {recentTransactions.length}
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl border border-gray-100 shadow-sm">
                  <CardContent className="p-2 flex flex-col items-center justify-center">
                    <div className="text-xs text-gray-500">Change</div>
                    <div className="text-sm font-medium mt-1 text-pink-500">
                      {Math.abs(percentChange).toFixed(0)}%
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl border border-gray-100 shadow-sm">
                  <CardContent className="p-2 flex flex-col items-center justify-center">
                    <div className="text-xs text-gray-500">Members</div>
                    <div className="text-sm font-medium mt-1">
                      {familyMembers.length}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium mb-4">
                  Category Distribution
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
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #f0f0f0",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {categoryData.map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center gap-2"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-xs">{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-4">
                  Individual Contributions
                </div>
                {familyMembers.map((member) => (
                  <div key={member.id} className="flex flex-col mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-gray-100">
                          <AvatarImage
                            src={member.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{member.name}</span>
                      </div>
                      <div
                        className={`text-sm font-medium ${member.owed > 0
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
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(member.contributed / weeklyExpenses) * 100}%`,
                          backgroundColor: member.color,
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      ${member.contributed.toFixed(2)} (
                      {((member.contributed / weeklyExpenses) * 100).toFixed(0)}
                      %)
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Spending Trends */}
            <Card className="mt-8 rounded-xl border border-gray-100 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="text-sm font-medium">Spending Trends</div>
                  <div className="flex flex-wrap gap-2">
                    <Select
                      variant="outline"
                      size="sm"
                      className="text-xs border border-gray-200"
                    >
                      {selectedTimeframe.charAt(0).toUpperCase() +
                        selectedTimeframe.slice(1)}
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </Select>
                    <Select
                      variant="outline"
                      size="sm"
                      className="text-xs border border-gray-200"
                    >
                      {selectedMember === "all"
                        ? "All Members"
                        : selectedMember}
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </Select>
                    <Select
                      variant="outline"
                      size="sm"
                      className="text-xs border border-gray-200"
                    >
                      {selectedCategory === "all"
                        ? "All Categories"
                        : selectedCategory}
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </Select>
                  </div>
                </div>
                <div className="h-[250px]">
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
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f0f0f0"
                      />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(value) => [
                          `$${(value as number).toFixed(2)}`,
                          "Amount",
                        ]}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #f0f0f0",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
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
          </div>
        </div>
      </div>
    </div>
  );
}
