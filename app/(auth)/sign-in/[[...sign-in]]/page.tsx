import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex-center w-full h-screen">
      <SignIn />
    </main>
  );
}
