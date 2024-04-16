"use client";
import Loader from "@/components/ui/Loader";
import MeetingRoom from "@/components/ui/MeetingRoom";
import MeetingSetUp from "@/components/ui/MeetingSetUp";
import { Button } from "@/components/ui/button";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Meeting = ({ params }: { params: { id: string } }) => {
  const { isLoaded } = useUser();
  const router = useRouter();
  const [isSetUpComplete, setIsSetUpComplete] = useState(false);
  const { call, isCallLoading } = useGetCallById(params.id);
  if (!isLoaded || isCallLoading) return <Loader />;
  const currentTime = new Date();
  const endedTime = call?.state?.endedAt;
  const endedDate = new Date(endedTime!);
  const handleRedirect = () => {
    router.push("/");
    setTimeout(() => {
      window.location.reload();
    }, 1600);
  };
  if (currentTime > endedDate) {
    return (
      <div className="text-white relative">
        <Button
          className="absolute left-8 top-8 flex gap-2"
          onClick={handleRedirect}
        >
          <Image
            src="/icons/backArrow.svg"
            width={15}
            height={15}
            alt="arrow"
          />{" "}
          Back to home
        </Button>
        <div className=" flex justify-center items-center h-screen gap-3 !overflow-hidden">
          <p className="text-2xl font-bold">The meeting has ended</p>
        </div>
      </div>
    );
  }
  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetUpComplete ? (
            <MeetingSetUp setIsSetUpComplete={setIsSetUpComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;
