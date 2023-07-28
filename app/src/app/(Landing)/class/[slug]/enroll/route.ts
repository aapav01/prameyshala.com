import { NextRequest, NextResponse } from "next/server";
// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import { error } from "console";

const mutation = gql`
  mutation ps_enroll($razorpay_payment_id: String!, $amount: Int!, $payment: Int!, $standard: Int!) {
  enrollStudent(
    razorpayPaymentId: $razorpay_payment_id
    amount: $amount
    psPaymentId: $payment
    psStandardId: $standard
  ) {
    id
    payment {
      status
    }
    standard {
      name
    }
    expirationDate
  }
}
`;

export async function POST(request: NextRequest) {
  if (request.body) {
    const {
      token,
      amount,
      standard,
      payment,
      razorpay_payment_id,
    } = await request.json();
    const { data, errors } = await getClient().mutate({
      mutation,
      variables: {
        amount,
        standard,
        payment,
        razorpay_payment_id,
      },
      context: {
        headers: {
          Authorization: `JWT ${token}`,
        },
      },
    });
    if (errors) {
      console.error(errors);
      return NextResponse.json(errors, { status: 500 });
    }
    return NextResponse.json(data);
  }
  return NextResponse.json(null);
}
