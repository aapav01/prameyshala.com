import { NextRequest, NextResponse } from "next/server";
// GRAPHQL API - APPLOLO
import { OperationVariables, gql } from "@apollo/client";
import { getClient } from "@/lib/client";

const query = gql`
query quiz_detail($quizId:ID){
  quiz(id:$quizId){
    timeRequired
    name
    questionSet{
      questionText
      figure
      lesson{
        id
        title
      }
      choiceSet{
        choiceText
        isCorrect
      }
    }
  }
}
`;


export async function GET(request: NextRequest,{ params }: { params: { quizId: OperationVariables } }) {
  const token = request.headers.get('token');
    try {
      const { data, errors } = await getClient().query({
        query,
        variables: {quizId:params.quizId},
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
