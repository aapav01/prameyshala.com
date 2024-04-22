"use client";
import React, { useEffect, useState } from "react";
import VideoPlayer from "./video-player";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlayIcon } from "@radix-ui/react-icons";
import Image from "next/image";

type props = {};

interface Lesson {
  id: number;
  title: string;
  description: string;
  thumbUrl?: string;
  chapter: {
    subject: {
      standard: {
        slug: string;
        name: string;
      };
      name: string;
    };
  };
}

interface DemoVideoData {
  lessonsByPreview: Lesson[];
}

const getDemoVideos = async () => {
  return await fetch(`/api/demo-video`, {
    method: "GET",
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return null;
    });
};

export default function DemoVideo({ }: props) {
  const [data, setData] = useState<DemoVideoData | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const videosData = await getDemoVideos();
      setData(videosData);
    };
    fetchData();
  }, []);
  return (
    <section className="w-full py-12">
      <div className="container">
        <h2 className="text-4xl font-bold xl:text-5xl lg:leading-10 leading-[50px] font-['hind',_sans-serif] mt-5 mb-5">
          <span className="rock-underline">Lessons</span> Preview
        </h2>
      </div>
      <div className="flex lg:items-center gap-3 max-lg:flex-col w-full">
        <div className="w-full">
          <Swiper modules={[Navigation]} navigation slidesPerView={1} className="max-sm:-mt-20">
            {data &&
              data?.lessonsByPreview &&
              data?.lessonsByPreview.map((lesson: any, index: number) => {
                return (
                  <SwiperSlide key={lesson?.id}>
                    <div className="py-4 w-full flex justify-center">
                      <Dialog modal={true}>
                        <DialogTrigger>
                          <div className="grid md:grid-cols-[1fr_2fr] xl:gap-10 gap-4 w-full container max-sm:mt-20">
                            <div className="bg-white shadow shadow-indigo-300/50 p-4 rounded-lg w-fit flex justify-center items-center relative">
                              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                                <div className="shadow shadow-pink-500/50 bg-pink-600 rounded-full text-white p-2 md:p-6 animate-pulse">
                                  <PlayIcon className="h-10 w-10" />
                                </div>
                              </div>
                              {lesson?.thumbUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  className="rounded-t-lg p-1"
                                  width={630}
                                  height={540}
                                  src={`${process.env.NEXT_PUBLIC_MEDIA_CDN}/static/media/${lesson?.thumbUrl}`}
                                  alt={lesson?.title}
                                />
                              ) : (
                                <Image
                                  src={`/api/og/class/${lesson?.chapter?.subject?.standard?.slug}`}
                                  alt={lesson?.title}
                                  className="rounded"
                                  height={255}
                                  width={401}
                                />
                              )}
                            </div>
                            <div className="flex flex-col max-sm:flex-col-reverse gap-4 text-left max-sm:ml-1">
                              <div className="flex gap-2">
                                <div className="text-blue-800 bg-blue-500/20 px-3 py-1 rounded-lg text font-semibold text-center w-fit">
                                  {lesson?.chapter?.subject?.standard?.name}
                                </div>
                                <div className="text-purple-800 bg-purple-500/20 px-3 py-1 rounded-lg text font-semibold text-center  w-fit">
                                  {lesson?.chapter?.subject?.name}
                                </div>
                              </div>
                              <h4 className="text-xl lg:text-2xl font-bold line-clamp-1">
                                {lesson?.title}
                              </h4>
                              <div className="prose line-clamp-6 hidden md:block">
                                {lesson?.description}
                              </div>
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl">
                          <DialogTitle>{lesson?.title}</DialogTitle>
                          <VideoPlayer lesson={lesson} />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
