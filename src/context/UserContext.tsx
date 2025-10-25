import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserData {
  sellerId: string;
  name: string;
  email: string;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserDataState] = useState<UserData | null>(null);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem("userData");
    if (stored) {
      try {
        setUserDataState(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse userData from localStorage");
      }
    } else {
      // For demo, set default user data
      const defaultUser = {
        sellerId: "ritu_beauty_001",
        name: "Ritu",
        email: "ritu@ritubeauty.com"
      };
      setUserDataState(defaultUser);
      localStorage.setItem("userData", JSON.stringify(defaultUser));
    }
  }, []);

  const setUserData = (data: UserData | null) => {
    setUserDataState(data);
    if (data) {
      localStorage.setItem("userData", JSON.stringify(data));
    } else {
      localStorage.removeItem("userData");
    }
  };

  const isAuthenticated = userData?.sellerId === "ritu_beauty_001";

  return (
    <UserContext.Provider value={{ userData, setUserData, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
