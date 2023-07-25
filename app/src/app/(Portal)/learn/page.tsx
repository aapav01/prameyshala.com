import React from "react";
import { Metadata } from 'next';
import AuthHeader from "@/components/sections/auth-header";
import ClassCard from "@/components/cards/class-card";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";

type Props = {};

const query_classes = gql`
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
        name
      }
    }
  }
`;

async function getAllClasses() {
  try {
    const api_data = await getClient().query({query:query_classes});
    return api_data.data;
  } catch (error) {
    console.error(error);
  }
}

export const metadata: Metadata = {
  title: 'My Learning Portal | Pramey Shala',
}

export default async function LearnPage({}: Props) {
  const classes = await getAllClasses();
  return (
    <main className="min-h-screen">
      <AuthHeader />
      <section className="container py-12">
        <div className="py-6">
          <h2 className="text-2xl font-medium">My <span className="rock2-underline">Subscriptions</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-4 py-4">
            {/* TODO: will show enrollment classes here */}
          </div>
        </div>
        <div className="py-6">
          <h2 className="text-2xl font-medium">Available <span className="rock2-underline">Courses</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-4 py-4 gap-4">
            {classes.classes.map((item: any, index:number) => (<ClassCard key={index} standard={item} />))}
          </div>
        </div>
      </section>
    </main>
  );
}
