import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EnrollButton from "@/components/sections/enroll-button";
import PageHeader from "@/components/page-header";
import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from 'next'
import {
  StarFilledIcon,
  FileTextIcon,
  FileIcon,
  ActivityLogIcon,
  PersonIcon,
  PlayIcon,
  ChatBubbleIcon,
  ClockIcon,
} from "@radix-ui/react-icons";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";

type Props = {
  params: { slug: string };
};

const query = gql`
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
      enrollmentSet {
        id
      }
      subjectSet {
        name
      }
    }
  }
`;

async function getData({ params }: Props) {
  try {
    const api_data = await getClient().query({
      query,
      variables: { slug: params.slug },
    });
    return api_data.data;
  } catch (error) {
    return notFound();
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // fetch data
  const data = await getData({ params });

  return {
    title: data.standard.name + " | Pramey Shala",
  }
}

export default async function ClassDetail({ params }: Props) {
  const data = await getData({ params });

  const discount: any =
    100 - (data.standard.latestPrice / data.standard.beforePrice) * 100;

  function getRating(rating: number) {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(
          <StarFilledIcon key={i} className="text-yellow-500 h-5 w-5" />
        );
      } else {
        stars.push(
          <StarFilledIcon key={i} className=" text-gray-600/50 h-5 w-5" />
        );
      }
    }
    return stars;
  }

  function readableDate(date: string) {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <main className="min-h-screen">
      <PageHeader
        title={data?.standard.name}
        variant={2}
        breadcrumbs={[
          { title: "Home", href: "/" },
          { title: "Class", href: "/" },
          { title: data?.standard.name },
        ]}
      >
        <div className="flex gap-2 my-4">
          {data.standard.subjectSet.map((subject: any, index: number) => (
            <div
              className="text-purple-800 bg-purple-500/20 px-3 py-1 rounded-lg font-semibold"
              key={index}
            >
              {subject.name}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-gray-800 flex flex-row gap-1">
            <FileTextIcon className=" text-primary h-5 w-5" />
            <span className="font-semibold font-sans">100+ Lessons</span>
          </div>
          <div className="flex flex-row justify-center items-center">
            {getRating(4)}
            <span className="text-gray-600 font-bold m-1">(4.4)</span>
          </div>
          <div className="text-gray-800 text-sm">
            Last Updated:{" "}
            <span className="font-thin text-gray-600">
              {readableDate(data.standard.updatedAt)}
            </span>
          </div>
        </div>
      </PageHeader>
      <section className="py-24">
        <div className="container w-full flex gap-3">
          <Tabs defaultValue="description" className="w-full lg:w-8/12">
            <TabsList className="py-8 w-full">
              <TabsTrigger
                className="py-4 w-1/4 text-lg gap-1"
                value="description"
              >
                <FileIcon className="text-primary h-5 w-5 mb-1" />
                Description
              </TabsTrigger>
              <TabsTrigger
                className="py-4 w-1/4 text-lg gap-1"
                value="curriculum"
              >
                <ActivityLogIcon className="text-primary h-4 w-4 mb-1" />
                Curriculum
              </TabsTrigger>
              <TabsTrigger
                className="py-4 w-1/4 text-lg gap-1"
                value="instructor"
              >
                <PersonIcon className="text-primary h-5 w-5 mb-1" />
                Instructor
              </TabsTrigger>
              <TabsTrigger className="py-4 w-1/4 text-lg gap-1" value="reviews">
                <StarFilledIcon className="text-primary h-5 w-5 mb-1" />
                Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent className="p-4" value="description">
              <div className="prose prose-lg max-w-full">
                {data.standard.description}
              </div>
            </TabsContent>
            <TabsContent className="p-4" value="curriculum">
              <Accordion
                className="flex flex-col gap-4"
                defaultValue="item-1"
                type="single"
                collapsible
              >
                <AccordionItem className="shadow rounded" value="item-1">
                  <AccordionTrigger className="bg-blue-100 text-blue-950 rounded text-xl font-semibold px-4">
                    Lesson #01
                  </AccordionTrigger>
                  <AccordionContent className="p-2 text-lg">
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem className="shadow rounded" value="item-2">
                  <AccordionTrigger className="bg-blue-100 text-blue-950 rounded text-xl font-semibold px-4">
                    Lesson #02
                  </AccordionTrigger>
                  <AccordionContent className="p-2 text-lg">
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem className="shadow rounded" value="item-3">
                  <AccordionTrigger className="bg-blue-100 text-blue-950 rounded text-xl font-semibold px-4">
                    Lesson #03
                  </AccordionTrigger>
                  <AccordionContent className="p-2 text-lg">
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            <TabsContent
              className="prose prose-lg max-w-full"
              value="instructor"
            >
              {/* <div className="p-4">{data.standard.description}</div> */}
            </TabsContent>
            <TabsContent value="reviews">
              <div className="p-4 flex">
                <div className="bg-white shadow-lg p-12 rounded-xl flex flex-col w-fit">
                  <span className="text-6xl p-2 text-center">4.4</span>
                  <div className=" inline-flex">{getRating(4.4)}</div>
                  <span className="text-center mt-2 text-gray-500 font-bold">
                    Rating
                  </span>
                </div>
                <div className="flex flex-col w-full p-10 gap-2">
                  <div className="inline-flex gap-2">
                    <span className="text-xl">5</span>
                    <StarFilledIcon className="text-yellow-500 h-5 w-5" />
                    <div className="bg-pink-500 flex w-full h-fit p-2 rounded-xl" />
                    <span className="text-lg">132</span>
                  </div>
                  <div className="inline-flex gap-2">
                    <span className="text-xl">4</span>
                    <StarFilledIcon className="text-yellow-500 h-5 w-5" />
                    <div className="bg-pink-500 flex w-8/12 h-fit p-2 rounded-xl" />
                    <span className="text-lg ml-auto">30</span>
                  </div>
                  <div className="inline-flex gap-2">
                    <span className="text-xl">3</span>
                    <StarFilledIcon className="text-yellow-500 h-5 w-5" />
                    <div className="bg-pink-500 flex w-6/12 h-fit p-2 rounded-xl" />
                    <span className="text-lg ml-auto">0</span>
                  </div>
                  <div className="inline-flex gap-2">
                    <span className="text-xl">2</span>
                    <StarFilledIcon className="text-yellow-500 h-5 w-5" />
                    <div className="bg-pink-500 flex w-4/12 h-fit p-2 rounded-xl" />
                    <span className="text-lg ml-auto">0</span>
                  </div>
                  <div className="inline-flex gap-2">
                    <span className="text-xl">1</span>
                    <StarFilledIcon className="text-yellow-500 h-5 w-5" />
                    <div className="bg-pink-500 flex w-2/12 h-fit p-2 rounded-xl" />
                    <span className="text-lg ml-auto">0</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="w-full lg:w-4/12 relative">
            <div className="bg-white shadow -mt-80 py-10 px-6 rounded-lg">
              <div className="mb-6 relative h-fit">
                <div className="absolute top-[34%] left-[39%]">
                  <button className="shadow shadow-pink-500/50 bg-pink-600 rounded-full text-white p-6 animate-pulse">
                    <PlayIcon className="h-10 w-10" />
                  </button>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.standard.image ? data.standard.image : `/class/${data.standard.slug}/opengraph-image`}
                  alt="placeholder"
                  className="rounded"
                />
              </div>
              <div className="flex justify-between mb-8">
                <div className="text-2xl font-medium font-sans text-gray-500 px-2">
                  <span className="text-primary">
                    ₹ {data.standard.latestPrice}
                  </span>
                  {data.standard.latestPrice < data.standard.beforePrice && (
                    <>
                      <span className=" font-thin text-lg "> / </span>
                      <span className="font-normal text-lg line-through">
                        ₹ {data.standard.beforePrice}
                      </span>
                    </>
                  )}
                </div>
                {data.standard.latestPrice < data.standard.beforePrice && (
                  <div className="text-pink-500 font-bold py-1 px-4 bg-pink-100 text-center rounded uppercase">
                    {parseInt(discount)}% off
                  </div>
                )}
              </div>
              <div className="mt-4">
                <a className="text-lg font-bold">Details</a>
                <div className="flex justify-between border-b-2 pb-2 border-gray-200 mt-4 p-2">
                  <span className="font-medium inline-flex gap-2">
                    <ChatBubbleIcon className="text-primary h-5 w-5" />
                    Language
                  </span>
                  <span className=" font-thin">English, Hindi</span>
                </div>
                <div className="flex justify-between border-b-2 pb-2 border-gray-200 mt-4 p-2">
                  <span className="font-medium inline-flex gap-2">
                    <FileTextIcon className="text-primary h-5 w-5" />
                    Lessons
                  </span>
                  <span className=" font-semibold">100+</span>
                </div>
                <div className="flex justify-between border-b-2 pb-2 border-gray-200 mt-4 p-2">
                  <span className="font-medium inline-flex gap-2">
                    <ClockIcon className="text-primary h-5 w-5" />
                    Duration
                  </span>
                  <span className=" font-normal">100 Hours</span>
                </div>
              </div>
              <div className="mt-8">
                <EnrollButton standard={data.standard} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
