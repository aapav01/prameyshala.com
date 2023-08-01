import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";

type Props = {
  params: { id: string };
};

const query = gql`
  query lesson_detial($id: Int!) {
    lesson(id: $id) {
      lessonType
      title
      id
      position
      description
      teacher {
        fullName
      }
      platform
      platformVideoId
      url
      updatedAt
      thumbUrl
      chapter {
        id
        name
        subject {
          id
          name
          standard {
            name
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
      variables: { id: parseInt(params.id) },
    });
    return api_data.data;
  } catch (error) {
    return notFound();
  }
}

export default async function LessonDetail({params}: Props) {
  const { lesson } = await getData({ params });

  return (
    <React.Fragment>
      <header className="bg-teal-700 py-6 text-indigo-50 shadow-lg shadow-teal-500/50">
        <div className="container">
          <h1 className="text-4xl font-bold">{lesson.title}</h1>
          <span className="py-2">{lesson.chapter.name} of {lesson.chapter.subject.name} ({lesson.chapter.subject.standard.name})</span>
        </div>
      </header>
    </React.Fragment>
  );
}
