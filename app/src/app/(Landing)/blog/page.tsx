import React from 'react';

import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BlogList = () => {
  const blogs = [
    {
      id: 1,
      title: 'Sample Blog Post 1',
      date: 'September 8, 2023',
      author: 'John Doe',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    },
    {
      id: 2,
      title: 'Sample Blog Post 2',
      date: 'September 7, 2023',
      author: 'Jane Smith',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    },
  ];

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
            {blogs.map((blog) => (

              <div className="flex flex-col shadow my-4" key={blog.id}>
                <a href="#" className="hover:opacity-75">
                  <img src="https://placehold.co/1000x600" alt={blog.title} />
                </a>
                <div className="bg-white flex flex-col justify-start p-6">
                  <a href="#" className="text-blue-700 text-sm font-bold uppercase pb-4">
                    Category
                  </a>
                  <a href="#" className="text-3xl font-bold hover:text-gray-700 pb-4">
                    {blog.title}
                  </a>
                  <p className="text-sm pb-3">
                    By <a href="#" className="font-semibold hover:text-gray-800">
                      {blog.author}
                    </a>, Published on {blog.date}
                  </p>
                  <p className="pb-6">
                    {blog.excerpt}
                  </p>
                  <a href="#" className="uppercase text-gray-800 hover:text-black">
                    Read More <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              </div>

            ))}

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
                </a>
                <a href="#" className="text-blue-700 hover:underline pr-2">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-blue-700 hover:underline pr-2">
                  <i className="fab fa-instagram"></i>
                </a>

              </div>
            </div>
          </aside>

        </div>
      </div>

    </main>

 )
}

export default BlogList;
