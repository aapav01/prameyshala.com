import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LessonCardLoading } from "@/components/cards/lessson-card";


type Props = {
  params: { id: string };
};

export default function ChapterDetailLoading() {
  return (
    <>
      <header className="bg-cyan-700 py-6 text-indigo-50 shadow-lg shadow-cyan-500/50">
        <div className="container">
          <h1 className="text-4xl font-bold">
            <Skeleton className="w-[200px] h-9 mt-4" />
          </h1>
          <span className="py-2">
            <Skeleton className="w-[300px] h-4 mt-4" />
          </span>
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 px-4 py-6 gap-4">
        <LessonCardLoading />
        <LessonCardLoading />
        <LessonCardLoading />
        <LessonCardLoading />
      </div>
    </>
  );
}
