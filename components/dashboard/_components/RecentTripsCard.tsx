"use client";

import { Filter, MoreHorizontal, Search, SortAsc } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const lists = [
  {
    id: 1,
    date: "Oct 10, 2024",
    name: "Grocery Shopping",
    amount: "$78.50",
    payer: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    assignedTo: {
      name: "Alice Smith",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AS",
    },
    status: "Active",
    location: "Whole Foods",
  },
  {
    id: 2,
    date: "Oct 10, 2024",
    name: "Dinner Restaurant",
    amount: "$125.75",
    payer: {
      name: "Bob Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "BJ",
    },
    assignedTo: {
      name: "Carol Williams",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "CW",
    },
    status: "Settled",
    location: "Italian Bistro",
  },
  {
    id: 3,
    date: "Oct 10, 2024",
    name: "Movie Night",
    amount: "$42.00",
    payer: {
      name: "Dave Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "DB",
    },
    assignedTo: {
      name: "Eve Davis",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "ED",
    },
    status: "Active",
    location: "AMC Theater",
  },
  {
    id: 4,
    date: "Oct 9, 2024",
    name: "Utility Bills",
    amount: "$135.20",
    payer: {
      name: "Frank Miller",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "FM",
    },
    assignedTo: {
      name: "Grace Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "GW",
    },
    status: "Settled",
    location: "Online Payment",
  },
];

export default function RecentTripsCard() {
  return (
    <Card className="bg-white border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Recent Expense Lists
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-10 w-64 bg-gray-50 border-0"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <SortAsc className="h-4 w-4" />
              Sort By
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100">
              <TableHead className="text-gray-600 font-medium">
                Creation Date
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                List Name
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Amount
              </TableHead>
              <TableHead className="text-gray-600 font-medium">Payer</TableHead>
              <TableHead className="text-gray-600 font-medium">
                Assigned Member
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Status
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Location
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lists.map((list) => (
              <TableRow key={list.id} className="border-gray-100">
                <TableCell className="text-gray-900">{list.date}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={list.payer.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback className="text-xs">
                        {list.payer.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">
                        {list.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Shared expense
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  {list.amount}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={list.payer.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback className="text-xs">
                        {list.payer.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {list.payer.name}
                      </div>
                      <div className="text-xs text-gray-500">Primary payer</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={list.assignedTo.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback className="text-xs">
                        {list.assignedTo.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {list.assignedTo.name}
                      </div>
                      <div className="text-xs text-gray-500">Split member</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`${
                        list.status !== "Active"
                          ? "text-green-700 border-green-200 bg-green-50"
                          : "text-yellow-700 border-yellow-200 bg-yellow-50"
                      }`}
                    >
                      {list.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{list.location}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
