import { NextRequest, NextResponse } from "next/server";
// GRAPHQL API - APPLOLO
import { gql, OperationVariables } from "@apollo/client";
import { getClient } from "@/lib/client";

const mutation = gql`
mutation submitChosenAnswer($quizHashId: String!, $questionId: ID!, $chosenAnswerId: ID!, $currentGrade: Int!, $lastAttemptedQuestionCount: Int!) {
    submitAnswer(quizHashId: $quizHashId, questionId: $questionId, chosenAnswerId: $chosenAnswerId, currentGrade: $currentGrade, lastAttemptedQuestionCount: $lastAttemptedQuestionCount) {
      success
    }
  }
`;

const query = gql`
  query getAnswer($quizHash: String!, $questionId: ID!){
  quizHashQuestionAnswerForChosenAnswer(quizHash:$quizHash, questionId: $questionId){
    chosenAnswer{
      id
    }
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

export async function GET(request: NextRequest,{ params }: { params: { quizHash: OperationVariables } }) {
  const token = request.headers.get('token');
  const questionId = request.nextUrl.searchParams.get('question')
    try {
      const { data, errors } = await getClient().query({
        query,
        variables: {
          quizHash: params.quizHash,
          questionId: questionId
        },
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
