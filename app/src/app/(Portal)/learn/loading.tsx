import React from "react";
import { Metadata } from "next";
import { ClassCardSkeleton } from "@/components/cards/class-card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

export const metadata: Metadata = {
  title: "My Learning Portal | Pramey Shala",
};

export default function LearnPageLoading({}: Props) {
  return (
    <main className="min-h-screen">
      <header className="py-12 bg-indigo-50 relative">
        <div className="container text-foreground">
          <span className="text-xl">Welcome, </span>
          <Skeleton className="w-[200px] h-9 mt-4" />
          <Skeleton className="w-[100px] h-4 mt-4" />
        </div>
      </header>
      <section className="container py-12">
        <div className="py-6">
          <h2 className="text-2xl font-medium">
            My <span className="rock2-underline">Subscriptions</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 py-4 gap-4">
            <ClassCardSkeleton />
            <ClassCardSkeleton />
            <ClassCardSkeleton />
            <ClassCardSkeleton />
          </div>
        </div>
        <div className="py-6">
          <h2 className="text-2xl font-medium">
            Available <span className="rock2-underline">Courses</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 py-4 gap-4">
            <ClassCardSkeleton />
            <ClassCardSkeleton />
            <ClassCardSkeleton />
            <ClassCardSkeleton />
          </div>
        </div>
      </section>
    </main>
  );
}
