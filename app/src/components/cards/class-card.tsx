import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlayIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import Image from "next/image";

type Props = {
  standard: any;
  enroll?: true;
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

export default function ClassCard({ standard, enroll, size }: Props) {
  const discount: any =
    100 - (standard.latestPrice / standard.beforePrice) * 100;
  return (
    <Link href={enroll ? "learn/" + standard.slug : "/class/" + standard.slug}>
      <Card className="animate-in duration-200 ease-in hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-300/50">
        {size !== "sm" && standard.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="rounded-t-lg p-1"
            width={630}
            height={400}
            src={`${process.env.NEXT_PUBLIC_MEDIA_CDN}/static/media/${standard.image}`}
            alt={standard.name}
          />
        ) : (
          <Image
            width={630}
            height={400}
            src={`/api/og/class/${standard.slug}`}
            alt={standard.name}
            className="rounded-t-lg p-1"
          />
        )}
        <CardHeader>
          <div className="flex flex-row justify-between items-center">
            <CardTitle className="text-lg">{standard.name}</CardTitle>
            {enroll && (
              <Button variant={"secondary"} size={"icon"}>
                <PlayIcon className="h-5 w-5" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!enroll && (
            <div className="flex justify-between -mt-4 mb-2">
              <div className="text-lg font-medium font-sans text-gray-500">
                <span className="text-primary">₹ {standard.latestPrice}</span>
                {standard.latestPrice < standard.beforePrice && (
                  <>
                    <span className=" font-thin text-sm "> / </span>
                    <span className="font-normal text-sm line-through">
                      ₹ {standard.beforePrice}
                    </span>
                  </>
                )}
              </div>
              {standard.latestPrice < standard.beforePrice && (
                <div className="text-pink-500 font-bold py-1 px-2 text-sm bg-pink-100 text-center rounded uppercase">
                  {parseInt(discount)}% off
                </div>
              )}
            </div>
          )}
          <div className="grid grid-cols-3 gap-2">
            {standard.subjectSet.map((subject: any, index: number) => (
              <div
                className="text-purple-800 bg-purple-500/20 px-1 py-1 rounded-lg text-xs font-semibold text-center"
                key={index}
              >
                {subject.name}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
