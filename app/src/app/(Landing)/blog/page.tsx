import React from "react";

import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InstagramLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";

// GRAPHQL API - APPLLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import Image from "next/image";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

const query = gql`
  {
    allPosts {
      dateCreated
      dateModified
      description
      id
      publishDate
      published
      title
      subtitle
      slug
      author {
        fullName
      }
      tags {
        name
      }
    }
  }
`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // fetch data

  return {
    title: "Insight | Pramey Shala",
    openGraph: {
      title: "Insight | Pramey Shala",
      description: `Insight of Pramey Shala.`,
      siteName: "Pramey Shala",
    },
  };
}

export default async function AllPosts({ params }: Props) {
  const { data } = await getClient().query({
    query,
    variables: { slug: params.slug },
    context: {
      fetchOptions: {
        next: { revalidate: 30 },
      },
    },
  });

  return (
    <main className="min-h-screen">
      <PageHeader
        title={"Insight"}
        breadcrumbs={[{ title: "Home", href: "/" }, { title: "Insight" }]}
      />
      <div className="bg-white font-family-karla">
        <div className="container mx-auto flex flex-wrap py-6">
          {/* Posts Section */}
          <section className="w-full rounded-none md:w-2/3 flex flex-col items-left px-3">
            {data.allPosts.length > 0 ? (
              data?.allPosts.map((post: any) => {
                const publishDate = new Date(post.publishDate);
                const formattedDate = publishDate.toISOString().split("T")[0];
                return (
                  <div className="flex flex-col shadow my-4" key={post.id}>
                    <a href="#" className="hover:opacity-75">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {/* <img src="" alt={post.title} /> */}
                    </a>
                    <div className="bg-white flex flex-col justify-start p-6">
                      <a
                        href="#"
                        className="text-blue-700 text-sm font-bold uppercase pb-4"
                      >
                        {post.subtitle}
                      </a>
                      <a
                        href={`/blog/${post.slug}`}
                        className="text-3xl font-bold hover:text-gray-700 pb-4"
                      >
                        {post.title}
                      </a>
                      <p className="text-sm pb-3">
                        By{" "}
                        <a
                          href="#"
                          className="font-semibold hover:text-gray-800"
                        >
                          {post.author.fullName}
                        </a>
                        , Published on {formattedDate}
                      </p>
                      <p className="pb-3">{post.excerpt}</p>
                      <a
                        href={`/blog/${post.slug}`}
                        className="uppercase text-gray-800 hover:text-black"
                      >
                        Read More.
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center gap-5 pt-5">
                <Image
                  src="/svg/undraw_search_engines_9o8m.svg"
                  alt="No Post Found"
                  width={280}
                  height={280}
                  priority
                />
                <p className="text-2xl">
                  No Updates Yet !! Stay Connected for updates.
                </p>
              </div>
            )}
          </section>

          {/* #Sidebar Section */}
          <aside className="w-full md:w-1/3 flex flex-col items-center px-3 gap-4">
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
            <div className="w-full bg-white shadow flex flex-col p-6">
              <p className="text-xl font-semibold pb-3">Popular Tags</p>
              <div className="flex flex-wrap">
                {(() => {
                  const uniqueTags = new Set();
                  return data?.allPosts.map((post: any) =>
                    post.tags.map((tag: any) => {
                      if (!uniqueTags.has(tag.name)) {
                        uniqueTags.add(tag.name);
                        return (
                          <a
                            key={tag.name}
                            href="#"
                            className="bg-gray-200 text-gray-700 full px-3 py-1 m-1 hover:bg-blue-500 hover:text-white"
                          >
                            {tag.name}
                          </a>
                        );
                      }
                      return null;
                    })
                  );
                })()}
              </div>
            </div>

            {/* Social Media Handles */}
            <div className="w-full bg-white shadow flex flex-col p-6 gap-3">
              <p className="text-xl font-semibold pb-3">Follow Us 👇🏻 </p>
              <div className="flex items-center justify-start gap-5">
                <a
                  href="https://www.instagram.com/prameyshala/"
                  className="text-red-600 h-8 w-8 animate-bounce duration-&lsqb;690ms&rsqb;"
                  target="_blank"
                >
                  {<InstagramLogoIcon className="h-8 w-8" />}
                </a>
                <a
                  href="#"
                  className="text-blue-400 h-8 w-8 animate-bounce duration-&lsqb;720ms&rsqb;"
                >
                  <TwitterLogoIcon className="h-8 w-8" />
                </a>
                <a
                  href="#"
                  className="text-blue-400 h-8 w-8 animate-bounce duration-&lsqb;760ms&rsqb;"
                >
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
