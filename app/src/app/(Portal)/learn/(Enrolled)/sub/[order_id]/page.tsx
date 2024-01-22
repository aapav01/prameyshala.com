import { notFound } from "next/navigation";
import React from "react";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOption";

const mutation = gql`
  mutation orderPhonepe($orderId: String!) {
    checkPaymentPhonepe(orderId: $orderId) {
      success
      message
      code
      data
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
      }
    });
    return res as any;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export default async function BillPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const { data } =  await getPaymentDetails(params.order_id, session);
  console.log("order details: ", data);
  return (
    <div className="container py-4">
      <div className="border rounded-2xl p-4 max-w-md">
        <h1 className="text-center text-2xl font-sans font-bold mb-2">
          {/* {data.checkPaymentPhonepe.message} */}
        </h1>
        <hr />
        <div className="flex justify-between py-2">
          <p className="text-gray-500">Order ID</p>
          <p className="text-gray-700">{params.order_id}</p>
        </div>
        <div className="flex justify-between py-2">
          <p className="text-gray-500">Order Date</p>
          <p className="text-gray-700">{null}</p>
        </div>
        <div className="flex justify-between py-2">
          <p className="text-gray-500">Order Status</p>
          {/* <p className="text-gray-700">{data.checkPaymentPhonepe.message}</p> */}
        </div>
      </div>
    </div>
  );
}
