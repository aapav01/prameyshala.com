import { NextRequest, NextResponse } from "next/server";
// GRAPHQL API - APPLOLO
import { OperationVariables, gql } from "@apollo/client";
import { getClient } from "@/lib/client";


const query = gql`
query getQuestion($quizHashId: ID!){
  quizHashQuestionAnswer(quizHashId: $quizHashId){
    question{
      id
      questionText
      figure
      choiceSet{
        id
        choiceText
        isCorrect
      }
    }
    questionOrder
  }
}
`;

export async function GET(request: NextRequest,{ params }: { params: { quizHash: OperationVariables } }) {
  const token = request.headers.get('token');
    try {
      const { data, errors } = await getClient().query({
        query,
        variables: {quizHashId: params.quizHash},
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
