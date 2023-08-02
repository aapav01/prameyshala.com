"use client";

import React, { useEffect } from "react";
import ReactPlayer from "react-player/lazy";

type Props = {
  lesson: any;
};

export default function VideoPlayer({ lesson }: Props) {
  const [hasWindow, setHasWindow] = React.useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);
  if (!hasWindow) return null;
  if (lesson.lessonType !== "VIDEO") return null;

  if (lesson.platform !== "FILE")
    return (
      <ReactPlayer
        controls
        width={"100%"}
        height={"75vh"}
        url={lesson?.url}
        // url="https://iframe.mediadelivery.net/play/142755/e4bf56d1-8e81-4cbc-aa6d-10142de22171"
        config={{
          youtube: {
            playerVars: { autoplay: 1, showinfo: 0, modestbranding: 1 },
          },
        }}
      />
    );
  else
    return (
      <div style={{ position: "relative", paddingTop: "56.25%" }}>
        <iframe
          src={`https://iframe.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_BUNNYCDN_VIDEO_LIBRARY_ID}/${lesson.platformVideoId}?autoplay=true&loop=false&muted=false&preload=true`}
          loading="lazy"
          style={{
            border: "none",
            position: "absolute",
            top: 0,
            height: "100%",
            width: "100%",
          }}
          allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
          allowFullScreen
        ></iframe>
      </div>
    );
}
