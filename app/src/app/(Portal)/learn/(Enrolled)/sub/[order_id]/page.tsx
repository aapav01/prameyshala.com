import { notFound } from "next/navigation";
import React from "react";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOption";
import { CheckCircledIcon, CircleBackslashIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const mutation = gql`
  mutation orderPhonepe($orderId: String!) {
    checkPaymentPhonepe(orderId: $orderId) {
      success
      message
      code
      data
      standardSlug
    }
  }
`;

type Props = {
  params: {
    order_id: string;
  };
};

async function getPaymentDetails(order_id: string, session: any) {
  try {
    const res = await getClient().mutate({
      mutation,
      variables: { orderId: order_id },
      context: {
        headers: {
          Authorization: `JWT ${session.user?.token}`,
        },
      },
    });
    return res as any;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export default async function BillPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const { data } = await getPaymentDetails(params.order_id, session);
  const res_data = JSON.parse(data.checkPaymentPhonepe.data);

  return (
    <div className="container py-4">
      <div className="border rounded-2xl p-4 max-w-md mx-auto">
        {data.checkPaymentPhonepe.success ? (
          <CheckCircledIcon className="w-16 h-16 mx-auto text-green-500" />
        ) : (
          <CircleBackslashIcon className="w-16 h-16 mx-auto text-red-500" />
        )}
        <h1 className="text-center text-2xl font-sans font-bold mb-2">
          {data.checkPaymentPhonepe.message}
        </h1>
        <hr className="py-2" />
        <div className="flex justify-between py-2">
          <p className="text-gray-500">Order ID</p>
          <p className="text-gray-700">{params.order_id}</p>
        </div>
        <div className="flex justify-between py-2">
          <p className="text-gray-500">Order Transaction ID</p>
          <p className="text-gray-700">{res_data.transactionId}</p>
        </div>
        <div className="flex justify-between py-2">
          <p className="text-gray-500">Order Status</p>
          <p className="text-gray-700">{res_data?.responseCode}</p>
        </div>
        <div className="flex justify-center py-2">
          <Button asChild>
            {data.checkPaymentPhonepe.success ? (
              <Link href={"/learn/" + data.checkPaymentPhonepe.standardSlug}>
                Let&apos;s Get Started
              </Link>
            ) : (
              <Link href={"class/" + data.checkPaymentPhonepe.standardSlug}>
                Let&apos;s Try Again Back
              </Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
