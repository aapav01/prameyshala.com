"use client";

import React, { useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import { QuizContext } from "@/contexts/quiz";
import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { Cross2Icon } from "@radix-ui/react-icons";

type Props = {
  lesson: any;
};

interface quiz {
  id: number;
  timeRequired: number;
  name: string;
  questionSet: {
    questionText: string;
    figure?: string;
    lesson: {
      id: number;
      title: string;
    };
    choiceSet: {
      choiceText: string;
      isCorrect: boolean;
    };
  };
}

interface quizDetailsData {
  quiz: quiz[];
}

interface QuizTimerProps {
  timeRequired: number;
  onSubmit: () => void;
}

const QuizTimer = ({ timeRequired, onSubmit }: QuizTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(timeRequired * 60);
  useEffect(() => {
    // If time is up, call the onSubmit callback
    if (timeLeft === 0) {
      onSubmit();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onSubmit]);

  const formatTimeLeft = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours}h:${minutes}m:${remainingSeconds}s`;
  };

  return (
    <div className="w-full shrink h-7 bg-gray-400 z-0 overflow-hidden rounded-lg text-center">
      <span
        className="block h-full bg-green-400 rounded-lg"
        style={{
          width: `${(timeLeft / (timeRequired * 60)) * 100}%`,
          transition: "width 1s linear",
        }}
      >
        <p className="font-semibold text-xl ml-2 mt-[0.20rem] fixed">
          {formatTimeLeft(timeLeft)}
        </p>
      </span>
    </div>
  );
};

export default function Quiz({ lesson }: Props) {
  // const { questions, setQuestions } = useContext(QuizContext);
  // const { gameState, setGameState } = useContext(QuizContext);
  // const { counter, setCounter } = useContext(QuizContext);
  // const { score, setScore } = useContext(QuizContext);

  const [startQuiz, setStartQuiz] = useState(false);
  const [questions, setQuestions] = useState({
    questionSet: [],
    currentQuestion: null,
    currentQuestionCount: 1,
  });
  const [optionChosen, setOptionChosen] = useState(null);
  const [quizData, setQuizData] = useState<quizDetailsData | null>(null);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [resumeQuiz, setResumeQuiz] = useState(false);
  const [quizHashId, setQuizHashId] = useState(null);
  const [timeRequired, setTimeRequired] = useState<number | null>(null);
  const [quizEnded, setQuizEnded] = useState(false);
  const [currentGrade, setCurrentGrade] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user) {
        router.push("/login?callbackUrl=" + window.location.href);
        return;
      }

      //API call to get quiz data
      const data = await fetch(`/api/quiz/${lesson?.quiz?.id}`, {
        method: "GET",
        headers: {
          /*@ts-ignore*/
          token: session?.user?.token,
        },
      })
        .then((res) => res.json())
        .catch((err) => {
          console.error(err);
          return null;
        });
      setQuizData(data);

      // API call for checking if quiz has to be resumed
      const resumeQuiz = await fetch(`/api/quiz/${lesson?.quiz?.id}/quizHash`, {
        method: "GET",
        headers: {
          /*@ts-ignore*/
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
          }
        }
      }
    };
    fetchData();
  }, [lesson?.quiz?.id, session?.user, quizHashId]);

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
    setQuestionsLoaded(true);
  }

  const handleStartOrResumeClick = async (quizId: number) => {
    const data = await startOrResumeQuiz(quizId);
    const quizHash = data?.startOrResumeQuiz?.quizHash?.quizHashId;
    await getQuestions(quizHash);
    setQuizHashId(quizHash);
  };

  // To submit selected answer for question
  const submitAnswer = async (curGrade: number) => {
    await fetch(`/api/quiz/${lesson?.quiz?.id}/quizHash/${quizHashId}/answer`, {
      method: "POST",
      body: JSON.stringify({
        quizHashId: quizHashId,
        // @ts-ignore
        questionId: questions?.currentQuestion?.question?.id,
        // @ts-ignore
        chosenAnswerId: optionChosen.id,
        currentGrade: curGrade,
        lastAttemptedQuestionCount: questions?.currentQuestionCount,
        /*@ts-ignore*/
        token: session?.user?.token,
      }),
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error(err);
        return null;
      });
  };

  // To get selected answer for the question
  const getChosenAnswer = async (questionCount: number) => {
    const chosenOptionData = await fetch(
      //@ts-ignore
      `/api/quiz/${lesson?.quiz?.id}/quizHash/${quizHashId}/answer?question=${questions?.questionSet[questionCount].question.id}`,
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
    setOptionChosen(
      () =>
        chosenOptionData?.quizHashQuestionAnswerForChosenAnswer?.chosenAnswer
    );
  };

  const handleNextClick = async () => {
    let curGrade = currentGrade;
    if (optionChosen) {
      if (
        //@ts-ignore
        optionChosen?.id ==
        //@ts-ignore
        questions?.currentQuestion?.question?.choiceSet.find(
          //@ts-ignore
          (choice) => choice.isCorrect
        )?.id
      ) {
        setCurrentGrade((prev) => {
          curGrade = curGrade + 1;
          return prev + 1;
        });
      }
      await submitAnswer(curGrade);
    }
    await getChosenAnswer(questions?.currentQuestionCount);

    setQuestions((prevState) => {
      return {
        questionSet: prevState?.questionSet,
        // @ts-ignore
        currentQuestion: prevState.questionSet[prevState?.currentQuestionCount],
        currentQuestionCount: prevState.currentQuestionCount + 1,
      };
    });
  };

  // const handlePreviousClick = async () => {
  //   if(optionChosen){
  //     await submitAnswer();
  //   }
  //   await getChosenAnswer(questions?.currentQuestionCount - 2);
  //   setQuestions((prevState) => {
  //     return {
  //       questionSet: prevState?.questionSet,
  //       // @ts-ignore
  //       currentQuestion: prevState.questionSet[prevState?.currentQuestionCount - 2],
  //       currentQuestionCount: prevState.currentQuestionCount - 1
  //     }
  //   })
  // }

  // To end quiz
  const handleSubmitQuiz = async () => {
    let curGrade = currentGrade;
    if (optionChosen) {
      if (
        //@ts-ignore
        optionChosen?.id ==
        //@ts-ignore
        questions?.currentQuestion?.question?.choiceSet.find(
          //@ts-ignore
          (choice) => choice.isCorrect
        )?.id
      ) {
        setCurrentGrade((prev) => {
          curGrade = curGrade + 1;
          return prev + 1;
        });
      }

      await submitAnswer(curGrade);
    }
    await fetch(`/api/quiz/${lesson?.quiz?.id}/end-quiz`, {
      method: "POST",
      body: JSON.stringify({
        quizHashId: quizHashId,
        /*@ts-ignore*/
        token: session?.user?.token,
      }),
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error(err);
        return null;
      });
    setQuizEnded(true);
    setStartQuiz(false);
    setResumeQuiz(false);
  };

  if (lesson.lessonType !== "QUIZ") return null;
  return (
    <section className="container m-8">
      <div className="flex flex-col">
        <h1 className="text-xl md:text-2xl font-semibold text-center">
          Quiz Name
        </h1>
        <div className="flex flex-col px-4 mr-4">
          <div className="flex justify-between mr-8">
            <p className="font-semibold">
              Time Required:{" "}
              <span className="font-normal">
                {quizData?.quiz[0].timeRequired} mins
              </span>
            </p>
            {/* @ts-ignore */}
            <p className="font-semibold">
              No. of Questions:{" "}
              <span className="font-normal">
                {
                  //@ts-ignore
                  quizData?.quiz[0].questionSet?.length
                }
              </span>
            </p>
          </div>
        </div>
      </div>

      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button
            className="mt-3 w-full px-5 py-3 border border-transparent rounded-md shadow bg-white text-base font-medium text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-white focus:border-white sm:mt-0 sm:ml-3 sm:w-auto sm:flex-shrink-0"
            onClick={(event) => handleStartOrResumeClick(lesson?.quiz?.id)}
          >
            {resumeQuiz ? "Resume Quiz" : "Start Quiz"}
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content
            className={`data-[state=open]:animate-contentShow fixed top-[50%] left-[50%]  ${
              quizEnded
                ? "h-auto w-auto bg-transparent"
                : "bg-white h-[90vh] w-[96vw] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%) focus:outline-none"
            } translate-x-[-50%] translate-y-[-50%] rounded-lg  p-[25px] _0px_10px_20px_-15px] max-w-full z-50 overflow-y-scroll`}
            style={{ scrollbarWidth: "thin" }}
          >
            {startQuiz && questionsLoaded && (
              <>
                <div className="flex justify-between w-full items-center mb-16">
                  <Dialog.Title className="my-0 ml-16 max-sm:ml-6 font-semibold text-xl max-sm:text-lg">
                    {lesson.quiz.name}
                  </Dialog.Title>
                  {/* <Dialog.Close asChild> */}
                  <button
                    onClick={handleSubmitQuiz}
                    className="text-white text-center sm:py-[0.6rem] max-sm:text-lg items-center justify-center rounded-[4px] px-[15px] max-sm:py-0  font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none bg-gradient-to-br from-red-600 to-red-400 hover:from-red-300 hover:to-red-500 mr-20 max-sm:mr-4"
                  >
                    Submit Quiz
                  </button>
                  {/* </Dialog.Close> */}
                </div>
                <div className="flex flex-col">
                  <div className="mb-4 -mt-6 px-20 max-sm:px-12 ml-4 mr-4 max-sm:ml-0  max-sm:mr-0">
                    <QuizTimer
                      timeRequired={
                        timeRequired ? timeRequired : lesson?.quiz?.timeRequired
                      }
                      onSubmit={handleSubmitQuiz}
                    />
                  </div>
                  <div className="mt-12 mx-auto relative flex w-11/12 flex-col justify-center rounded-xl bg-gray-50 bg-clip-border text-base-content shadow-md pb-6 px-4">
                    <div className="relative mx-4 -mt-12 mb-4 flex flex-col px-6 py-8 overflow-hidden rounded-xl bg-gradient-to-br from-blue-700 to-blue-400 bg-clip-border text-white shadow-lg shadow-blue-500/40 text-wrap">
                      {/*@ts-ignore*/}
                      <h1 className="block leading-snug text-white antialiased text-lg max-sm:text-md font-semibold max-sm:text-left ">
                        <span className="px-1 max-sm:px-0 mr-2 max-sm:mr-1 py-[0.15rem] max-sm:text-left text-center font-semibold">
                          Q{questions?.currentQuestionCount}.
                        </span>
                        {/*@ts-ignore*/}
                        {questions?.currentQuestion?.question?.questionText}
                      </h1>
                      <div className="max-w-3xl object-contain self-center mt-2">
                        {
                          /*@ts-ignore*/
                          questions?.currentQuestion?.question?.figure && (
                            <img
                              className="block rounded-md"
                              //@ts-ignore
                              src={`${process.env.NEXT_PUBLIC_MEDIA_CDN}/static/media/${questions?.currentQuestion?.question?.figure}`}
                              alt={
                                /*@ts-ignore*/
                                questions?.currentQuestion?.question
                                  ?.questionText
                              }
                            />
                          )
                        }
                      </div>
                    </div>
                    <div className="grid max-sm:grid-cols-1 grid-cols-2 ">
                      {
                        // @ts-ignore
                        questions?.currentQuestion?.question?.choiceSet.map(
                          // @ts-ignore
                          (choice, index) => (
                            <div
                              key={choice.id}
                              className={`rounded-xl ${
                                optionChosen != choice
                                  ? "bg-white text-base-content hover:-translate-y-1 transition-transform hover:bg-gray-100 border-gray-400"
                                  : "bg-blue-700 text-white shadow-blue-500/40 hover:-translate-y-1 transition-transform border-blue-400"
                              }  bg-clip-border shadow-lg my-3 mx-6 py-4 font-semibold cursor-pointer inline border-b-2 `}
                              onClick={() => setOptionChosen(choice)}
                            >
                              <p className="text-md px-4">
                                {choice?.choiceText}
                              </p>
                            </div>
                          )
                        )
                      }
                    </div>
                    <div className="flex max-sm:flex-col flex-row-reverse mt-3 justify-evenly">
                      {/* <button
            className = {`mt-3 mr-2 px-3 py-2 border border-transparent rounded-md shadow bg-gradient-to-tr from-indigo-600 to-indigo-400 text-base font-medium text-white hover:from-indigo-500 hover:to-indigo-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-white sm:mt-0 sm:ml-3 flex-shrink
            ${(questions?.currentQuestionCount <= 1) && "hidden"}`}
            onClick={handlePreviousClick}

            >
              Previous Question
            </button> */}
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
              </>
            )}
            {quizEnded && (
              <div className="flex flex-col w-full items-center justify-center">
                <div className="relative max-w-96 max-sm:max-w-[90vw] min-h-[32rem] max-sm:min-h-72 flex flex-col bg-clip-border bg-white text-gray-700 shadow-md px-5 py-20 max-sm:py-5 max-sm:px-10 rounded-xl border border-slate-200">
                  <div className="flex flex-col justify-center text-center gap-4 px-2">
                    <CheckCircledIcon className="h-24 w-24 max-sm:h-16 max-sm:w-16 text-green-400 text-center self-center" />
                    <p className="text-2xl max-sm:text-lg font-semibold ml-1 leading-relaxed">
                      Quiz submitted successfully.
                    </p>
                  </div>
                  <hr className="my-4 border-gray-400 mx-auto h-2 w-[80%]" />
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
                  <Dialog.Close asChild>
                    <button
                      className=" hover:bg-gray-300 focus:shadow-gray-200 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                      aria-label="Close"
                      onClick={(e) => {
                        setQuizEnded(false);
                        setCurrentGrade(0);
                        setQuestionsLoaded(false);
                      }}
                    >
                      <Cross2Icon />
                    </button>
                  </Dialog.Close>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
