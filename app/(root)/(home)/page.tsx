"use client";
import Loader from "@/components/ui/Loader";
import MeetingTypeList from "@/components/ui/MeetingTypeList";
import useGetCalls from "@/hooks/useGetCalls";
import { formatDate, formatTimeWithAMPM } from "@/lib/utils";
import { Call } from "@stream-io/video-react-sdk";
import React from "react";

const Home = () => {
  const { upcomingCalls, isLoading } = useGetCalls();
  if (isLoading) {
    return <Loader />;
  }
  const calls = upcomingCalls.map((call: Call) => {
    return { time: call.state.startsAt, id: call.id };
  });
  // console.log(upcomingCalls);

  // const earliestCall = calls.reduce((earliest, current) => {
  //   const earliestTime = new Date(earliest!);
  //   const currentTime = new Date(current.time!);

  //   return earliestTime < currentTime ? earliest : current;
  // }, calls[0].time);
  const earliestCall = Date.now();

  const firstUpcomingTime = new Date(earliestCall);

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal">
            Upcoming Meeting at {formatTimeWithAMPM(firstUpcomingTime)}
          </h2>

          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">
              {formatTimeWithAMPM(firstUpcomingTime)}
            </h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">
              {formatDate(firstUpcomingTime)}
            </p>
          </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;
