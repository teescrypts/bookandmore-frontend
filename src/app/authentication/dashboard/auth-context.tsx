import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchUserData } from "@/app/actions/actions";
import { useRouter } from "next/navigation";
import { AdminType, StaffType, TenantType } from "@/app/actions/action-types";
import { SplashScreen } from "@/components/_loading";

type AuthContextType = {
  userData: AdminType | TenantType | StaffType | null;
  userType: string | null;
  getUserData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<
    AdminType | TenantType | StaffType | null
  >(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [redirecting, setRedirecting] = useState<boolean>(false);
  const router = useRouter();

  const getUserData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchUserData();

      if (result === "session expired") {
        setRedirecting(true);
        router.replace(
          `/demo/login?reason=${"Your login session expired. Please login again"}`
        );
      }

      if (typeof result !== "string" && result?.error) {
        setRedirecting(true);
        router.replace(`/demo/login?reason=${result.error}`);
      }

      if (typeof result !== "string" && result?.success) {
        const userResponse = result.success!;

        setUserData(userResponse as AdminType | TenantType | StaffType | null);
        setUserType(userResponse.type);
      }
    } catch (error) {
      setRedirecting(true);
      router.replace(`/demo/login?reason=${error}`);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  // Early return during redirect
  if (redirecting) {
    return null; // Avoid rendering during redirect
  }

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={{ userData, userType, getUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUserData must be used within an AuthProvider");
  }
  return context;
};
