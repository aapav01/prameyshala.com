import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/components/sections/login-form";
import { getServerSession } from "next-auth/next";

type Props = {};

export async function generateMetadata({}: Props): Promise<Metadata> {
  return {
    title: "Sign In | Pramey Shala",
  };
}

export default async function LoginPage({}: Props) {
  const session = await getServerSession();
  if (session?.user && session.user?.email) {
    redirect("/learn");
  }
  return (
    <main className="min-h-[70vh] bg-gradient-to-t from-indigo-500 to-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-none lg:flex">
          <div className="flex-1 bg-white px-6 py-8 lg:p-12 z-10">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-1 text-gray-500">
              Or&nbsp;
              <Link
                href="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Get Started by Creating an Account.
              </Link>
            </p>
            <LoginForm />
          </div>
          <div className="flex-none bg-indigo-600 rounded-lg rounded-l-none relative lg:flex lg:flex-col lg:justify-center lg:p-20">
            <div className="absolute lg:z-0 -z-10 inset-0 transform -translate-x-3/4 -translate-y-3/4 opacity-50 ">
              <div className="flex flex-col justify-between h-full px-12 py-6 bg-white rounded-xl shadow-xl"></div>
            </div>
            <div className="relative text-white text-center p-6">
              <div className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Get notified when we&rsquo;re launching.
              </div>
              <p className="mt-4 text-lg">
                Sign up to receive updates on our progress.
              </p>
              <form
                action="#"
                className="mt-8 sm:flex sm:justify-center lg:justify-start"
              >
                <label htmlFor="emailAddress" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  name="emailAddress"
                  id="emailAddress"
                  autoComplete="email"
                  required
                  className="w-full px-5 py-3 border border-transparent text-black placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-white sm:max-w-xs"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="mt-3 w-full px-5 py-3 border border-transparent rounded-md shadow bg-white text-base font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:border-white sm:mt-0 sm:ml-3 sm:w-auto sm:flex-shrink-0"
                >
                  Notify me
                </button>
              </form>
              <p className="mt-6 text-center text-base font-medium">
                We care about the protection of your data. Read our&nbsp;
                <Link href="/privacy-policy" className="text-white">
                  Privacy Policy.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
