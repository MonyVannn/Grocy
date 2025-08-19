import { MembersSummary, TripsSummary } from "@/app/types";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, TrendingDown, TrendingUp } from "lucide-react";

function MatrixCards({
  convexTripsSummary,
  convexMembersSummary,
}: {
  convexTripsSummary: TripsSummary;
  convexMembersSummary: MembersSummary;
}) {
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
                {convexTripsSummary?.currentTrips || 0}
              </span>
              <div className="flex items-center gap-1 text-sm">
                {convexTripsSummary.differences >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={
                    convexMembersSummary.differences >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {convexTripsSummary.percentage}%
                </span>
              </div>
            </div>
            {convexTripsSummary.differences >= 0 ? (
              <p className="text-xs text-gray-500">
                Increased by {convexTripsSummary.differences} trips compared to
                last month
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                Decreased by {Math.abs(convexTripsSummary.differences)} trips
                compared to last month
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
                {convexTripsSummary?.totalUnsettled || 0}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Among {convexTripsSummary.totalSettled} settled trips current
              month
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
                {convexMembersSummary.current}
              </span>
              <div className="flex items-center gap-1 text-sm">
                {convexMembersSummary.differences >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}

                <span
                  className={
                    convexMembersSummary.differences >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {convexMembersSummary.percentage}%
                </span>
              </div>
            </div>
            {convexMembersSummary.differences >= 0 ? (
              <p className="text-xs text-gray-500">
                Increased by {convexMembersSummary.differences} members compared
                to last month
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                Decreased by {Math.abs(convexMembersSummary.differences)}{" "}
                members compared to last month
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default MatrixCards;
