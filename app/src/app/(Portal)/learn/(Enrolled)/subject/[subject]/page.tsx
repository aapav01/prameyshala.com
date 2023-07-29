import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChapterCard from "@/components/cards/chapter-card";

type Props = {
  params: { subject: string };
};

const query = gql`
  query subject_data($slug: String!) {
    subject(slug: $slug) {
      id
      slug
      name
      description
      standard {
        name
      }
      chapterSet {
        id
        name
        lessonSet {
          id
        }
      }
    }
  }
`;

async function getData({ params }: Props) {
  try {
    const api_data = await getClient().query({
      query,
      variables: { slug: params.subject },
      context: {
        fetchOptions: {
          next: { revalidate: 30 },
        },
      },
    });
    return api_data.data;
  } catch (error) {
    return notFound();
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // fetch data
  const data = await getData({ params });

  return {
    title: data.subject.name + " | Pramey Shala",
  };
}

export default async function SubjectDetail({ params }: Props) {
  const data = await getData({ params });
  return (
    <>
      <header className="bg-purple-700 py-6 h-24 text-indigo-50 shadow-lg shadow-purple-500/50">
        <div className="container">
          <h1 className="text-4xl font-bold">
            {data.subject.name}{" "}
            <span className="text-xl">{data.subject.standard.name}</span>
          </h1>
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 px-4 py-6 gap-4">
        {data.subject.chapterSet.map((chapter: any, index: number) => (
          <ChapterCard chapter={chapter} key={index} />
        ))}
      </div>
    </>
  );
}
