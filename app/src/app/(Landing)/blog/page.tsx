import React from 'react';

import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InstagramLogoIcon, LinkedInLogoIcon, TwitterLogoIcon} from '@radix-ui/react-icons';

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";


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
      user {
        fullName
      }
    }
    tags {
      name
    }
  }
}`;


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
        title={"Blog"}
        breadcrumbs={[
          { title: "Home", href: "/" },
          { title: "Blogs" },
        ]}
      />
      <div className="bg-white font-family-karla">
        <div className="container mx-auto flex flex-wrap py-6">

          {/* Posts Section */}
          <section className="w-full rounded-none md:w-2/3 flex flex-col items-center px-3">
            {data?.allPosts.map((post: any) => {
              const publishDate = new Date(post.publishDate);
              const formattedDate = publishDate.toISOString().split('T')[0];
              return (
                <div className="flex flex-col shadow my-4" key={post.id}>
                  <a href="#" className="hover:opacity-75">
                    <img src="https://shorturl.at/TU015" alt={post.title} />
                  </a>
                  <div className="bg-white flex flex-col justify-start p-6">
                    <a href="#" className="text-blue-700 text-sm font-bold uppercase pb-4">
                      {post.subtitle}
                    </a>
                    <a href={`/blog/${post.slug}`} className="text-3xl font-bold hover:text-gray-700 pb-4">
                      {post.title}
                    </a>
                    <p className="text-sm pb-3">
                      By{' '}
                      <a href="#" className="font-semibold hover:text-gray-800">
                        {post.author.user.fullName}
                      </a>
                      , Published on {formattedDate}
                    </p>
                    <p className="pb-6">{post.excerpt}</p>
                    <a href={`/blog/${post.slug}`} className="uppercase text-gray-800 hover:text-black" >
                      Read More.
                    </a>
                  </div>
                </div>
              );
            })}

            {/* #Pagination  */}
            <div className="flex items-center py-8">
              <a href="#" className="h-10 w-10 bg-blue-800 hover:bg-blue-600 font-semibold text-white text-sm flex items-center justify-center">1</a>
              <a href="#" className="h-10 w-10 font-semibold text-gray-800 hover:bg-blue-600 hover:text-white text-sm flex items-center justify-center">2</a>
              <a href="#" className="h-10 w-10 font-semibold text-gray-800 hover:text-gray-900 text-sm flex items-center justify-center ml-3">Next <i className="fas fa-arrow-right ml-2"></i></a>
            </div>

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
                <a href="#" className="bg-gray-200 text-gray-700 full px-3 py-1 m-1 hover:bg-blue-500 hover:text-white">
                  Tag1
                </a>
                <a href="#" className="bg-gray-200 text-gray-700 full px-3 py-1 m-1 hover:bg-blue-500 hover:text-white">
                  Tag2
                </a>
                <a href="#" className="bg-gray-200 text-gray-700 full px-3 py-1 m-1 hover:bg-blue-500 hover:text-white">
                  Tag3
                </a>
              </div>
            </div>

            <div className="w-full bg-white shadow flex flex-col my-4 p-6">
              <p className="text-xl font-semibold pb-3">Follow Us</p>
              <div className="flex">
                <a href="#" className="text-blue-700 hover:underline pr-2">
                  <InstagramLogoIcon className='h-8 w-8' />
                </a>
                <a href="#" className="text-blue-700 hover:underline pr-2">
                  {<TwitterLogoIcon className='h-8 w-8' />}
                </a>
                <a href="#" className="text-blue-700 hover:underline pr-2">
                  {<LinkedInLogoIcon className='h-8 w-8' />}
                </a>

              </div>
            </div>
          </aside>

        </div>
      </div>

    </main>

  )
}
