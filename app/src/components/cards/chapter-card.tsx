import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileTextIcon, ListBulletIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { channel } from "diagnostics_channel";

type Props = {
  chapter: any;
  size?: "sm";
};

export function ChapterCardLoading() {
  return (
    <Card className="animate-in duration-200 ease-in hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-300/50 ">
      <CardHeader className="flex justify-between">
        <CardTitle>
          <Skeleton className="w-[200px] h-9 mt-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-2 pb-0">
        <div className="flex flex-row pb-3 text-sm gap-1 justify-between">
          <span className="inline-flex gap-1">
            <FileTextIcon className="h-4 w-4 text-purple-600" />
            <span>
              <Skeleton className="w-[100px] h-4 mt-4" />
            </span>
          </span>
          <Button
            className="hover:shadow hover:border-0 hover:shadow-cyan-500/50 hover:bg-cyan-700 hover:text-cyan-200"
            size={"icon"}
            variant={"outline"}
          >
            <ListBulletIcon />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ChapterCard({ chapter, size }: Props) {
  return (
    <Link href={"/learn/chapter/" + chapter.id}>
      <Card className="animate-in duration-200 ease-in hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-300/50 ">
        {size !== "sm" && chapter.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="rounded-t-lg p-1"
            width={630}
            height={400}
            src={`${process.env.NEXT_PUBLIC_MEDIA_CDN}/static/media/${chapter.image}`}
            alt={chapter.name}
          />
        )}
        <CardHeader className="flex justify-between">
          <CardTitle>{chapter.name}</CardTitle>
        </CardHeader>
        <CardContent className="mt-2 pb-0">
          <div className="flex flex-row pb-3 text-sm gap-1 justify-between">
            <span className="inline-flex gap-1">
              <FileTextIcon className="h-4 w-4 text-purple-600" />
              <span>{chapter.lessonSet.length} Lessons</span>
            </span>
            <Button
              className="hover:shadow hover:border-0 hover:shadow-cyan-500/50 hover:bg-cyan-700 hover:text-cyan-200"
              size={"icon"}
              variant={"outline"}
            >
              <ListBulletIcon />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
