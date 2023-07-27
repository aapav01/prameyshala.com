import { NextRequest, NextResponse } from "next/server";
// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";

const mutation = gql`
  mutation create_payment($amount: Int!) {
    createPayment(amount: $amount) {
      id
      amount
      orderGatewayId
      createdAt
    }
  }
`;

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (request.body) {
    const { amount, token } = await request.json();
    const { data } = await getClient().mutate({
      mutation,
      variables: {
        amount,
      },
      context: {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    });
    return NextResponse.json(data);
  }
  return NextResponse.json(null);
}
