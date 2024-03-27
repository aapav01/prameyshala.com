import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import SubjectCard from "@/components/cards/subject-card";
import { BackButton } from "@/components/web3/back";

type Props = {
  params: { class: string };
};

const query = gql`
  query standard($slug: String!) {
    standard(slug: $slug) {
      id
      name
      description
      image
      latestPrice
      beforePrice
      publishAt
      createdAt
      updatedAt
      subjectSet {
        id
        name
        image
        description
        slug
        chapterSet {
          id
          name
          lessonSet {
            id
          }
        }
      }
    }
  }
`;

async function getData({ params }: Props) {
  try {
    const api_data = await getClient().query({
      query,
      variables: { slug: params.class },
      context: {
        fetchOptions: {
          next: { revalidate: 30 },
        },
      },
    });
    return api_data.data;
  } catch (error) {
    console.error(error);
    return notFound();
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // fetch data
  const data = await getData({ params });

  return {
    title: data.standard.name + " | Pramey Shala",
  };
}

export default async function PortalClass({ params }: Props) {
  const data = await getData({ params });
  return (
    <main className="min-h-[70vh]">
      <header className="bg-indigo-800 py-12 text-indigo-50">
        <div className="container">
          <BackButton className="mb-4 2xl:-ml-10" size={'sm'} variant={'ghost'} />
          <h1 className="text-4xl font-bold">{data?.standard.name}</h1>
          <div className="flex gap-2 my-4 overflow-x-auto">
            {data.standard.subjectSet.map((subject: any, index: number) => (
              <div
                className="text-purple-800 bg-purple-100 px-3 py-1 rounded-lg font-semibold"
                key={index}
              >
                {subject.name}
              </div>
            ))}
          </div>
        </div>
      </header>
      <section className="container py-8">
        <h2 className="text-3xl font-semibold py-3">Subjects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 py-4 gap-4">
          {data.standard.subjectSet.map((subject: any, index: number) => (
            <SubjectCard key={index} subject={subject} />
          ))}
        </div>
      </section>
    </main>
  );
}
