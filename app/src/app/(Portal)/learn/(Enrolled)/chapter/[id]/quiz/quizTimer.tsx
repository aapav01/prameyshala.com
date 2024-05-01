import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { StopwatchIcon } from "@radix-ui/react-icons";
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
    <Card className="px-2 py-1">
      <p className="text-xl max-sm:text-sm max-sm:font-medium">
        <StopwatchIcon className="text-red-500 inline w-5 h-5" />{" "}
        {formatTimeLeft(timeLeft)}
      </p>
    </Card>
  );
};

export default QuizTimer;
