"use client";

import { MembersSummary, TripsSummaries } from "@/app/types";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

function MatrixCards({
  convexTripsSummary,
  convexMembersSummary,
}: {
  convexTripsSummary: TripsSummaries;
  convexMembersSummary: MembersSummary;
}) {
  const [tripsSummary, setTripsSummary] =
    useState<TripsSummaries>(convexTripsSummary);
  const [membersSummary, setMembersSummary] =
    useState<MembersSummary>(convexMembersSummary);

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Trips</h3>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>
                {`${new Date().toLocaleString("default", { month: "long" })}, ${new Date().getFullYear()}`}
              </span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {tripsSummary?.currentTrips || 0}
              </span>
              <div className="flex items-center gap-1 text-sm">
                {tripsSummary.differences >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={
                    membersSummary.differences >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {tripsSummary.percentage}%
                </span>
              </div>
            </div>
            {tripsSummary.differences >= 0 ? (
              <p className="text-xs text-gray-500">
                Increased by {tripsSummary.differences} trips compared to last
                month
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                Decreased by {Math.abs(tripsSummary.differences)} trips compared
                to last month
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">
              Unsettled Trips
            </h3>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>
                {`${new Date().toLocaleString("default", { month: "long" })}, ${new Date().getFullYear()}`}
              </span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {tripsSummary?.totalUnsettled || 0}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Among {tripsSummary.totalSettled} settled trips current month
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Members</h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {membersSummary.current}
              </span>
              <div className="flex items-center gap-1 text-sm">
                {membersSummary.differences >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}

                <span
                  className={
                    membersSummary.differences >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {membersSummary.percentage}%
                </span>
              </div>
            </div>
            {membersSummary.differences >= 0 ? (
              <p className="text-xs text-gray-500">
                Increased by {membersSummary.differences} members compared to
                last month
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                Decreased by {Math.abs(membersSummary.differences)} members
                compared to last month
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default MatrixCards;
