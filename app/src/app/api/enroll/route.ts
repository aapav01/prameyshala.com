import { NextRequest, NextResponse } from "next/server";

// GRAPHQL API - APPLOLO
import authOptions from "@/lib/authOption";
import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";
import { getServerSession } from "next-auth";

const mutation = gql`
  mutation orderPhonepe($standard: ID!) {
    createPaymentPhonepe(standard: $standard) {
      code
      data
      message
      success
    }
  }
`;

export async function POST(request: NextRequest) {
  const session: any = await getServerSession(authOptions);
  if (request.body) {
    const res_data = await request.json();
    try {
      const { data, errors } = await getClient().mutate({
        mutation,
        variables: res_data,
        context: {
          fetchOptions: {
            caches: "no-cache",
          },
          headers: {
            // @ts-ignore
            Authorization: `JWT ${session?.user?.token}`,
          },
        },
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
