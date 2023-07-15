import React from "react";
import { CheckCircledIcon, ArrowRightIcon } from "@radix-ui/react-icons";
// Components
import { Button } from "@/components/ui/button";
// NextJs
import Image from "next/image";

type Props = {};

function AboutPage({}: Props) {
  return (
    <main className="min-h-screen">
      <header className="py-36 bg-indigo-50 relative">
        <div className="container text-center text-foreground">
          <h1 className="text-3xl md:text-6xl font-bold">About Us</h1>
          <ul className="block font-normal text-lg">
            <li className="inline-block">
              <a href="/" className="after:p-1 after:content-['›']">
                Home
              </a>
            </li>
            <li className="inline-block">About Us</li>
          </ul>
        </div>
      </header>
      <section className="container py-12">
        <div className="flex flex-col lg:flex-row h-full items-center">
          <div className="w-full lg:w-1/2 p-10">
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
                className=""
                src="/img/about/about_8.png"
                alt=""
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <span className="text-primary bg-primary/10 px-3 py-1 rounded-2xl text-sm font-semibold">
              About Us
            </span>
            <h2 className="text-4xl font-sans font-bold py-5">
              Welcome to the <span className="rock-underline">Online</span>{" "}
              Learning Center
            </h2>
            <div>
              <p>Meet my startup Edutech agency Webkolek.</p>
              <p>
                Welcome to the Online Learning Center, your premier destination
                for K-12 education in the digital age. With the rapid
                advancement of technology, online learning has emerged as a
                transformative force in the field of education. At our center,
                we are committed to providing a comprehensive and engaging
                online learning experience for students of all ages. In this
                webpage, we will explore the features and benefits of our Online
                Learning Center, showcasing why it is the ideal platform for
                K-12 education.
              </p>
              <ul className="text-lg py-5">
                <li className="flex items-baseline">
                  <CheckCircledIcon className="text-primary mr-1" />
                  Flexible and Convenient Learning
                </li>
                <li className="flex items-baseline">
                  <CheckCircledIcon className="text-primary mr-1" />
                  Comprehensive Curriculum
                </li>
                <li className="flex items-baseline">
                  <CheckCircledIcon className="text-primary mr-1" />
                  Interactive and Engaging Learning Environment
                </li>
                <li className="flex items-baseline">
                  <CheckCircledIcon className="text-primary mr-1" />
                  Personalized Learning Pathways
                </li>
                <li className="flex items-baseline">
                  <CheckCircledIcon className="text-primary mr-1" />
                  Safe and Secure Learning Environment
                </li>
                <li className="flex items-baseline">
                  <CheckCircledIcon className="text-primary mr-1" />
                  Parent and Teacher Engagement
                </li>
                <li className="flex items-baseline">
                  <CheckCircledIcon className="text-primary mr-1" />
                  Continued Professional Development for Educators
                </li>
              </ul>
              <Button variant={"default"} className="text-lg py-6">
                Join For Free
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;
