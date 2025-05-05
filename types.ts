export type MemberSpending = {
  memberId: string;
  memberName: string;
  totalSpent: number;
};

export type Summary = {
  allSpending: MemberSpending[];
  averageSpending: number;
  topSpender: MemberSpending;
  totalOverallSpending: number;
};
