"use client";

import { useState } from "react";
import { Dashboard } from "./Dashboard";
import MonthSelector from "./MonthSelector";
import { Summary } from "@/types";

const DashboardWrapper = () => {
  const [summary, setSummary] = useState<Summary>();
  const getSummaries = async (value: any) => {
    setSummary(value);
  };

  return (
    <>
      <MonthSelector passValue={getSummaries} />
      {/* <Dashboard data={summary} /> */}
    </>
  );
};

export default DashboardWrapper;
