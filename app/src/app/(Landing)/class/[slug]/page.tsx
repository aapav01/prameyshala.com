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
import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
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
      slug
      latestPrice
      beforePrice
      publishAt
      createdAt
      updatedAt
      enrollmentSet {
        id
      }
      subjectSet {
        id
        name
        chapterSet {
          id
          name
          lessonSet {
            title
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
      variables: { slug: params.slug },
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // fetch data
  const data = await getData({ params });

  return {
    title: data.standard.name + " | Pramey Shala",
  };
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
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-2 my-4">
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
      <section className="py-12 lg:py-24">
        <div className="container w-full flex flex-col-reverse lg:flex-row gap-3">
          <Tabs defaultValue="description" className="w-full lg:w-8/12">
            <TabsList className="w-full">
              <TabsTrigger
                className="py-4 w-2/4 md:w-1/4 text-lg gap-1"
                value="description"
              >
                <FileIcon className="text-primary h-5 w-5 mb-1" />
                Description
              </TabsTrigger>
              <TabsTrigger
                className="py-4 w-2/4 md:w-1/4 text-lg gap-1"
                value="curriculum"
              >
                <ActivityLogIcon className="text-primary h-4 w-4 mb-1" />
                Curriculum
              </TabsTrigger>
              <TabsTrigger
                className="py-4 w-2/4 md:w-1/4 text-lg gap-1"
                value="instructor"
              >
                <PersonIcon className="text-primary h-5 w-5 mb-1" />
                Instructor
              </TabsTrigger>
              <TabsTrigger
                className="py-4 w-2/4 md:w-1/4 text-lg gap-1"
                value="reviews"
              >
                <StarFilledIcon className="text-primary h-5 w-5 mb-1" />
                Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent className="p-4" value="description">
              <div className="prose prose-lg max-w-full">
                <MDXRemote source={data.standard.description} />
              </div>
            </TabsContent>
            <TabsContent className="p-4" value="curriculum">
              {data.standard.subjectSet.map((subject: any, index_s: number) => (
                <React.Fragment key={index_s}>
                  <h3 className="font-sans font-semibold py-4 text-xl">{subject.name}</h3>
                  <Accordion
                    className="flex flex-col gap-4 py-2"
                    defaultValue="item-1"
                    type="single"
                    collapsible
                  >
                    {subject.chapterSet.map((chapter: any, index: number) => (
                      <AccordionItem
                        key={index}
                        className="shadow rounded"
                        value={"item-"+ index_s + index}
                      >
                        <AccordionTrigger className="bg-blue-100 text-blue-950 rounded text-xl font-semibold px-4">
                          {chapter.name}
                        </AccordionTrigger>
                        <AccordionContent className="p-2 text-lg">
                          <ul className="list-decimal">
                            {chapter.lessonSet.map((lesson:any, index: number) => (<li key={index}>{lesson.name}</li>))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </React.Fragment>
              ))}
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
            <div className="bg-white shadow lg:-mt-80 p-4 md:py-10 lg:px-6 rounded-lg flex max-sm:flex-col lg:flex-col">
              <div className="mb-6 relative h-fit">
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                  <button className="shadow shadow-pink-500/50 bg-pink-600 rounded-full text-white p-2 md:p-6 animate-pulse">
                    <PlayIcon className="h-10 w-10" />
                  </button>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    data.standard.image
                      ? data.standard.image
                      : `/class/${data.standard.slug}/opengraph-image`
                  }
                  alt="placeholder"
                  className="rounded"
                />
              </div>
              <div className="w-1/2 max-sm:w-full lg:w-full px-3">
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
        </div>
      </section>
    </main>
  );
}
