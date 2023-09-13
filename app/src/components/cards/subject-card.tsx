import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileTextIcon,
  FileIcon,
  ActivityLogIcon,
  PlayIcon,
  ChatBubbleIcon,
  ClockIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import Image from "next/image";

type Props = {
  subject: any;
  size?: "sm";
};

export default function SubjectCard({ subject, size }: Props) {
  const lessons = subject.chapterSet.reduce(
    (acc: number, chapter: any) => acc + chapter.lessonSet.length,
    0
  );
  return (
    <Link href={"/learn/subject/" + subject.slug}>
      <Card className="animate-in duration-200 ease-in hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-300/50 ">
        {size !== "sm" && subject.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="rounded-t-lg p-1"
            width={630}
            height={400}
            src={`${process.env.NEXT_PUBLIC_MEDIA_CDN}/static/media/${subject.image}`}
            alt={subject.name}
          />
        ) : (
          <Image
            src={`/api/og/subject/${subject.slug}`}
            width={630}
            height={400}
            alt={subject.name}
            className="rounded-t-lg p-1"
          />
        )}
        <CardContent className="mt-2 pb-0">
          <div className="flex flex-row pb-3 text-sm gap-1 justify-between">
            <span className="inline-flex gap-2">
              <FileIcon className="h-4 w-4 text-secondary" />
              <span>{subject.chapterSet.length} Chapters</span>
            </span>
            <span className="inline-flex gap-1">
              <FileTextIcon className="h-4 w-4 text-secondary" />
              <span>{lessons} Lessons</span>
            </span>
          </div>
          <CardTitle>{subject.name}</CardTitle>
          <CardDescription className="h-10 text-ellipsis">
            {subject.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex gap-2 justify-center border-t-2 border-t-pink-400 py-2 text-pink-700">
          <ActivityLogIcon className="mr-2 h-4 mb-1" /> Chapters List
        </CardFooter>
      </Card>
    </Link>
  );
}
