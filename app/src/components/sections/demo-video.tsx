"use client"
import React, { useEffect, useState } from "react";
import VideoPlayer from "./video-player";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlayIcon } from "@radix-ui/react-icons";
import Image from "next/image";

type props={}

interface Lesson {
  id: number;
  title: string;
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
  return await fetch(`/api/demo-video`,{
    method: "GET",
  })
  .then((res)=>res.json())
  .catch((err)=>{
    console.error(err);
    return null;
  })
};

export default function DemoVideo({}: props) {
  const [data,setData] = useState<DemoVideoData | null>(null);
  useEffect(()=>{
    const fetchData = async () => {
      const videosData = await getDemoVideos();
      setData(videosData);
    }
    fetchData();
  },[])
  return (
    <section className="container">
      <div className="flex lg:items-center gap-3 max-lg:flex-col">
        <div className="md:mb-7 w-full">
          <h2 className="text-4xl font-bold xl:text-5xl lg:leading-10 leading-[50px] font-['hind',_sans-serif] mt-5 mb-5">
          Demo <span className="rock-underline">Lesson</span>
          </h2>
          <Swiper
              className=""
              modules={[Navigation]}
              navigation
              // spaceBetween={10}
              slidesPerView={2}
              breakpoints={{
                320 : {
                  slidesPerView: 1,
                },
                1024: {
                  slidesPerView: 2,
                }
              }}
            >
          {data && data?.lessonsByPreview && data?.lessonsByPreview.map((lesson:any,index:number)=>{
            return (
              <SwiperSlide className="pl-12" key={lesson?.id}>
            <div className="py-4 w-full flex justify-center">
              {/* TODO: Make dialog take whole width of screen. */}
            <Dialog modal={true}>
            <DialogTrigger>
            <div className="w-full relative">
            <div className="bg-white shadow-lg shadow-indigo-300/50 p-4 md:py-10 lg:px-6 rounded-lg">
            <h1 className="font-semibold text-2xl mb-2 -mt-4">{lesson?.title}</h1>
            <div className="mb-2 relative h-fit">
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                  <div className="shadow shadow-pink-500/50 bg-pink-600 rounded-full text-white p-2 md:p-6 animate-pulse">
                    <PlayIcon className="h-10 w-10" />
                  </div>
                </div>
                {
                  lesson?.thumbUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                  <img
                  className="rounded-t-lg p-1"
                  width={630}
                  height={540}
                  src={`${process.env.NEXT_PUBLIC_MEDIA_CDN}/static/media/${lesson?.thumbUrl}`}
                  alt={lesson?.title}
                />
                  ):(
                    <Image
                    src={`/api/og/class/${lesson?.chapter?.subject?.standard?.slug}`}
                    alt={lesson?.title}
                    className="rounded"
                    height={630}
                    width={540}
                  />
                  )
                }
                </div>
                <div className="grid grid-cols-4 gap-2 mt-1">
                <div
                className="text-purple-800 bg-purple-500/20 px-1 py-1 rounded-lg text-xs font-semibold text-center"
              >
                {lesson?.chapter?.subject?.standard?.name}
              </div>
              <div
                className="text-purple-800 bg-purple-500/20 px-1 py-1 rounded-lg text-xs font-semibold text-center"
              >
                {lesson?.chapter?.subject?.name}
              </div>
                </div>
                </div>
                </div>
            </DialogTrigger>
            <DialogContent className="w-[100vw]">
              <DialogTitle>{lesson?.title}</DialogTitle>
              <VideoPlayer lesson={lesson}/>
            </DialogContent>
            </Dialog>
          </div>
          </SwiperSlide>
          )
          })}
          </Swiper>
          </div>
      </div>
    </section>
  )
}
