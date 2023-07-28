import { NextRequest, NextResponse } from "next/server";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";

const query_enrollment = gql`
  query my_ernrolments {
    myEnrollments {
      standard {
        id
        name
        image
        slug
        latestPrice
        beforePrice
        publishAt
        createdAt
        updatedAt
        subjectSet {
          name
        }
      }
    }
  }
`;

export async function POST(request: NextRequest) {
  if (request.body) {
    const { token } = await request.json();
    const { data, errors } = await getClient().query({
      query: query_enrollment,
      fetchPolicy: "no-cache",
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
