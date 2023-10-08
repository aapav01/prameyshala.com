import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import VideoPlayer from "@/components/sections/video-player";
import Quiz from "@/components/sections/quiz";
// import Assignment from "@/components/sections/assignment";
const Assignment = dynamic(() => import("@/components/sections/pdf-viewer"), {
  ssr: false
});

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
        quiz {
          id
          name
          type
          questionSet {
            id
            questionText
            choiceSet {
              id
              choiceText
            }
          }
				}
        assignment {
          id
          title
          description
          timeRequired
          assigmentFile
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

function LessonType({ lesson }: { lesson: any }) {
  switch (lesson.lessonType) {
    case "VIDEO":
      return <VideoPlayer lesson={lesson} />;
    case "QUIZ":
      return <Quiz lesson={lesson} />;
    case "ASSIGNMENT":
      return <Assignment file={lesson.assignment.assigmentFile} type={lesson.lessonType} lessonId={lesson.id}/>;
    default:
      return <div>Unknown Lesson Type</div>;
  }
}

export default async function LessonDetail({ params }: Props) {
  const session = await getServerSession(authOptions);
  // TODO: Create lessonByChapterPaginated type
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
      <LessonType lesson={lesson} />
      <div className="container py-6">
        <div className="prose prose-lg max-w-full">
          <MDXRemote source={lesson.description} />
        </div>
      </div>
    </React.Fragment>
  );
}
