import MatrixCards from "./_components/MetrixCards";
import CalendarCard from "./_components/CalendarCard";
import { ExpenseCard } from "./_components/ExpenseCard";
import RecentTripsCard from "./_components/RecentTripsCard";
import { MembersSummary, TripsSummaries } from "@/app/types";

const Dashboard = ({
  convexTripsSummary,
  convexMembersSummary,
}: {
  convexTripsSummary: TripsSummaries;
  convexMembersSummary: MembersSummary;
}) => {
  return (
    <div className="flex gap-4 mb-8">
      <div className="flex-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Overview of your grocery
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="grid grid-cols-3 gap-4 col-span-3">
            <MatrixCards
              convexTripsSummary={convexTripsSummary}
              convexMembersSummary={convexMembersSummary}
            />
          </div>
          <div className="col-span-3 grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <ExpenseCard />
            </div>
            <CalendarCard />
          </div>
          <div className="col-span-3">
            <RecentTripsCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
