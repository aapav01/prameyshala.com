import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/authOption";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import LessonCard from "@/components/cards/lessson-card-2";

type Props = {
  params: {
    id: string;
    page: string;
  };
};

const query = gql`
  query page_lesson_side($chapter: ID!, $page: Int) {
    lessonByChapterPaginated(chapterId: $chapter, page: $page) {
      lesson {
        id
        chapter {
          id
          name
          lessonSet {
            id
            title
            thumbUrl
            lessonType
            chapter {
              id
            }
          }
        }
      }
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
    console.error(error);
    return null;
  }
}

export default async function ChapterDetail({ params }: Props) {
  const session = await getServerSession(authOptions);
  const { lessonByChapterPaginated } = await getData({ params }, session);
  if (!lessonByChapterPaginated) return null;
  const lesson = await lessonByChapterPaginated.lesson;
  return (
    <section className="max-lg:hidden max-w-sm w-full bg-muted shadow-inner relative">
      <header className="bg-cyan-800 py-9 text-cyan-50 sticky">
        <div className="container">
          <Link
            href={"/learn/chapter/" + lesson.chapter.id}
            className="inline-flex items-center gap-2"
          >
            <Button className="mb-1" size={"icon"} variant={"ghost"}>
              <ArrowLeftIcon className="mr-1 h-6 w-6" />
            </Button>
            <h2 className="text-2xl text-wrap truncate line-clamp-1">{lesson.chapter.name}</h2>
          </Link>
        </div>
      </header>
      <div className="flex flex-col gap-4 px-2 py-8 max-h-[80vh] overflow-y-auto">
        {lesson.chapter.lessonSet.map((lesson: any, index: number) => (
          <LessonCard key={index} lesson={lesson} page={index + 1} />
        )).sort()}
      </div>
    </section>
  );
}
