"use client";

import React, { useState } from "react";
import Script from "next/script";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

type Props = {
  standard: any;
};

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
    const res = await fetch(`/class/${standard.slug}/enroll/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // @ts-expect-error
        token: session.user.token,
        amount: standard.latestPrice,
      }),
    });
    const { createPayment } = await res.json();

    var options = {
      key: "rzp_test_3tq8ujggBnFtra",
      name: "Pramey Shala",
      description: `${standard.name} - 1 Year`,
      currency: "INR",
      amount: standard.latestPrice * 100,
      image: "/apple-icon",
      order_id: createPayment.orderGatewayId,
      handler: async function (response: any) {
        // TODO: enroll_check();
        const payment_data = {
          // @ts-expect-error
          token: session.user.token,
          amount: parseInt(standard.latestPrice),
          standard: parseInt(standard.id),
          payment: parseInt(createPayment.id),
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        };
        toast({
          title: "You submitted the following values:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(payment_data, null, 2)}
              </code>
            </pre>
          ),
        });
        const { enrollStudent } = await fetch(
          `/class/${standard.slug}/enroll`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payment_data),
          }
        ).then((res) => res.json());
        console.log(enrollStudent);
        router.push("/learn");
        // TODO: print invoice details
        return;
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
    paymentObject.on("payment.failed", function (response: any) {
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(response, null, 2)}
            </code>
          </pre>
        ),
      });
    });
    paymentObject.open();
  };
  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      {!enrolled && (
        <Button
          className="text-lg py-6 hover:bg-transparent border hover:border-primary hover:text-primary"
          size="lg"
          onClick={makePayment}
        >
          Enroll to the Class Now
        </Button>
      )}
      {enrolled && <Button>Let&apos;s Start</Button>}
    </>
  );
}
