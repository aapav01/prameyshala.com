"use client";

import React, { useEffect } from "react";
// import ReactPlayer from "react-player";
import ReactPlayer from "react-player/lazy";

type Props = {
  lesson: any;
};

export default function LessonSection({ lesson }: Props) {
  const [hasWindow, setHasWindow] = React.useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  return (
    <React.Fragment>
      {hasWindow && (
        <ReactPlayer
          controls
          width={"100%"}
          height={"75vh"}
          url={lesson?.url}
          // url="https://www.youtube.com/watch?v=Zel2xhSTCP8"
          config={{
            youtube: {
              playerVars: { autoplay: 1, showinfo: 0, modestbranding: 1 },
            },
          }}
        />
      )}
    </React.Fragment>
  );
}
