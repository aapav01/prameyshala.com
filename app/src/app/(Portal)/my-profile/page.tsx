import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOption";
import React from "react";

type Props = {};

const query = gql`
  query me {
    me {
      id
      fullName
      email
      city
      country
      createdAt
      isActive
      lastLogin
      phoneNumber
      photo
      state
      updatedAt
    }
  }
`;

async function getPaymentDetails(session: any) {
  try {
    const res = await getClient().query({
      query,
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

export default async function MyProfilePage({}: Props) {
  const session = await getServerSession(authOptions);
  const { data } = await getPaymentDetails(session);
  return (
    <div className="container py-4">
      <div className="border rounded-2xl p-4 max-w-md mx-auto">
        <div className="flex items-center justify-center">
        </div>
        <div className="text-center mt-4">
          <h1 className="text-xl font-bold">{data.me.fullName}</h1>
          <p className="text-sm text-gray-500">{data.me.email}</p>
        </div>
        <div className="mt-4">
          <div className="flex justify-between">
            <p>Phone</p>
            <p>{data.me.phoneNumber}</p>
          </div>
          <div className="flex justify-between">
            <p>City</p>
            <p>{data.me.city}</p>
          </div>
          <div className="flex justify-between">
            <p>State</p>
            <p>{data.me.state}</p>
          </div>
          <div className="flex justify-between">
            <p>Country</p>
            <p>{data.me.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
