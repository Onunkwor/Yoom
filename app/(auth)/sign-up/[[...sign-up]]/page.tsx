import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex-center w-full h-screen">
      <SignUp />
    </main>
  );
}
