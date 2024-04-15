"use client";
import useGetCalls from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import Loader from "./Loader";
import { toast } from "sonner";

interface CallListProps {
  type: "ended" | "upcoming" | "recordings";
}
const CallList = ({ type }: CallListProps) => {
  const router = useRouter();
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  console.log(callRecordings);

  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "upcoming":
        return upcomingCalls;
      case "recordings":
        return recordings;
      default:
        return [];
    }
  };
  const getCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "upcoming":
        return "No Upcoming Calls";
      case "recordings":
        return "No Call Recordings";
      default:
        return "";
    }
  };
  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings.map((record) => record.queryRecordings())
        );
        console.log(callData);

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordings);
      } catch (error) {
        console.log("Error fetching call recordings", error);
        toast.error("Please try again later");
      }
    };
    if (type === "recordings") {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  const calls = getCalls();
  const noCallsMessage = getCallsMessage();
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((call: Call | CallRecording, index) => (
          <MeetingCard
            key={index}
            icon={
              type === "ended"
                ? "/icons/previous.svg"
                : type === "upcoming"
                ? "/icons/upcoming.svg"
                : "/icons/recordings.svg"
            }
            title={
              (call as Call).state?.custom.description.substring(0, 20) ||
              (call as CallRecording).filename.substring(0, 20) ||
              "No description"
            }
            date={
              (call as Call).state?.startsAt?.toLocaleString() ||
              (call as CallRecording).start_time.toLocaleString()
            }
            isPreviousMeeting={type === "ended"}
            buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
            handleClick={
              type === "recordings"
                ? () => router.push(`${(call as CallRecording).url}`)
                : () => router.push(`/meeting/${(call as Call).id}`)
            }
            link={
              type === "recordings"
                ? (call as CallRecording).url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                    (call as Call).id
                  }`
            }
            buttonText={type === "recordings" ? "Play" : "Start"}
          />
        ))
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
