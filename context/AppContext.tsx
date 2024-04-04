import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  Dispatch,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StateType, ActionType } from "../types/contextTypes";

const storeData = async (name: string, value: string) => {
  await AsyncStorage.setItem(name, value);
};

const returnStoredData = async (name: string) => {
  var value = await AsyncStorage.getItem(name);
  if (value) {
    return value;
  } else return null;
};
// Initial state
const initialState = {
  user: null,
  access: null,
};

// Reducer function
const appReducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case "SET_USER": {
      console.log("HERE");
      storeData("USER", action.payload);
      return { ...state, user: action.payload };
    }
    case "SET_ACCESS":
      if (action.payload) {
        storeData("ACCESS", action.payload);
        return { ...state, access: action.payload };
      }

    case "LOGOUT": {
      AsyncStorage.removeItem("ACCESS");
      AsyncStorage.removeItem("SET_USER");

      return { ...state, access: null, refresh: null };
    }

    default:
      return state;
  }
};

export const AppContext = createContext<{
  state: StateType;
  dispatch: Dispatch<ActionType>;
  isLoading: boolean;
}>({ state: initialState, dispatch: () => null, isLoading: true });

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const loadStoredData = async () => {
      const storedAccess = await returnStoredData("ACCESS");
      dispatch({ type: "SET_ACCESS", payload: storedAccess });
      const storedUser = await returnStoredData("USER");
      dispatch({ type: "SET_USER", payload: storedUser });

      setIsLoading(false);
    };

    loadStoredData();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <AppContext.Provider value={{ state, dispatch, isLoading }}>
      {children}
    </AppContext.Provider>
  );
};
