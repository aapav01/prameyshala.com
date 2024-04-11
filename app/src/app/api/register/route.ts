import { NextRequest, NextResponse } from "next/server";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";

const mutation = gql`
  mutation reigster(
    $phoneNumber: String!
    $fullName: String!
    $password: String!
    $email: String!
    $country: String!
    $state: String!
    $city: String!
    $referredBy: String
  ) {
    registerUser(
      phoneNumber: $phoneNumber
      name: $fullName
      password: $password
      email: $email
      country: $country
      state: $state
      city: $city
      referredBy: $referredBy
    ) {
      id
      fullName
    }
  }
`;

export async function POST(request: NextRequest) {
  if (request.body) {
    const res_data = await request.json();
    try {
      const { data, errors } = await getClient().mutate({
        mutation,
        variables: res_data,
        context: {
          fetchOptions: {
            caches: "no-cache",
          }
        }
      });
      if (errors) {
        console.error(errors);
        return NextResponse.json(errors, { status: 500 });
      }
      return NextResponse.json(data);
    } catch (error) {
      console.error(error);
      return NextResponse.json(error, { status: 500 });
    }
  } else {
    return NextResponse.json(null, { status: 500 });
  }
}
