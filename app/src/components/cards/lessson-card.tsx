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

type Props = {
  lesson: {
    id: number;
    title: string;
    type: string;
  };
};

export default function LessonCard({ lesson }: Props) {
  return (
    <Link href={"/learn/lesson/" + lesson.id}>
      <Card className="animate-in duration-200 ease-in hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-300/50 ">
        <CardHeader className="flex justify-between">
          <CardTitle>{lesson.title}</CardTitle>
        </CardHeader>
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
