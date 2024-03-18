import React from "react";
import ClassCard from "@/components/cards/class-card";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";

type Props = {};

const query = gql`
  query classes {
    classes {
      id
      name
      image
      slug
      latestPrice
      beforePrice
      publishAt
      createdAt
      updatedAt
      subjectSet {
        id
        name
      }
    }
  }
`;

export default async function AvailableCourses({ }: Props) {
  const { data } = await getClient().query({ query });

  return (
    <section className="container">
      <div className="flex lg:items-center gap-3 max-lg:flex-col">
        <div className="md:mb-7 w-fit">
          <h2 className="text-4xl font-bold xl:text-5xl lg:leading-10 leading-[50px] font-['hind',_sans-serif] mt-5 mb-5">
            Available <span className="rock-underline">Courses</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 py-4 gap-4">
            {data.classes.map((item: any, index: number) => (
              <ClassCard key={index} standard={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
