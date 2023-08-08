import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import VideoPlayer from "@/components/sections/video-player";

type Props = {
  params: {
    id: string;
    page: string;
  };
};

const query = gql`
  query page_lesson($chapter: ID!, $page: Int) {
    lessonByChapterPaginated(chapterId: $chapter, page: $page) {
      count
      numPages
      lesson {
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
      hasNext
      hasPrevious
      startIndex
      endIndex
    }
  }
`;

async function getData({ params }: Props, session: any) {
  try {
    const api_data = await getClient().query({
      query,
      variables: { chapter: parseInt(params.id), page: parseInt(params.page) },
      context: {
        headers: {
          Authorization: `JWT ${session.user?.token}`,
        },
      },
    });

    return api_data.data;
  } catch (error) {
    console.log(error);
    return notFound();
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // fetch data
  const session = await getServerSession(authOptions);
  const { lessonByChapterPaginated } = await getData({ params }, session);
  const lesson = await lessonByChapterPaginated.lesson;
  return {
    title: `${lesson.title} - ${lesson.chapter.name} of ${lesson.chapter.subject.name} | Pramey Shala`,
  };
}

export default async function LessonDetail({ params }: Props) {
  const session = await getServerSession(authOptions);
  const { lessonByChapterPaginated } = await getData({ params }, session);
  const lesson = await lessonByChapterPaginated.lesson;

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