import Loader from "@/components/ui/Loader";
import { useAuth } from "@clerk/nextjs";
import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { isLoaded } = useAuth();
  if (!isLoaded) {
    return <Loader />;
  }
  return <section>{children}</section>;
};

export default AuthLayout;
