"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import TestimonialCard from "@/components/testimontial-card";

type Props = {};

function TestimonialMain({}: Props) {
  return (
    <div className="testmonialarea">
      <div className="flex flex-row justify-center gap-2">
        <div className="text-center gap-2">
          <span className="text-primary bg-primary/20 rounded-2xl text-sm font-semibold px-3 py-1">
            Course List
          </span>
          <h2 className="mt-5 text-5xl font-sans font-semibold">
            Client <span className="rock-underline">Testimonial</span>
          </h2>
        </div>
      </div>
      <div className="mt-8">
        <Swiper
          className=""
          modules={[Navigation]}
          navigation
          // spaceBetween={10}
          slidesPerView={2}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            1024: {
              slidesPerView: 2,
            },
          }}
        >
          <SwiperSlide className="pl-12">
            <TestimonialCard
              rating={5}
              className=""
              name="Mrs. Renuka Sharma"
              designation="School Teacher"
              content="As a parent, I am extremely grateful for this online learning platform. It has made my child's learning journey so much more interactive and engaging. The user-friendly interface and comprehensive curriculum have helped my son, Arjun Sharma, grasp complex concepts with ease. Thank you for revolutionizing education!"
            />
          </SwiperSlide>
          <SwiperSlide className="px-12">
            <TestimonialCard
              rating={3}
              className=""
              name="Mr. Ankit Patel"
              designation="IT Professional"
              content="I cannot recommend this virtual learning system enough! My daughter, Aishwarya Patel, has shown tremendous improvement in her academics ever since we started using it. The adaptive learning features and personalized assessments have boosted her confidence and motivated her to excel. I'm truly impressed!"
            />
          </SwiperSlide>
          <SwiperSlide className="px-12">
            <TestimonialCard
              rating={5}
              className=""
              name="Ms. Shalini Khan"
              designation="School Teacher"
              content="Being a teacher, I am always on the lookout for innovative tools to enhance my students' learning experience. This online education platform has been a game-changer in my classroom. The virtual classrooms, collaborative assignments, and instant feedback have transformed the way my students, including Ravi Kumar and Neha Khan, engage with the curriculum. It's truly a teacher's dream come true!"
            />
          </SwiperSlide>
          <SwiperSlide className="px-12">
            <TestimonialCard
              rating={4}
              className=""
              name="Mr. Vikram Rao"
              designation="Businessman"
              content="I have tried several online learning platforms, but none have come close to the effectiveness of this digital education solution. My son, Siddharth Rao, who used to struggle with certain subjects, now tackles them with confidence. The interactive videos, quizzes, and progress tracking features have turned his learning into a fun and rewarding experience. I'm thrilled with the results!"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}

export default TestimonialMain;
