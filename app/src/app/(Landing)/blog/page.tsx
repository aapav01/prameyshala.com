import React from "react";

import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InstagramLogoIcon,
  LinkedInLogoIcon,
  MagnifyingGlassIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";

// GRAPHQL API - APPLOLO
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
          <section className="w-full rounded-none md:w-2/3 flex flex-col items-center px-3">
            {data.allPosts.length > 0 ? (
              data?.allPosts.map((post: any) => {
                const publishDate = new Date(post.publishDate);
                const formattedDate = publishDate.toISOString().split("T")[0];
                return (
                  <div className="flex flex-col shadow my-4" key={post.id}>
                    <a href="#" className="hover:opacity-75">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="https://shorturl.at/TU015" alt={post.title} />
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
                          {post.author.user.fullName}
                        </a>
                        , Published on {formattedDate}
                      </p>
                      <p className="pb-6">{post.excerpt}</p>
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
                <p className="text-2xl">No Updates Yet !! Stay Connected for updates.</p>
              </div>
            )}
          </section>

          {/* #Sidebar Section */}
          <aside className="w-full md:w-1/3 flex flex-col items-center px-3 gap-4">
            <div className="w-full border flex flex-col p-6">
              <div className="relative flex gap-3">
                <Input type="text" placeholder="Search" />
                <Button size={"icon"} variant={"secondary"}>
                  <MagnifyingGlassIcon />
                </Button>
              </div>
            </div>

            {/* Popular Tags Section */}
            <div className="w-full border flex flex-col p-6">
              <p className="font-semibold pb-3">Popular Tags</p>
            </div>

            {/* Social Media Handles */}
            <div className="w-full border flex flex-col p-6 gap-3">
              <div className="flex items-center justify-center gap-5">
                <InstagramLogoIcon className="h-8 w-8 animate-bounce duration-[690ms]" />
                <TwitterLogoIcon className="h-8 w-8 animate-bounce duration-[720ms]" />
                <LinkedInLogoIcon className="h-8 w-8 animate-bounce duration-[760ms]" />
              </div>
              <p className="text-center">Follow Us ☝🏼</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
