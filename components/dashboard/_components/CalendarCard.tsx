"use client";

import { CalendarSummary } from "@/app/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

export default function CalendarCard({
  CalendarSummary,
}: {
  CalendarSummary: CalendarSummary;
}) {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const day = i - 6; // Start from previous month
    const isCurrentMonth = day > 0 && day <= 31;
    const isToday = day === new Date().getDate();
    const hasActivity = CalendarSummary.tripDay.includes(day);

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
            <span>
              {`${new Date().toLocaleString("default", { month: "long" })}, ${new Date().getFullYear()}`}
            </span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-3xl font-bold">${CalendarSummary.current}</div>
          <div className="text-sm flex items-center gap-1">
            <span
              className={
                CalendarSummary.differences < 0
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {CalendarSummary.percentage.toFixed(2)}%
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {CalendarSummary.differences < 0
              ? "Decrease by -"
              : "Increase by +"}
            ${Math.abs(CalendarSummary.differences)} compared to last month
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
