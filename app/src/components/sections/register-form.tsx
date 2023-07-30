"use client";

import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

type Props = {};

const formSchema = z
  .object({
    fullName: z.string().min(3).max(32),
    email: z.string().email("Please enter a vaild Email Address"),
    phoneNumber: z
      .string()
      .min(10, {
        message: "Phone Number must be at least of 10 digits.",
      })
      .trim(),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirm: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"], // path of error
  });

export default function RegisterForm({}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-rose-900 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="font-medium text-gray-700">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Mirnalika Rai" autoFocus {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@prameyshala.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Verfication and Password Reset will be sent to this email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input placeholder="+91 9876543210" type="tel" {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  Phone Number will be used to log on to Pramey Shala.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="*********"
                    autoComplete="new-password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="*********"
                    autoComplete="confirm-password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign up
          </button>
        </div>
      </form>
    </Form>
  );
}
