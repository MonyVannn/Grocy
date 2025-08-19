"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

export default function CalendarCard() {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const day = i - 6; // Start from previous month
    const isCurrentMonth = day > 0 && day <= 31;
    const isToday = day === 12;
    const hasActivity = [5, 8, 12, 15, 18, 22, 25, 28].includes(day);

    return {
      day: isCurrentMonth ? day : "",
      isCurrentMonth,
      isToday,
      hasActivity: isCurrentMonth && hasActivity,
    };
  });

  return (
    <Card className="bg-white border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Total Expenses
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>March, 2025</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-3xl font-bold">$1,245</div>
          <div className="text-sm text-green-600 flex items-center gap-1">
            <span>+2.6%</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Increased by +$120 compared to last week
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-xs text-gray-500 text-center py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => (
              <div
                key={index}
                className={`
                  aspect-square flex items-center justify-center text-sm rounded-md cursor-pointer
                  ${date.isCurrentMonth ? "text-gray-900" : "text-gray-300"}
                  ${date.isToday ? "bg-blue-600 text-white font-medium" : ""}
                  ${date.hasActivity && !date.isToday ? "bg-blue-100 text-blue-600" : ""}
                  ${!date.hasActivity && !date.isToday && date.isCurrentMonth ? "hover:bg-gray-100" : ""}
                `}
              >
                {date.day}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
