import { NextRequest, NextResponse } from "next/server";
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import { validate } from "graphql";

const query = gql`
  query demo_videos {
    lessonsByPreview {
      id
      description
      lessonType
      title
      platformVideoId
      platform
      url
      thumbUrl
      chapter {
        subject {
          name
          standard {
            name
            slug
          }
        }
      }
    }
  }
`;

export async function GET(request: NextRequest) {
  try {
    const { data, errors } = await getClient().query({
      query,
      context: {
        fetchOptions: {
          validate: 5,
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
}
