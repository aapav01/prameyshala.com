import React from "react";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import LessonCard from "@/components/cards/lessson-card";

type Props = {
  params: { id: string };
};

const query = gql`
  query lesson_detial($id: ID!) {
    lesson(id: $id) {
      chapter {
        id
        name
        lessonSet {
          id
          title
          lessonType
        }
      }
    }
  }
`;

async function getData({ params }: Props, session: any) {
  try {
    const api_data = await getClient().query({
      query,
      variables: { id: parseInt(params.id) },
      context: {
        headers: {
          Authorization: `JWT ${session.user?.token}`,
        },
      }
    });
    return api_data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ChapterDetail({ params }: Props) {
  const session = await getServerSession(authOptions);
  const { lesson } = await getData({ params }, session);
  if (!lesson) return null;
  return (
    <section className="max-lg:hidden max-w-sm w-full max-h-screen bg-muted overflow-y-auto shadow-inner relative">
      <header className="bg-cyan-800 py-9 text-cyan-50">
        <div className="container">
          <Link
            href={"/learn/chapter/" + lesson.chapter.id}
            className="inline-flex items-center gap-2"
          >
            <Button className="mb-1" size={"icon"} variant={"ghost"}>
              <ArrowLeftIcon className="mr-1 h-6 w-6" />
            </Button>
            <h2 className="text-2xl">{lesson.chapter.name}</h2>
          </Link>
        </div>
      </header>
      <div className="flex flex-col gap-4 px-2 py-8">
        {lesson.chapter.lessonSet.map((lesson: any, index: number) => (
          <LessonCard key={index} lesson={lesson} />
        ))}
      </div>
    </section>
  );
}
