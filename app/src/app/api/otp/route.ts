import { NextRequest, NextResponse } from "next/server";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";

const query = gql`
  query getotp($phoneNumber: String!) {
    getOtp(phoneNumber: $phoneNumber)
  }
`;

const mutation = gql`
  mutation verifyotp($phoneNumber: String!, $otp: String!) {
    verifyOtp(phoneNumber: $phoneNumber, otp: $otp)
  }
`;

// Send OTP to Phone Number
export async function PUT(request: NextRequest) {
  if (request.body) {
    const { phoneNumber } = await request.json();
    const { data, errors } = await getClient().query({
      query,
      variables: {
        phoneNumber,
      },
    });
    if (errors) {
      console.error(errors);
      return NextResponse.json(errors, { status: 500 });
    }
    return NextResponse.json(data);
  }
  return NextResponse.json(null, { status: 500 });
}

// Verify OTP
export async function POST(request: NextRequest) {
  if (request.body) {
    const { phoneNumber, otp } = await request.json();
    const { data, errors } = await getClient().mutate({
      mutation,
      variables: {
        phoneNumber,
        otp,
      },
    });
    if (errors) {
      console.error(errors);
      return NextResponse.json(errors, { status: 500 });
    }
    if (data.getOtp) {
      return NextResponse.json(JSON.parse(data.getOtp.silce(1, -1)));
    }
    return NextResponse.json(data);
  }
  return NextResponse.json(null, { status: 500 });
}
