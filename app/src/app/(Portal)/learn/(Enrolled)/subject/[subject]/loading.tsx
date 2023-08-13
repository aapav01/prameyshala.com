import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { ChapterCardLoading } from "@/components/cards/chapter-card";

type Props = {
  params: { subject: string };
};

export default function SubjectDetailLoading({ params }: Props) {
  return (
    <>
      <header className="bg-purple-700 py-6 h-24 text-indigo-50 shadow-lg shadow-purple-500/50">
        <div className="container">
          <h1 className="text-4xl font-bold">
            <Skeleton className="w-[200px] h-9 mt-4" />
            <span className="text-xl">
              <Skeleton className="w-[100px] h-4 mt-4" />
            </span>
          </h1>
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 px-4 py-6 gap-4">
        <ChapterCardLoading />
        <ChapterCardLoading />
        <ChapterCardLoading />
        <ChapterCardLoading />
      </div>
    </>
  );
}
