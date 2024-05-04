"use client";
import {
  DeviceSettings,
  VideoPreview,
  useCall,
} from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { toast } from "sonner";

const MeetingSetUp = ({
  setIsSetUpComplete,
}: {
  setIsSetUpComplete: (value: boolean) => void;
}) => {
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false);
  const call = useCall();
  if (!call) {
    throw new Error("useCall must be used within SteamCall component");
  }

  useEffect(() => {
    let isMounted = true;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        console.log("Access granted");
      })
      .catch(() => {
        // Handle access denied
        if (isMounted) {
          toast.error("Please allow camera access in site settings");
        }

        console.log("Access denied");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isMicCamToggledOn) {
      call?.camera.disable();
      call?.microphone.disable;
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMicCamToggledOn, call?.camera, call?.microphone]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-2xl font-bold">Setup</h1>

      <VideoPreview />

      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggledOn}
            onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="rounded-md bg-green-500 px-4 py-2.5"
        onClick={() => {
          call.join();
          setIsSetUpComplete(true);
        }}
      >
        Join meeting
      </Button>
    </div>
  );
};

export default MeetingSetUp;
