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
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (!user) return;

    const fetchSummary = async () => {
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

      const startOfMonth = new Date(currentYear, month, 1);
      const startOfMonthTimestamp = startOfMonth.getTime();

      const startOfNextMonth = new Date(currentYear, month + 1, 1);
      const endOfMonthTimestamp = startOfNextMonth.getTime(); // Exclusive end

      const summary = await convex.query(
        api.dashboard.getMonthlySpendingSummary,
        {
          userId: user?.id,
          startOfMonthTimestamp,
          endOfMonthTimestamp,
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
          <h2 className="text-xl font-bold">Grocery Expenses</h2>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            vs prev: 1.67% Jun 1 - Aug 31, 2023
            <ChevronDown className="h-4 w-4 ml-1" />
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
              <SelectItem value="0">January, {currentYear}</SelectItem>
              <SelectItem value="1">Febuary, {currentYear}</SelectItem>
              <SelectItem value="2">March, {currentYear}</SelectItem>
              <SelectItem value="3">April, {currentYear}</SelectItem>
              <SelectItem value="4">May, {currentYear}</SelectItem>
              <SelectItem value="5">June, {currentYear}</SelectItem>
              <SelectItem value="6">July, {currentYear}</SelectItem>
              <SelectItem value="7">August, {currentYear}</SelectItem>
              <SelectItem value="8">September, {currentYear}</SelectItem>
              <SelectItem value="9">October, {currentYear}</SelectItem>
              <SelectItem value="10">November, {currentYear}</SelectItem>
              <SelectItem value="11">December, {currentYear}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default MonthSelector;
