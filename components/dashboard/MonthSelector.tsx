"use client";
import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const MonthSelector = ({ passValue }: any) => {
  const { user, isLoaded } = useUser();
  const [month, setMonth] = useState(new Date().getMonth());
  const currentYear = new Date().getFullYear();
  const months = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (!user) return;

    const fetchSummary = async () => {
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

      const startOfMonth = new Date(currentYear, month, 1);
      const startOfMonthTimestamp = startOfMonth.getTime();

      const startOfMonthDate = new Date(startOfMonthTimestamp);
      const previousMonthDate = new Date(
        startOfMonthDate.getFullYear(),
        startOfMonthDate.getMonth() - 1, // Subtract 1 month
        1, // Day is always 1
      );
      const startOfPreviousMonthTimestamp = previousMonthDate.getTime();

      const startOfNextMonth = new Date(currentYear, month + 1, 1);
      const endOfMonthTimestamp = startOfNextMonth.getTime(); // Exclusive end

      const summary = await convex.query(
        api.dashboard.getMonthlySpendingSummary,
        {
          userId: user?.id,
          startOfMonthTimestamp,
          endOfMonthTimestamp,
          startOfPreviousMonthTimestamp,
        },
      );

      passValue(summary);
    };

    fetchSummary();
  }, [user, month]);

  if (!isLoaded) return null;

  const handleMonthChange = (month: string) => {
    setMonth(Number(month));
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mt-4">
        <div>
          <h2 className="text-2xl font-bold">Grocery Expenses</h2>
          <div className="flex items-center text-gray-500 mt-1">
            An overview of your grocery journey.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select onValueChange={handleMonthChange}>
            <SelectTrigger>
              <SelectValue
                placeholder={new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              />
            </SelectTrigger>
            <SelectContent className="h-54">
              {months.map((val, index) => (
                <SelectItem key={index} value={String(index)}>
                  {val}, {currentYear}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default MonthSelector;
