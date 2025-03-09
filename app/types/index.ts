export interface User {
  userId: string;
  email: string;
  name: string;
  role: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface Member {
  memberId: string;
  userId: string;
  memberName: string;
  memberEmail: string;
  role: string;
  createdAt?: number;
}
