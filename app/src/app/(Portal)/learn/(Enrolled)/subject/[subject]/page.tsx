import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChapterCard2 from "@/components/cards/chapter-card2";

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
        id
        name
      }
      chapterSet {
        id
        name
        image
        order
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
  const sortedChapters = data?.subject?.chapterSet
    .slice()
    .sort(
      (currentChapter: any, nextChapter: any) =>
        currentChapter?.order - nextChapter?.order
    );
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-4 py-6 gap-4">
        {sortedChapters?.map((chapter: any, index: number) => (
          <ChapterCard2 chapter={chapter} key={index} />
        ))}
      </div>
    </>
  );
}
