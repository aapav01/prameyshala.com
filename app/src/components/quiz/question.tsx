"use client";

import { useEffect, useState } from "react";
import QuizTimer from "./quizTimer";

type Props = {
  questions: any;
  setQuestions: any;
  quizHash: string | null;
  currentGrade: number;
  setCurrentGrade: any;
  quiz: any;
  token: any;
  setQuizEnded: any;
  quizEnded: boolean;
  timeRequired: number | null;
};

export default function Question({
  questions,
  setQuestions,
  quizHash,
  currentGrade,
  setCurrentGrade,
  quiz,
  token,
  setQuizEnded,
  quizEnded,
  timeRequired,
}: Props) {
  const [optionChosen, setOptionChosen] = useState<any>();
  const [questionsLoaded, setQuestionsLoaded] = useState(false);

  useEffect(() => {
    // To get selected answer for the question
    const getChosenAnswer = async (questionCount: number) => {
      const chosenOptionData = await fetch(
        `/api/quiz/${quiz?.id}/quizHash/${quizHash}/answer?question=${questions?.questionSet[questionCount].question.id}`,
        {
          method: "GET",
          headers: {
            token: token,
          },
        }
      )
        .then((res) => res.json())
        .catch((err) => {
          console.error(err);
          return null;
        });
      setOptionChosen(
        () =>
          chosenOptionData?.quizHashQuestionAnswerForChosenAnswer?.chosenAnswer
      );
      setQuestionsLoaded(true);
    };

    getChosenAnswer(questions?.currentQuestionCount - 1);
  }, [
    quiz?.id,
    questions,
    questions.currentQuestion,
    questions?.currentQuestionCount,
    questions?.questionSet,
    quizHash,
    token,
  ]);

  // To submit selected answer for question
  const submitAnswer = async (curGrade: number) => {
    await fetch(`/api/quiz/${quiz?.id}/quizHash/${quizHash}/answer`, {
      method: "POST",
      body: JSON.stringify({
        quizHashId: quizHash,
        questionId: questions?.currentQuestion?.question?.id,
        chosenAnswerId: optionChosen?.id || null,
        currentGrade: curGrade,
        lastAttemptedQuestionCount: questions?.currentQuestionCount,
        token: token,
      }),
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error(err);
        return null;
      });
  };

  const handleNextClick = async () => {
    let curGrade = currentGrade;
    if (optionChosen) {
      if (
        optionChosen?.id ==
        questions?.currentQuestion?.question?.choiceSet.find(
          (choice: any) => choice.isCorrect
        )?.id
      ) {
        setCurrentGrade((prev: number) => {
          curGrade = curGrade + 1;
          return prev + 1;
        });
      }
      await submitAnswer(curGrade);
    }

    setQuestions((prevState: any) => {
      return {
        questionSet: prevState?.questionSet,
        // @ts-ignore
        currentQuestion: prevState.questionSet[prevState?.currentQuestionCount],
        currentQuestionCount: prevState.currentQuestionCount + 1,
      };
    });
  };

  const handleSubmitQuiz = async () => {
    let curGrade = currentGrade;

    if (optionChosen) {
      if (
        optionChosen?.id ==
        questions?.currentQuestion?.question?.choiceSet.find(
          (choice: any) => choice.isCorrect
        )?.id
      ) {
        curGrade = curGrade + 1;
        setCurrentGrade((prev: number) => {
          return prev + 1;
        });
      }

      await submitAnswer(curGrade);
    }
    const grade = Number(
      ((curGrade / questions.questionSet.length) * 10).toFixed(1)
    ); // TO make grade between 0-10
    await fetch(`/api/quiz/${quiz?.id}/end-quiz`, {
      method: "POST",
      body: JSON.stringify({
        quizHashId: quizHash,
        grade: grade,
        /*@ts-ignore*/
        token: token,
      }),
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error(err);
        return null;
      });
    setQuizEnded(true);
    setQuestionsLoaded(false);
  };

  return (
    <>
      {questionsLoaded && !quizEnded && (
        <div className="flex flex-col px-6 max-sm:px-1">
          <div className="flex justify-between mb-4 items-end max-sm:gap-2">
            <h1 className="font-semibold text-2xl max-sm:text-lg ml-3 mb-[0.30rem] max-sm:mb-0">
              {quiz?.name}
            </h1>
            <QuizTimer
              timeRequired={timeRequired ? timeRequired : quiz?.timeRequired}
              onSubmit={handleSubmitQuiz}
            />
            <button
              onClick={handleSubmitQuiz}
              className="shrink text-white text-center sm:py-[0.6rem] max-sm:text-sm items-center justify-center rounded-[4px] px-[15px] max-sm:py-[0.30rem] max-sm:px-1 font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none bg-gradient-to-br from-red-600 to-red-400 hover:from-red-300 hover:to-red-500 mr-2 max-sm:mr-1"
            >
              Submit Quiz
            </button>
          </div>
          <div className="z-10 flex flex-col w-full px-6 py-8 overflow-hidden rounded-t-xl bg-gradient-to-br from-blue-700 to-blue-400 text-white text-wrap">
            <h1 className="block leading-snug text-white antialiased text-lg max-sm:text-md font-semibold max-sm:text-left ">
              <span className="px-1 max-sm:px-0 mr-2 max-sm:mr-1 py-[0.15rem] max-sm:text-left text-center font-semibold">
                Q{questions?.currentQuestionCount}.
              </span>
              {questions?.currentQuestion?.question?.questionText}
            </h1>
            <div className="max-w-3xl object-contain self-center mt-2">
              {questions?.currentQuestion?.question?.figure && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="block rounded-md"
                  src={`${process.env.NEXT_PUBLIC_MEDIA_CDN}/static/media/${questions?.currentQuestion?.question?.figure}`}
                  alt={questions?.currentQuestion?.question?.questionText}
                />
              )}
            </div>
          </div>
          <div className="mt-0 relative flex flex-col w-full justify-center rounded-b-xl bg-gray-50  text-base-content shadow-md pb-6 px-7 max-sm:px-2">
            <div className="grid max-sm:grid-cols-1 grid-cols-2 mt-8">
              {questions?.currentQuestion?.question?.choiceSet.map(
                (choice: any, index: number) => (
                  <div
                    key={choice.id}
                    className={`rounded-xl ${
                      optionChosen != choice
                        ? "bg-white text-base-content hover:-translate-y-1 transition-transform hover:bg-gray-100 border-gray-400"
                        : "bg-blue-700 text-white shadow-blue-500/40 hover:-translate-y-1 transition-transform border-blue-400"
                    }  bg-clip-border shadow-lg my-3 mx-6 py-4 font-semibold cursor-pointer inline border-b-2 `}
                    onClick={() => setOptionChosen(choice)}
                  >
                    <p className="text-md px-4">{choice?.choiceText}</p>
                  </div>
                )
              )}
            </div>
            <div className="flex max-sm:flex-col flex-row-reverse mt-3 justify-evenly">
              <button
                className={`mt-3 mr-6 max-sm:ml-6 px-3 py-2 border border-transparent rounded-md shadow bg-gradient-to-tr from-green-600 to-green-400 text-base font-medium text-white hover:from-green-500 hover:to-green-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-white sm:mt-0 sm:ml-3 flex-shrink ${
                  questions?.currentQuestionCount >=
                    questions?.questionSet.length && "hidden"
                }`}
                onClick={handleNextClick}
              >
                Next Question
              </button>
              <p className="font-normal text-slate-700 text-sm max-sm:text-center ml-10 max-sm:ml-0 mt-4 max-sm:mt-5 text-left self-center grow">{`${questions?.currentQuestionCount} of ${questions.questionSet.length} Questions`}</p>
            </div>
          </div>
        </div>
      )}
      {!questionsLoaded && !quizEnded && (
        <svg
          aria-hidden="true"
          className="w-40 h-40 m-auto mt-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      )}
    </>
  );
}
