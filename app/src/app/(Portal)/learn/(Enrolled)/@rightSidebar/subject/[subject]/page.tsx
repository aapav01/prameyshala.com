import React from "react";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import SubjectCard from "@/components/cards/subject-card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

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
        slug
        subjectSet {
          id
          name
          image
          description
          slug
          chapterSet {
            id
            name
            image
            lessonSet {
              id
            }
          }
        }
      }
      chapterSet {
        id
        name
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
    console.error(error);
    return null;
  }
}

export default async function SideSubjects({ params }: Props) {
  const data = await getData({ params });
  if (!data) return null;
  return (
    <section className="max-lg:hidden max-w-sm w-full max-h-screen bg-muted overflow-y-auto shadow-inner relative">
      <header className="bg-indigo-800 py-6 h-24 text-indigo-50">
        <div className="container">
          <Link
            href={"/learn/" + data.subject.standard.slug}
            className="inline-flex items-center gap-2"
          >
            <Button className="mb-1" size={"icon"} variant={"ghost"}>
              <ArrowLeftIcon className="mr-1 h-6 w-6" />
            </Button>
            <h2 className="text-2xl">{data.subject.standard.name}</h2>
          </Link>
        </div>
      </header>
      <div className="flex flex-col gap-4 px-2 py-8">
        {data.subject.standard.subjectSet.map((subject: any, index: number) => (
          <SubjectCard key={index} subject={subject} size="sm" />
        ))}
      </div>
    </section>
  );
}
