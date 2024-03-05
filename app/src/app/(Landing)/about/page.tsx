import React from "react";
import { CheckCircledIcon, ArrowRightIcon } from "@radix-ui/react-icons";
// Components
import { Button } from "@/components/ui/button";
// NextJs
import Image from "next/image";
import PageHeader from "@/components/page-header";
import { Metadata } from "next";

type Props = {};

export const metadata: Metadata = {
  title: "About Us - Pramey Shala",
  alternates: {
    canonical: "https://prameyshala.com/about",
  },
}

function AboutPage({}: Props) {
  return (
    <main className="min-h-screen">
      <PageHeader
        title={"About Us"}
        breadcrumbs={[
          { title: "Home", href: "/" },
          { title: "About Us" },
        ]}
      />
      <section className="container py-12">
        <div className="flex flex-col lg:flex-row h-full items-center">
          <div className="w-full lg:w-1/2 p-10">
            <div className="mx-auto items-center justify-center flex h-fit mb-12">
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
            <h2 className="text-4xl md:text-6xl font-sans font-bold py-5">
              Welcome to <span className="rock-underline">PrameyShala</span>:
            </h2>
            <div className="text-lg">
              <strong>Empowering Education Through Technology</strong>
              <p>
                At Prameyshala, we believe that education is the key to
                unlocking the full potential of every individual. We are a
                leading educational technology (EdTech) platform dedicated to
                revolutionizing the way students learn and teachers teach. Our
                mission is to make quality education accessible to learners of
                all ages, backgrounds, and locations.
              </p>
              <Button variant={"default"} className="text-lg mt-10 py-6">
                Join For Free
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="container py-12">
        <div className="flex flex-col h-full items-center gap-6">
          <h2 className="text-4xl md:text-6xl font-sans font-bold py-5">
            Why Choose <span className="rock-underline">PrameyShala?</span>
          </h2>
          <div className="w-full">
            <ul className="text-xl py-5 list-decimal grid grid-cols-1 md:grid-cols-2 gap-8 px-5">
              <li>
                <strong>Comprehensive Learning Solutions:</strong> Prameyshala
                offers a wide range of comprehensive learning solutions designed
                to cater to the unique needs of every learner. Whether you are a
                student preparing for competitive exams, an adult seeking to
                upskill, or a professional looking for career advancement, we
                have the right courses and resources for you.
              </li>
              <li>
                <strong>Interactive and Engaging Content:</strong> We understand
                that effective learning happens when students are engaged and
                motivated. That&apos;s why we provide interactive and engaging
                content that combines text, multimedia, and gamification
                elements to make the learning process enjoyable and effective.
              </li>
              <li>
                <strong>Experienced Educators:</strong> Our team of experienced
                educators and subject matter experts ensures that the content we
                provide is accurate, up-to-date, and aligned with the latest
                educational standards. They bring their expertise and passion
                for teaching to create high-quality courses that foster
                conceptual understanding and critical thinking skills.
              </li>
              <li>
                <strong>Personalized Learning Experience:</strong> Prameyshala
                believes in the power of personalized learning. Our platform
                uses advanced algorithms to analyze each learner&aplos;s
                strengths, weaknesses, and learning style to provide
                personalized recommendations and adaptive learning paths. This
                approach allows learners to progress at their own pace and focus
                on areas that need improvement.
              </li>
              <li>
                <strong>Collaborative Learning Community:</strong> Learning is
                not a solitary process, and Prameyshala understands the
                importance of collaboration. We provide a vibrant online
                learning community where students can connect with peers, join
                discussion forums, and participate in group projects. This
                fosters a collaborative learning environment that enhances
                understanding and encourages knowledge sharing.
              </li>
              <li>
                <strong>Continuous Support:</strong> We are committed to
                providing continuous support to our learners throughout their
                educational journey. Our dedicated customer support team is
                available to address any queries or concerns promptly.
                Additionally, we offer regular assessments, progress tracking,
                and feedback mechanisms to help learners gauge their performance
                and make necessary improvements.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;
