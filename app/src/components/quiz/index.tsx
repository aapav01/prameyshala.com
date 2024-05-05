"use client";

import { Button } from "@/components/ui/button";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Question from "./question";

type Props = {
  lesson: any;
};

function Quiz({ lesson }: Props) {
  const [startQuiz, setStartQuiz] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [resumeQuiz, setResumeQuiz] = useState(false);
  const [questions, setQuestions] = useState({
    questionSet: [],
    currentQuestion: null,
    currentQuestionCount: 1,
  });
  const [quizHashId, setQuizHashId] = useState(null);
  const [timeRequired, setTimeRequired] = useState<number | null>(null);
  const [quizEnded, setQuizEnded] = useState(false);
  const [currentGrade, setCurrentGrade] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const resumeQuiz = await fetch(`/api/quiz/${lesson?.quiz?.id}/quizHash`, {
        method: "GET",
        headers: {
          // @ts-ignore
          token: session?.user?.token,
        },
      })
        .then((res) => res.json())
        .catch((err) => {
          console.error(err);
          return null;
        });
      if (resumeQuiz?.quizHash?.length > 0) {
        if (!resumeQuiz?.quizHash[0].quizEnded) {
          setResumeQuiz(true);
          setQuizHashId(resumeQuiz?.quizHash[0].quizHashId);
          if (resumeQuiz?.quizHash[0].lastAttemptedQuestion) {
            setQuestions((prev) => {
              return {
                ...prev,
                currentQuestion: resumeQuiz?.quizHash[0].lastAttemptedQuestion,
                currentQuestionCount:
                  resumeQuiz?.quizHash[0].lastAttemptedQuestionCount,
              };
            });
            setCurrentGrade(resumeQuiz?.quizHash[0].currentGrade);
          }
        }
      }
    };
    fetchData();
  }, [lesson.id, lesson?.quiz?.id, router, session?.user]);

  useEffect(() => {
    if (quizEnded) {
      setStartQuiz(false);
      setResumeQuiz(false);
    }
  }, [quizEnded]);

  async function startOrResumeQuiz(quizId: number) {
    const data = await fetch(`/api/quiz/${quizId}/startQuiz`, {
      method: "POST",
      body: JSON.stringify({
        quizId: quizId,
        /*@ts-ignore*/
        token: session?.user?.token,
      }),
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error(err);
        return null;
      });

    if (resumeQuiz) {
      setTimeRequired(data?.startOrResumeQuiz?.timeLeft / 60);
    }
    return data;
  }

  // To get questions
  async function getQuestions(quizHash: String) {
    const questionData = await fetch(
      `/api/quiz/${lesson?.quiz?.id}/quizHash/${quizHash}/question`,
      {
        method: "GET",
        headers: {
          /*@ts-ignore*/
          token: session?.user?.token,
        },
      }
    )
      .then((res) => res.json())
      .catch((err) => {
        console.error(err);
        return null;
      });
    if (resumeQuiz && questions.currentQuestion) {
      setQuestions((prev) => {
        return {
          ...prev,
          questionSet: questionData?.quizHashQuestionAnswer,
        };
      });
    } else {
      setQuestions({
        questionSet: questionData?.quizHashQuestionAnswer,
        currentQuestion: questionData?.quizHashQuestionAnswer[0],
        currentQuestionCount: 1,
      });
    }
    setStartQuiz(true);
  }

  const handleStartOrResumeClick = async (quizId: number) => {
    const data = await startOrResumeQuiz(quizId);
    const quizHash = data?.startOrResumeQuiz?.quizHash?.quizHashId;
    await getQuestions(quizHash);
    setQuizHashId(quizHash);
  };

  return (
    <section className="container my-8">
      {!startQuiz && !quizEnded && (
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-semibold text-center">
            {lesson?.quiz?.name}
          </h1>
          <div className="flex flex-col px-4 mr-4">
            <div className="flex justify-between mr-8">
              <p className="font-semibold">
                Time Required:{" "}
                <span className="font-normal">
                  {lesson?.quiz?.timeRequired} mins
                </span>
              </p>
              <p className="font-semibold">
                No. of Questions:{" "}
                <span className="font-normal">
                  {lesson?.quiz?.questionSet?.length}
                </span>
              </p>
            </div>
            <Button
              variant={"outline"}
              className="mt-4 w-auto px-5 py-3 border border-transparent rounded-md text-xl shadow font-medium text-green-600 hover:bg-green-50 mr-4"
              onClick={(event) => handleStartOrResumeClick(lesson?.quiz?.id)}
            >
              {resumeQuiz ? "Resume Quiz" : "Start Quiz"}
            </Button>
          </div>
        </div>
      )}
      {startQuiz && (
        <div className="flex flex-col gap-3">
          <Question
            questions={questions}
            setQuestions={setQuestions}
            quizHash={quizHashId}
            currentGrade={currentGrade}
            setCurrentGrade={setCurrentGrade}
            lesson={lesson}
            /* @ts-ignore */
            token={session?.user?.token}
            setQuizEnded={setQuizEnded}
            quizEnded={quizEnded}
            timeRequired={timeRequired}
          />
        </div>
      )}
      {quizEnded && (
        // To show when quiz ends
        <>
          <div className="flex flex-col justify-center text-center gap-2 px-2">
            <CheckCircledIcon className="h-24 w-24 max-sm:h-16 max-sm:w-16 text-green-400 text-center self-center" />
            <p className="text-2xl max-sm:text-lg font-semibold ml-1 leading-relaxed">
              Quiz submitted successfully.
            </p>

            <hr className="my-4 border-gray-400 mx-auto h-2 w-[20%]" />
            <h6 className="block antialiased tracking-normal font-serif font-semibold leading-relaxed text-center text-2xl max-sm:text-lg -mt-2">
              Correctly Answered
            </h6>
            <p className="font-bold text-center text-3xl max-sm:text-2xl mt-2">
              {currentGrade} of {questions.questionSet?.length}
              <br />
              <span className="font-semibold text-xl block mt-0">
                Questions
              </span>
            </p>
            <Button
              className="mx-auto mt-2"
              variant={"default"}
              onClick={() => {
                setQuizEnded(false);
                setCurrentGrade(0);
                setQuestions({
                  questionSet: [],
                  currentQuestion: null,
                  currentQuestionCount: 1,
                });
                setQuizHashId(null);
                setTimeRequired(null);
              }}
            >
              Go Back
            </Button>
          </div>
        </>
      )}
    </section>
  );
}

export default Quiz;
