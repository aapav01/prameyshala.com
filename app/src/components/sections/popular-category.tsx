import React from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
// Components
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/service-card";
// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import Link from "next/link";

type Props = {};

const query = gql`
  {
    categories(popular: true) {
      id
      name
      description
      popular
      subjectSet {
        standard {
          name
          latestPrice
          beforePrice
          slug
          id
        }
      }
    }
  }
`;

export default async function PopularCategory({}: Props) {
  const { data } = await getClient().query({ query });
  return (
    <section className="container py-12">
      <div className="flex lg:items-center gap-3 max-lg:flex-col">
        <div className="md:mb-7 w-fit">
          <span className="mb-5 text-primary bg-primary/10 rounded-2xl text-sm font-semibold px-3 py-1">
            Course List
          </span>
          <h2 className="text-4xl font-bold xl:text-5xl lg:leading-10 leading-[50px] font-['hind',_sans-serif] mt-5">
            Popular <span className="rock-underline">Subjects</span>
          </h2>
        </div>
        <div className="flex-1 px-4">
          <p>
            PrameShala Tutorials distinguishes itself as a leading option for
            core subjects by offering a thorough approach, expert mentors, and
            engaging techniques. With a strong focus on Chemistry, Maths,
            Biology, and Physics, they provide a holistic learning experience,
            equipping students to excel in their academic pursuits.
          </p>
        </div>
        <div className="flex justify-end">
          <Link href="/subject">
            <Button variant={"secondary"} className="py-6">
              All Categories
              <ArrowRightIcon className="ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="w-full mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.categories.map((category: any) => {
          return (
            <ServiceCard
              key={category.id}
              category={category}
              icon={
                <svg
                  className="service__icon"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.30281 28.9536H8.45394C9.05625 28.9536 9.48648 29.5426 9.48648 30.2495V36.8465C9.48648 37.6711 9.05625 38.2602 8.45394 38.2602H6.30281C5.78654 38.2602 5.27026 37.6711 5.27026 36.8465V30.2495C5.27026 29.5426 5.78654 28.9536 6.30281 28.9536Z"
                    fill="#5F2DED"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.7027 23.7833H15.8987C16.4257 23.7833 16.8649 24.4239 16.8649 25.3207V36.7228C16.8649 37.6196 16.4257 38.2602 15.8987 38.2602H13.7027C13.0879 38.2602 12.6487 37.6196 12.6487 36.7228V25.3207C12.6487 24.4239 13.0879 23.7833 13.7027 23.7833Z"
                    fill="#5F2DED"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M21.0596 19.6471H23.2108C23.727 19.6471 24.2433 20.412 24.2433 21.1769V36.7303C24.2433 37.6227 23.727 38.2602 23.2108 38.2602H21.0596C20.4573 38.2602 20.0271 37.6227 20.0271 36.7303V21.1769C20.0271 20.412 20.4573 19.6471 21.0596 19.6471Z"
                    fill="#5F2DED"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M28.4381 15.5109H30.5892C31.1055 15.5109 31.6217 16.1499 31.6217 17.0445V36.7265C31.6217 37.6212 31.1055 38.2602 30.5892 38.2602H28.4381C27.8357 38.2602 27.4055 37.6212 27.4055 36.7265V17.0445C27.4055 16.1499 27.8357 15.5109 28.4381 15.5109Z"
                    fill="#5F2DED"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M26.9989 7.6293L23.05 18.137L20.3744 15.4678C15.622 19.6266 9.96272 22.5976 3.63238 24.2568C1.36694 24.9297 0.353173 21.6176 2.74495 21.0505C8.47735 19.533 13.5443 16.8156 17.8363 13.1279L15.5453 10.8879L26.9989 7.6293Z"
                    fill="#FFB31F"
                  />
                </svg>
              }
            />
          );
        })}
      </div>
      <p className="text-justify">
        Explore our offerings in IIT, JEE, and NEET preparation, benefit from
        our top-notch online coaching. Seamlessly prepare for exams with our
        comprehensive resources, including formulas and online tutorials. Our
        platform caters to both 10th and 12th board examinations, covering
        various syllabus including CBSE, ICSE, ISC, and UP Board.
      </p>
    </section>
  );
}
