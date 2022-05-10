export interface UserData {
  id: number;
  username: string;
  active: boolean;
  token: string;
}

export interface UserRO {
  user: UserData;
}
