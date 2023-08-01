import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import LessonCard from "@/components/cards/lessson-card";

const query = gql`
  query chatpter_detail($id: Int!) {
    chapter(id: $id) {
      name
      subject {
        name
        standard {
          name
        }
      }
      lessonSet {
        id
        title
        lessonType
      }
    }
  }
`;

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // fetch data
  const { chapter } = await getData({ params });

  return {
    title:  `${chapter.name} - ${chapter.subject.name} of ${chapter.subject.standard.name} | Pramey Shala`,
  };
}

async function getData({ params }: Props) {
  try {
    const api_data = await getClient().query({
      query,
      variables: { id: parseInt(params.id) },
    });
    return api_data.data;
  } catch (error) {
    return notFound();
  }
}

export default async function ChapterDetail({ params }: Props) {
  const { chapter } = await getData({ params });
  return (
    <>
      <header className="bg-cyan-700 py-6 text-indigo-50 shadow-lg shadow-cyan-500/50">
        <div className="container">
          <h1 className="text-4xl font-bold">{chapter.name}</h1>
          <span className="py-2">{chapter.subject.name} of {chapter.subject.standard.name}</span>
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 px-4 py-6 gap-4">
        {chapter.lessonSet.map((lesson: any) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </>
  );
}
