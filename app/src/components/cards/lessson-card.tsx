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
import { FileTextIcon, ActivityLogIcon, PlayIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  lesson: {
    id: number;
    title: string;
    type: string;
    thumbUrl: string;
  };
  size?: "sm";
};

export function LessonCardLoading() {
  return (
    <Card className="animate-in duration-200 ease-in hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-300/50 ">
      <CardHeader className="flex justify-between">
        <CardTitle>
          <Skeleton className="w-[200px] h-9 mt-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-2 pb-0">
        <div className="flex flex-row pb-3 text-sm gap-1 justify-between">
          <span className="inline-flex gap-1">
            <Skeleton className="w-[100px] h-4 mt-4" />
          </span>
          <Button
            className="hover:shadow hover:border-0 hover:shadow-green-500/50 hover:bg-green-700 hover:text-green-200"
            size={"icon"}
            variant={"outline"}
          >
            <PlayIcon />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LessonCard({ lesson, size }: Props) {
  console.log(lesson.thumbUrl);
  return (
    <Link href={"/learn/lesson/" + lesson.id}>
      <Card className="animate-in duration-200 ease-in hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-300/50 ">
        <CardHeader className="flex justify-between">
          <CardTitle>{lesson.title}</CardTitle>
        </CardHeader>
        {size !== "sm" && lesson.thumbUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="rounded-t-lg p-1"
            width={630}
            height={400}
            src={`${process.env.NEXT_PUBLIC_MEDIA_CDN}/static/media/${lesson.thumbUrl}`}
            alt={lesson.title}
          />
        )}
        <CardContent className="mt-2 pb-0">
          <div className="flex flex-row pb-3 text-sm gap-1 justify-between">
            <span className="inline-flex gap-1">{lesson.type}</span>
            <Button
              className="hover:shadow hover:border-0 hover:shadow-green-500/50 hover:bg-green-700 hover:text-green-200"
              size={"icon"}
              variant={"outline"}
            >
              <PlayIcon />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
