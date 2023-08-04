import React from "react";
import { Metadata } from "next";
import RegisterForm from "@/components/sections/register-form";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Image from "next/image";

type Props = {};

export async function generateMetadata({}: Props): Promise<Metadata> {
  return {
    title: "Sign Up | Pramey Shala",
  };
}

export default async function RegisterPage({}: Props) {
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
              Sign up for an account
            </h2>
            <p className="mt-1 text-gray-500">
              Or&nbsp;
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in to your account.
              </Link>
            </p>
            <RegisterForm />
          </div>
          <div className="max-lg:hidden relative flex-1 min-w-[55%]">
            <Image
              src="/img/openai_gen_classroom.png"
              className="inset-0 h-full w-full object-cover"
              alt="Pramey Shala"
              width={600}
              height={600}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
