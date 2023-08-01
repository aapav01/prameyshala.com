import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import ChapterCard from "@/components/cards/chapter-card";

const query = gql`
  query chatpter_detail_side($id: Int!) {
    chapter(id: $id) {
      name
      subject {
        name
        slug
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
  }
`;

type Props = {
  params: { id: string };
};

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
    <section className="max-lg:hidden max-w-sm w-full max-h-screen bg-muted overflow-y-auto shadow-inner relative">
      <header className="bg-purple-800 py-9 text-purple-50">
        <div className="container">
          <Link href={"/learn/subject/" + chapter.subject.slug} className="inline-flex items-center gap-2">
            <Button className="mb-1" size={"icon"} variant={"ghost"}>
              <ArrowLeftIcon className="mr-1 h-6 w-6" />
            </Button>
            <h2 className="text-2xl">{chapter.subject.name}</h2>
          </Link>
        </div>
      </header>
      <div className="flex flex-col gap-4 px-2 py-8">
        {chapter.subject.chapterSet.map((chapter: any, index: number) => (
          <ChapterCard key={index} chapter={chapter} />
        ))}
      </div>
    </section>
  );
}