"use client";

import React, { useContext, useState } from "react";
import { QuizContext } from "@/contexts/quiz";

type Props = {
  lesson: any;
};

export default function Quiz({ lesson }: Props) {
  const { questions, setQuestions } = useContext(QuizContext);
  const { gameState, setGameState } = useContext(QuizContext);
  const { counter, setCounter } = useContext(QuizContext);
  const { score, setScore } = useContext(QuizContext);

  const [currQuestion, setCurrQuestion] = useState(0);
  const [optionChosen, setOptionChosen] = useState("");
  const [questionCounter, setQuestionCounter] = useState(1);

  if (lesson.lessonType !== "QUIZ") return null;

  return <div>quiz</div>;
}
