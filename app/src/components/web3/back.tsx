"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

const BackButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({onClick, ...props}, ref) => {
    const router = useRouter();
    return (
      <Button {...props} onClick={() => router.back()}>
        <ArrowLeftIcon className="mb-1 mr-1" /> Back
      </Button>
    );
  }
);

BackButton.displayName = "BackButton";

export { BackButton };
