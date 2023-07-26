"use client";

import React, { useState } from 'react';
import Script from "next/script";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";


type Props = {
  standard: any;
}

export default function EnrollButton({ standard }: Props) {
  const { data: session } = useSession();
  const [enrolled, setEnrolled] = useState(false);
  const router = useRouter();

  const makePayment = async (e: any) => {
    e.preventDefault();
    if (!session?.user) {
      router.push("/login?callbackUrl=" + window.location.href);
      return;
    }
    // TODO: Make API call to the serverless API
    var options = {
      key: "rzp_test_3tq8ujggBnFtra",
      name: "Pramey Shala",
      currency: "INR",
      amount: standard.latestPrice * 100,
      image: "/apple-icon",
      handler: async function (response: any) {
        // TODO: enroll_check();
        router.push("/learn");
        // TODO: print invoice details
      },
      prefill: {
        // @ts-expect-error
        name: session.user.fullName,
        email: session.user.email,
        // @ts-expect-error
        contact: session.user.phoneNumber,
      },
      theme: {
        color: "#5F2DED",
      },
    };
    // @ts-expect-error
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };
  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <Button
        className="text-lg py-6 hover:bg-transparent border hover:border-primary hover:text-primary"
        size="lg"
        onClick={makePayment}
      >
        Enroll to the Class Now
      </Button>
    </>
  )
}
