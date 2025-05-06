import { Badge } from "../ui/badge";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Summary } from "@/types";

interface DashboardProps {
  data: Summary | undefined;
}

const Dashboard = ({ data }: DashboardProps) => {
  if (!data) return null;

  console.log(data);

  return (
    <div className="flex gap-4 mb-8">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-3xl font-bold">${data.totalOverallSpending}</h3>
          {12 >= 0 ? (
            <Badge
              variant={"secondary"}
              className="bg-green-200 font-medium rounded-full"
            >
              <ArrowUp className="mr-1 h-3 w-3" />
              12%
            </Badge>
          ) : (
            <Badge
              variant={"secondary"}
              className="bg-red-200 font-medium rounded-full"
            >
              <ArrowDown className="mr-1 h-3 w-3" />
              12%
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card className="rounded-xl border border-gray-100 shadow-sm">
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium">Top spender</div>

                <Badge variant="outline">
                  {data.topSpender?.memberName || "N/A"}
                </Badge>
              </div>
              <div className="text-2xl font-bold">
                ${data.topSpender?.totalSpent || "0"}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-gray-100 shadow-sm">
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium">Average Spending</div>
                <Badge variant={"outline"}>Per Person</Badge>
              </div>
              <div className="text-2xl font-bold">${data.averageSpending}</div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-2">
            <Card className="rounded-xl border border-gray-100 shadow-sm">
              <CardContent>
                <div className="text-sm font-medium">Recipes</div>
                <div className="text-2xl font-bold">5</div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-gray-100 shadow-sm">
              <CardContent>
                <div className="text-sm font-medium">Members</div>
                <div className="text-2xl font-bold">
                  {data.allSpending.length}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
