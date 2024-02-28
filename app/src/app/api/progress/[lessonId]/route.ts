import { NextRequest, NextResponse } from "next/server";
import { headers } from 'next/headers'
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// GRAPHQL API - APPLOLO
import { OperationVariables, gql } from "@apollo/client";
import { getClient } from "@/lib/client";

const mutation = gql`
mutation lessonProgress($lessonID:ID! $progress:Float!)
{
  createProgress(progress:$progress,lessonID:$lessonID){
		success
  }
}
`;

const query = gql`
query progress_detail($lesson: ID!){
   progress(lesson: $lesson){
    progress
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
          },
          headers: {
            Authorization: `JWT ${res_data?.token}`,
          },
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

export async function GET(request: NextRequest,{ params }: { params: { lessonId: OperationVariables } }) {
  const token = request.headers.get('token');
    try {
      const { data, errors } = await getClient().query({
        query,
        variables: {lesson:params.lessonId},
        context: {
          fetchOptions: {
            caches: "no-cache",
          },
          headers: {
            Authorization: `JWT ${token}`,
          },
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

}
