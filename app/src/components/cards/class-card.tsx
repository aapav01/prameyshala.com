import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

type Props = {
  standard: any;
};

export default function ClassCard({ standard }: Props) {
  const discount: any =
    100 - (standard.latestPrice / standard.beforePrice) * 100;
  return (
    <Card>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={standard.image ? standard.image : "https://placehold.co/600x400"}
        alt={standard.name}
        className="rounded-t-lg p-1"
      />
      <CardHeader>
        <CardTitle>{standard.name}</CardTitle>
      </CardHeader>
      <CardContent>
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
      <CardFooter className="justify-end">
        <Link href={"/class/" + standard.slug}>
          <Button size={"sm"}>View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
