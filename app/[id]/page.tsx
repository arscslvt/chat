import { Metadata, ResolvingMetadata } from "next";
import Home from "../page";
import React from "react";
import getThread from "@/lib/api/thread/get";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  const chat = await fetch(`https://chat.salvatore.ai/api/thread/${id}`)
    .then((res) => res.json())
    .catch(() => null);

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []

  return {
    title: chat?.metadata.name || "A thread on Chat by Salvatore Aresco.",
  };
}

export default async function Chat({ params, searchParams }: Props) {
  return <Home />;
}
