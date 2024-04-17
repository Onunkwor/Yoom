"use client";

import HomeCard from "./HomeCard";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import ReactDatePicker from "react-datepicker";
const MeetingTypeList = () => {
  const router = useRouter();
  const [meeting, setMeeting] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting"
  >();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const [callDetails, setCallDetails] = useState<Call>();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        toast.error("Please select a date and time");
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call("default", id);
      if (!call) {
        toast.error("Could not create call");
        throw new Error("Failed to create call");
      }
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();

      const description = values.description || "Instant Meeting";
      const callPromise = new Promise((resolve, reject) => {
        call
          .getOrCreate({
            data: {
              starts_at: startsAt,
              custom: {
                description: description,
              },
            },
          })
          .then((response) => {
            resolve(response);
          });
      });
      setCallDetails(call);
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast.promise(callPromise, {
        loading: "Loading...",
        success: (data) => {
          return "Meeting has been created ";
        },
        error: "Error creating meeting",
      });
    } catch (error) {
      console.log("Error creating meeting", error);
      toast.error("Error creating meeting");
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        desc="Start Instant Meting"
        color="bg-orange-1"
        handleClick={() => setMeeting("isInstantMeeting")}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        desc="Plan Your Meeting"
        color="bg-blue-1"
        handleClick={() => setMeeting("isScheduleMeeting")}
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        desc="Check out your recordings"
        color="bg-purple-1"
        handleClick={() => router.push("/recordings")}
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        desc="Via invitation link"
        color="bg-yellow-1"
        handleClick={() => setMeeting("isJoiningMeeting")}
      />

      {!callDetails ? (
        <MeetingModal
          isOpen={meeting === "isScheduleMeeting"}
          onClose={() => setMeeting(undefined)}
          title="Create Meeting"
          className="text-center"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="bg-dark-3 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, YYYY hh:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meeting === "isScheduleMeeting"}
          onClose={() => setMeeting(undefined)}
          title="Meeting created"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast.success("Link copied");
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          buttonText="Copy Meeting Link"
        />
      )}
      <MeetingModal
        isOpen={meeting === "isInstantMeeting"}
        onClose={() => setMeeting(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;
