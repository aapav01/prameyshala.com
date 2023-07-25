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

type Props = {
  subject: any;
};

export default function SubjectCard({ subject }: Props) {
  const lessons = subject.chapterSet.reduce(
    (acc: number, chapter: any) => acc + chapter.lessonSet.length,
    0
  );
  return (
    <Card>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={
          subject.image
            ? subject.image
            : `/subject/${subject.slug}/opengraph-image`
        }
        width={600}
        height={400}
        alt={subject.name}
        className="rounded-t-lg p-1"
      />
      <CardContent className="mt-2">
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
        <div className="flex justify-end">
          <Button variant={"secondary"}>
            <ActivityLogIcon className="mr-2 h-4 mb-1" />
            Chapters List
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
