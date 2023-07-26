"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import {
  CrossCircledIcon
} from "@radix-ui/react-icons";
import LoginForm from "@/components/sections/login-form";

type Props = {};

export default function RegisterModal({}: Props) {
  const router = useRouter();
  return (
    <div
      className="relative z-50"
      aria-labelledby="modal-register"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="flex justify-end p-0">
              <Button variant={'ghost'} size={'icon'} className="m-0" onClick={() => router.back()}>
                <CrossCircledIcon className="h-4 w-4 text-rose-600" />
              </Button>
              </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
