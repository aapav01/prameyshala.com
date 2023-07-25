import Link from "next/link";
import React, { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type ServiceCardProps = {
  icon?: ReactNode;
  category: any;
};

export default async function ServiceCard(props: ServiceCardProps) {
  return (
    <HoverCard key={props.category?.id}>
      <HoverCardTrigger asChild>
        <div className="single__service">
          {props.icon && (
            <div className="service__img">
              <span className="service__icon">{props.icon}</span>
              <div className="service__bg__img">
                <svg
                  className="service__icon__bg"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M63.3775 44.4535C54.8582 58.717 39.1005 53.2202 23.1736 47.5697C7.2467 41.9192 -5.18037 32.7111 3.33895 18.4477C11.8583 4.18418 31.6595 -2.79441 47.5803 2.85105C63.5011 8.49652 71.8609 30.2313 63.3488 44.4865L63.3775 44.4535Z"
                    fill="#5F2DED"
                    fillOpacity="0.05"
                  />
                </svg>
              </div>
            </div>
          )}
          <div className="service__content">
            <h3>
              <a>{props.category.name}</a>
            </h3>
            {props.category?.description && <p>{props.category?.description}</p>}
          </div>
          <div className="service__small__img">
            <svg fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.5961 10.265L19 1.33069L10.0022 3.73285L1 6.1306L7.59393 12.6627L14.1879 19.1992L16.5961 10.265Z"
                stroke="#FFB31F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex flex-col justify-between space-x-4">
          <div className="space-y-1">
            <div className="flex justify-between">
              <h4 className="text-md font-semibold">{props.category?.name}</h4>
              {props.category?.popular && (
                <Badge className="bg-primary/10 text-primary">
                  <h4 className="text-sm font-semibold">Popular</h4>
                </Badge>
              )}
            </div>
            <p className="text-sm">{props.category?.description}</p>
            {props.category?.subjectSet.map((subject: any) => {
              return (
                <div key={subject?.standard?.id} className="flex flex-col pt-2">
                  <div className="flex justify-between mt-2">
                    <Link href={`/class/${subject?.standard?.slug}`}>
                      <h4 className="font-black">{subject?.standard?.name}</h4>
                    </Link>
                    <div className="flex flex-col justify-evenly items-center">
                      {subject?.standard?.latestPrice <
                      subject?.standard?.beforePrice ? (
                        <>
                          <h4 className="font-semibold text-primary">
                            ₹{subject?.standard?.latestPrice}{" "}
                            <span className="line-through decoration-1 text-gray-500 text-[0.9rem] ml-1">
                              / ₹{subject?.standard?.beforePrice}
                            </span>
                          </h4>
                          <Badge
                            className="bg-secondary/10 text-secondary hover:bg-secondary/50"
                            variant={"secondary"}
                          >
                            {Math.round(
                              ((subject?.standard?.beforePrice -
                                subject?.standard?.latestPrice) /
                                subject?.standard?.beforePrice) *
                                100
                            )}
                            % OFF
                          </Badge>
                        </>
                      ) : (
                        <h4 className="font-semibold text-primary">
                          ₹{subject?.standard?.latestPrice}
                        </h4>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
