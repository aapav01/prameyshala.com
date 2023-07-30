import React from "react";
import { notFound } from "next/navigation";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import SubjectCard from "@/components/cards/subject-card";
import { BackButton } from "@/components/web3/back";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

type Props = {
  params: { subject: string };
};

const query_class = gql`
  query standard($slug: String!) {
    standard(slug: $slug) {
      id
      name
      description
      image
      latestPrice
      beforePrice
      publishAt
      createdAt
      updatedAt
      subjectSet {
        name
        description
        slug
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

const query = gql`
  query subject_data($slug: String!) {
    subject(slug: $slug) {
      id
      slug
      name
      description
      standard {
        name
        slug
        subjectSet {
          name
          description
          slug
          chapterSet {
            id
            name
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

let class_data: any = null;

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
    return notFound();
  }
}

export default async function SideSubjects({ params }: Props) {
  const data = await getData({ params });
  return (
    <section className="max-lg:hidden max-w-sm w-full max-h-screen bg-muted overflow-y-auto shadow-inner relative">
      <header className="bg-indigo-800 py-6 h-24 text-indigo-50">
        <div className="container">
          <Link href={"/learn/" + data.subject.standard.slug} className="inline-flex items-center gap-2">
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