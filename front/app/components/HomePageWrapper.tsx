"use client";

import dynamic from "next/dynamic";

// Dynamically import the HomePage component
const HomePage = dynamic(() => import("@/app/Home/page"), {
  loading: () => <p>Loading HomePage...</p>,
  ssr: false,
});

export default function HomePageWrapper({ session }: { session: any }) {
  return <HomePage/>;
}
