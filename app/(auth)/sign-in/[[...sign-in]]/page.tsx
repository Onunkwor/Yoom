import Loader from "@/components/ui/Loader";
import { SignIn, useAuth } from "@clerk/nextjs";

export default function Page() {
  // const { isLoaded } = useAuth();
  // if (!isLoaded) {
  //   return <Loader />;
  // }
  return (
    <main className="flex-center w-full h-screen">
      <SignIn />
    </main>
  );
}
