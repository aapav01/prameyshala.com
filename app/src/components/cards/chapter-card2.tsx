import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileTextIcon } from "@radix-ui/react-icons";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import Image from "next/image";

type Props = {
  chapter: any;
  size?: "sm";
};

export function ClassCardSkeleton() {
  return (
    <Card>
      <Skeleton className="h-36 w-full rounded-t-lg p-1" />
      <CardHeader>
        <div className="flex flex-row justify-between items-center gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-6 w-6" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-6" />
          <Skeleton className="h-6" />
          <Skeleton className="h-6" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function ChapterCard2({ chapter, size }: Props) {
  return (
    <Card className="">
      {size !== "sm" && chapter?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="rounded-t-lg p-1"
          width={630}
          height={400}
          src={`${process.env.NEXT_PUBLIC_MEDIA_CDN}/static/media/${chapter?.image}`}
          alt={chapter.name}
        />
      ) : null}
      <CardHeader>
        <div className="flex flex-row justify-between items-center -mt-4">
          <div className="flex-wrap w-[48%]">
            <CardTitle className="text-lg shrink">{chapter.name}</CardTitle>
          </div>
          <div className="self-start">
            <span className="inline-flex gap-1 flex-nowrap">
              <FileTextIcon className="h-4 w-4 text-purple-600" />
              <span>{chapter.lessonSet.length} Lessons</span>
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 gap-x-3 -mt-4 -mx-1">
          <Link href={"/learn/chapter/" + chapter.id}>
            <div className="text-purple-800 bg-purple-500/20 px-2 py-4 rounded-lg font-semibold text-center animate-in duration-200 ease-in hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-300/50">
              Video Lesson
            </div>
          </Link>
          {chapter.notesSet.length > 0 && (
            <Link
              href={`${process.env.NEXT_PUBLIC_MEDIA_CDN}/static/media/${chapter.notesSet[0].notesFile}`}
              target="_blank"
              download={true}
            >
              <div className="text-purple-800 bg-purple-500/20 px-2 py-4 rounded-lg font-semibold text-center animate-in duration-200 ease-in hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-300/50">
                Study Notes
              </div>
            </Link>
          )}
          {chapter?.quizSet.length > 0 && (
            <Link
              href={{
                pathname: `/learn/chapter/${chapter.id}/quiz`,
              }}
            >
              <div className="text-purple-800 bg-purple-500/20 px-2 py-4 rounded-lg font-semibold text-center animate-in duration-200 ease-in hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-300/50">
                Quiz
              </div>
            </Link>
          )}
          <Link
            href={{
              pathname: "/student-report",
              query: { chapterId: chapter.id },
            }}
          >
            <div className="text-purple-800 bg-purple-500/20 px-2 py-4 rounded-lg font-semibold text-center animate-in duration-200 ease-in hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-300/50">
              Report
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
