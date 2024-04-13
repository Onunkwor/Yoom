"use server";

import { currentUser } from "@clerk/nextjs";
import { StreamClient } from "@stream-io/node-sdk";
import { toast } from "sonner";
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiKeySecret = process.env.STREAM_SECRETE_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) {
    toast.error("User is not logged in");
    throw new Error("User is not logged in");
  }
  if (!apiKey) throw new Error("Steam API key is required");
  if (!apiKeySecret) throw new Error("Steam API key secret  is required");

  const client = new StreamClient(apiKey, apiKeySecret);

  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
  const issued = Math.floor(Date.now() / 1000) - 60;

  const token = client.createToken(user.id, exp, issued);

  return token;
};
