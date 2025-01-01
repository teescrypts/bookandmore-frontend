"use client";

import { CustomerData } from "@/app/actions/action-types";
import { fetchUserData, mergeCart } from "@/app/actions/actions";
import { SplashScreen } from "@/components/_loading";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  isGuest: boolean;
  customerData?: CustomerData;
  getUserData: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isGuest, setIsGuest] = useState<boolean>(true);
  const [customerData, setCustomerData] = useState<CustomerData>();
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const getUserData = useCallback(async () => {
    try {
      const result = await fetchUserData();

      if (result) {
        if (result === "session expired") {
          setIsGuest(true);
        }

        if (typeof result !== "string" && result?.error) {
          setIsGuest(true);
        }

        if (typeof result !== "string" && result?.success) {
          const userResponse = result.success;

          if (userResponse.type !== "customer") {
            setIsGuest(true);
          } else {
            setIsGuest(false);
            setCustomerData(userResponse as CustomerData);
          }
        }
      }
    } catch (e) {
      throw new Error("Something went wrong. Please refresh");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        isGuest,
        customerData,
        getUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useClientData = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useClientData must be used within an AuthProvider");
  }
  return context;
};
