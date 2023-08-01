import React from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
        id
        name
      }
    }
  }
`;

const query_enrollment = gql`
  query my_ernrolments {
    myEnrollments {
      standard {
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
  }
`;

async function getAllClasses() {
  try {
    const api_data = await getClient().query({ query: query_classes });
    return api_data.data;
  } catch (error) {
    console.error(error);
  }
}

async function getMyEnrollments(session: { user: { token: string } }) {
  const { data, errors } = await getClient().query({
    query: query_enrollment,
    context: {
      fetchOptions: {
        cache: "no-store",
      },
      headers: {
        Authorization: `JWT ${session?.user?.token}`,
      },
    },
  });
  return data;
}

export const metadata: Metadata = {
  title: "My Learning Portal | Pramey Shala",
};

export default async function LearnPage({}: Props) {
  const session = await getServerSession(authOptions);
  const classes = await getAllClasses();
  // @ts-expect-error
  const enrollments = await getMyEnrollments(session);
  return (
    <main className="min-h-screen">
      <header className="py-12 bg-indigo-50 relative">
        <div className="container text-foreground">
          <span className="text-xl">Welcome, </span>
          {/* @ts-ignore */}
          <h1 className="text-4xl font-bold">{session?.user?.fullName}</h1>
          <p className="text-sm font-thin">{session?.user?.email}</p>
        </div>
      </header>
      <section className="container py-12">
        <div className="py-6">
          <h2 className="text-2xl font-medium">
            My <span className="rock2-underline">Subscriptions</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 py-4 gap-4">
            {enrollments.myEnrollments.map((item: any, index: number) => (
              <ClassCard key={index} standard={item.standard} enroll />
            ))}
          </div>
        </div>
        <div className="py-6">
          <h2 className="text-2xl font-medium">
            Available <span className="rock2-underline">Courses</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 py-4 gap-4">
            {classes.classes.map((item: any, index: number) => (
              <ClassCard key={index} standard={item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
