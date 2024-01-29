import { Metadata, ResolvingMetadata } from "next";
import React from "react";

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
  const chat = await fetch(`https://chat.salvatorearesco.com/api/thread/${id}`)
    .then((res) => res.json())
    .catch(() => null);

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []

  console.log("This chat metadata: ", chat);

  return {
    title: chat?.metadata.name,
    openGraph: {
      title: chat?.metadata.name,
      description:
        "View this thread on Chat by Salvatore Aresco. A free web app for chatting with GPT-4 powered bots.",
    },
  };
}

export default function ThreadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
