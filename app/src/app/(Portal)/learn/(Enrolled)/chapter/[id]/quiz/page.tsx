import React from "react";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/authOption";

// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";

import Quiz from "@/components/quiz";

const query = gql`
  query quizByChapter($chapter: ID!) {
    quizByChapter(chapter : $chapter){
      name
    id
    timeRequired
    questionSet{
      id
    }
      chapter{
        name
        subject{
          name
          standard{
            name
          }
        }
    }
  }
  }
`;

type Props = {
  params : {
    id : string
  }
};

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   // fetch data
//   const session = await getServerSession(authOptions);
//   const { chapter } = await getData({ params }, session);

//   return {
//     title: `${chapter.name} - ${chapter.subject.name} of ${chapter.subject.standard.name} | Pramey Shala`,
//   };
// }

async function getData({ params }: Props, session: any) {
  try {
    const api_data = await getClient().query({
      query,
      variables: { chapter: parseInt(params.id) },
      context: {
        headers: {
          Authorization: `JWT ${session.user.token}`,
        },
      },
    });
    return api_data.data;
  } catch (error) {
    return notFound();
  }
}

export default async function QuizDetail({params}: Props) {

  const session = await getServerSession(authOptions);
  const { quizByChapter } = await getData( {params} , session);

  return (
    <>
     <header
        id="header"
        className="bg-teal-700 py-6 text-indigo-50 shadow-lg shadow-teal-500/50"
      >
        <div className="container">
          <h1 className="text-xl sm:text-4xl font-bold capitalize">
            {quizByChapter?.name}
          </h1>
          <span className="py-2">
            {quizByChapter?.chapter.name} of {quizByChapter?.chapter.subject.name} (
            {quizByChapter?.chapter.subject.standard.name})
          </span>
        </div>
      </header>
      <Quiz quiz={quizByChapter}/>
    </>
  );
}
