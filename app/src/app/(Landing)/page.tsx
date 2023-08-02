import Image from "next/image";
import { CheckCircledIcon } from "@radix-ui/react-icons";
// Components
import { Button } from "@/components/ui/button";
// Assets
import content_2 from "@/svg/10044566_4117341.svg";
import TestimonialMain from "@/components/testimontial-main";
import PopularCategory from "@/components/sections/popular-category";
import SetupOtp from "@/components/sections/setup-otp";


export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="mx-4 md:mx-12 py-8 md:py-28 bg-primary-deep rounded-xl shadow-lg">
        <div className="container">
          <div className="flex flex-col lg:flex-row h-full items-center relative">
            <div className="w-full lg:w-1/2">
              <span className="text-secondary uppercase text-sm md:text-lg font-semibold">
                EDUCATION SOLUTION
              </span>
              <h1 className="text-background text-3xl md:text-6xl font-sans font-bold pb-1 md:pb-5">
                Elevate your academic performance with personalized learning
                experiences
              </h1>
              <SetupOtp />
            </div>
            <div className="w-full lg:w-1/2">
              <div className="mx-auto items-center justify-center flex h-fit">
                <Image
                  src="/img/young-student.png"
                  height={512}
                  width={505}
                  className="absolute"
                  loading="lazy"
                  alt=""
                />
                <Image
                  height={544}
                  width={515}
                  loading="lazy"
                  src="/img/about/about_8.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <svg
            className="left-[50%] bottom-[15%] h-5 w-5 animate-spin absolute ease-out"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.5961 10.265L19 1.33069L10.0022 3.73285L1 6.1306L7.59393 12.6627L14.1879 19.1992L16.5961 10.265Z"
              stroke="#FFB31F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="top-[20%] left-[5%] animate-pulse absolute"
            src="/img/herobanner/herobanner__6.png"
            alt=""
          />
          <span className="bottom-[15%] right-[5%] bg-gradient-radial from-indigo-600 via-transparent opacity-20 absolute h-96 w-96" />
        </div>
      </section>
      <section className="container py-12">
        <div className="flex flex-col lg:flex-row h-full items-center">
          <div className="w-full lg:w-1/2 p-10">
            <div className="mx-auto items-center justify-center flex h-fit">
              <Image
                src={content_2.src}
                height={320}
                width={320}
                className="h-fit rounded-lg absolute"
                alt="teacher"
              />
              <Image
                height={544}
                width={515}
                src="/img/about/about_8.png"
                alt=""
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <span className="text-secondary bg-secondary/10 px-3 py-1 rounded-2xl text-sm font-semibold">
              About Us
            </span>
            <h2 className="text-3xl md:text-6xl font-sans font-bold py-5">
              Transform Your Learning{" "}
              <span className="rock-underline">Experience</span>
            </h2>
            <div>
              <ul className="text-lg py-5">
                <li className="flex items-baseline">
                  <CheckCircledIcon className="text-primary mr-1" />
                  Learn anytime anywhere
                </li>
                <li className="flex items-baseline">
                  <CheckCircledIcon className="text-primary mr-1" />
                  Top educators
                </li>
                <li className="flex items-baseline">
                  <CheckCircledIcon className="text-primary mr-1" />
                  Doubt solving
                </li>
                <li className="flex items-baseline">
                  <CheckCircledIcon className="text-primary mr-1" />
                  Interactive learning experience
                </li>
                <li className="flex items-baseline">
                  <CheckCircledIcon className="text-primary mr-1" />
                  Unlimited access to structured course
                </li>
                <li className="flex items-baseline">
                  <CheckCircledIcon className="text-primary mr-1" />
                  Progress Tracking
                </li>
              </ul>
              <Button variant={"default"} className="text-lg py-6">
                Join For Free
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Category Section */}
      <PopularCategory />
      <section className="py-28 bg-gradient-to-b from-transparent to-primary/10 testmonialarea">
        <TestimonialMain />
      </section>
    </main>
  );
}
