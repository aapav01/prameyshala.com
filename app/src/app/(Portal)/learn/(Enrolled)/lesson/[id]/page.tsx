import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import VideoPlayer from "@/components/sections/video-player";

type Props = {
  params: { id: string };
};

const query = gql`
  query lesson_detial($id: ID!) {
    lesson(id: $id) {
      lessonType
      title
      id
      position
      description
      teacher {
        id
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
            id
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // fetch data
  const { lesson } = await getData({ params });
  return {
    title: `${lesson.title} - ${lesson.chapter.name} of ${lesson.chapter.subject.name} | Pramey Shala`,
  };
}

export default async function LessonDetail({ params }: Props) {
  const { lesson } = await getData({ params });

  return (
    <React.Fragment>
      <header className="bg-teal-700 py-6 text-indigo-50 shadow-lg shadow-teal-500/50">
        <div className="container">
          <h1 className="text-4xl font-bold">{lesson.title}</h1>
          <span className="py-2">
            {lesson.chapter.name} of {lesson.chapter.subject.name} (
            {lesson.chapter.subject.standard.name})
          </span>
        </div>
      </header>
      <VideoPlayer lesson={lesson} />
      <div className="container py-6">
        <div className="prose prose-lg max-w-full">
          <MDXRemote source={lesson.description} />
        </div>
      </div>
    </React.Fragment>
  );
}
