import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";

import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InstagramLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";

type Props = {
  params: { slug: string };
};

const query = gql`
  query GetPostBySlug($slug: String!) {
    postBySlug(slug: $slug) {
      title
      subtitle
      slug
      publishDate
      dateCreated
      dateModified
      description
      id
      metaDescription
      published
      author {
        fullName
      }
      tags {
        name
      }
    }
  }
`;

export default async function postBySlug({ params }: Props) {
  const { data } = await getClient().query({
    query,
    variables: { slug: params.slug },
  });
  const publishDate = new Date(data.postBySlug.publishDate);
  const formattedDate = publishDate.toISOString().split("T")[0];

  return (
    <main className="min-h-screen">
      <PageHeader
        title={data.postBySlug.title}
        breadcrumbs={[
          { title: "Home", href: "/" },
          { title: data.postBySlug.title },
        ]}
      >
        <p className="text-blue-700 text-sm font-semibold uppercase pb-4">
          {data.postBySlug.subtitle}
        </p>
      </PageHeader>
      <div className="bg-white font-family-sans">
        <div className="container mx-auto flex flex-wrap py-6">
          {/* Posts Section */}
          <section className="w-full md:w-2/3 flex flex-col px-3">
            <article className="flex flex-col my-4">
              <a href="#" className="hover:opacity-75">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {/* <img src="https://shorturl.at/TU015" alt={data.postBySlug.slug} /> */}
              </a>
              <MDXRemote source={data.postBySlug.description}></MDXRemote>
              <p className="text-sm pb-8">
                By{" "}
                <a href="#" className="font-semibold hover:text-gray-800">
                  {data.postBySlug.author.fullName}
                </a>
                , Published on {formattedDate}
              </p>
            </article>

            {/* <div className="w-full flex pt-6">
              <a href="" className="w-1/2 bg-white shadow hover:shadow-md text-left p-6">
                <p className="text-lg text-blue-800 font-bold flex items-center"><i className="fas fa-arrow-left pr-1"></i>Previous</p>
                <p className="pt-2"></p>
              </a>
              <a href="" className="w-1/2 bg-white shadow hover:shadow-md text-right p-6">
                <p className="text-lg text-blue-800 font-bold flex items-center justify-end">Next <i className="fas fa-arrow-right pl-1"></i></p>
                <p className="pt-2"></p>
              </a>
            </div> */}
          </section>

          {/* #Sidebar Section */}
          <aside className="w-full md:w-1/3 flex flex-col items-center px-3">
            <div className="w-full bg-white shadow flex flex-col my-4 p-6">
              <p className="text-xl font-semibold pb-5">Search Here</p>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search posts"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <Button variant={"secondary"} className="text-lg mt-5 py-3">
                  Search
                </Button>
              </div>
            </div>

            {/* Popular Tags Section */}
            <div className="w-full bg-white shadow flex flex-col my-4 p-6">
              <p className="text-xl font-semibold pb-3">Popular Tags</p>
              <div className="flex flex-wrap">
                {data?.postBySlug.tags.map((tag: any) => (
                  <a
                    key={tag.name}
                    href="#"
                    className="bg-gray-200 text-gray-700 full px-3 py-1 m-1 hover:bg-blue-500 hover:text-white"
                  >
                    {tag.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="w-full bg-white shadow flex flex-col my-4 p-6">
              <p className="text-xl font-semibold pb-3">Share it On</p>
              <div className="flex">
                <a href="#" className="text-blue-700 hover:underline pr-2">
                  {<InstagramLogoIcon className="h-8 w-8" />}
                </a>
                <a href="#" className="text-blue-700 hover:underline pr-2">
                  <TwitterLogoIcon className="h-8 w-8" />
                </a>
                <a href="#" className="text-blue-700 hover:underline pr-2">
                  <LinkedInLogoIcon className="h-8 w-8" />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
