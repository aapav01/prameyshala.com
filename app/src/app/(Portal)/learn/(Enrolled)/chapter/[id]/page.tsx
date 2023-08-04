import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import LessonCard from "@/components/cards/lessson-card";

const query = gql`
  query chatpter_detail($id: ID!) {
    chapter(id: $id) {
      id
      name
      subject {
        id
        name
        standard {
          id
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
  const session = await getServerSession(authOptions);
  const { chapter } = await getData({ params }, session);

  return {
    title: `${chapter.name} - ${chapter.subject.name} of ${chapter.subject.standard.name} | Pramey Shala`,
  };
}

async function getData({ params }: Props, session: any) {
  try {
    const api_data = await getClient().query({
      query,
      variables: { id: parseInt(params.id) },
      context: {
        headers: {
          Authorization: `JWT ${session.user.token}`,
        }
      }
    });
    return api_data.data;
  } catch (error) {
    return notFound();
  }
}

export default async function ChapterDetail({ params }: Props) {
  const session = await getServerSession(authOptions);
  const { chapter } = await getData({ params }, session);
  return (
    <>
      <header className="bg-cyan-700 py-6 text-indigo-50 shadow-lg shadow-cyan-500/50">
        <div className="container">
          <h1 className="text-4xl font-bold">{chapter.name}</h1>
          <span className="py-2">
            {chapter.subject.name} of {chapter.subject.standard.name}
          </span>
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
