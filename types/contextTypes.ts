interface StateType {
  user: any; // Replace 'any' with the actual type of user
  access: string | null;
  // Add any other properties your state might have
}

type ActionType =
  | { type: "SET_USER"; payload: any } // Replace 'any' with the actual type of payload
  | { type: "SET_ACCESS"; payload: string | null }
  | { type: "LOGOUT" };

export { StateType, ActionType };
