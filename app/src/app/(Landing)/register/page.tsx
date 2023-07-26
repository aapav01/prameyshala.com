import React from "react";
import { Metadata } from "next";
import RegisterForm from "@/components/sections/register-form";

type Props = {};

export async function generateMetadata({}: Props): Promise<Metadata> {
  return {
    title: "Sign Up | Pramey Shala",
  };
}

export default function RegisterPage({}: Props) {
  return (
    <main className="min-h-[70vh] bg-gradient-to-t from-indigo-500 to-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-none lg:flex">
          <div className="flex-1 bg-white px-6 py-8 lg:p-12 z-10">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Sign up for an account
            </h2>
            <p className="mt-1 text-gray-500">
              Or&nbsp;
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in to your account.
              </a>
            </p>
            <RegisterForm />
          </div>
          <div className="hidden lg:block relative flex-1 min-w-[55%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/opengraph-image"
              className="inset-0 h-full w-full object-cover"
              alt="Pramey Shala"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
