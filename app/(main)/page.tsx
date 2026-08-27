import { Suspense } from "react";
import { HomeContent, HomeSkeleton } from "@/components/home/HomeContent";

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
