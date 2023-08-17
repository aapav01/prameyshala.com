import React from "react";
import PageHeader from "@/components/page-header";
import { ServiceCardLoading } from "@/components/service-card";

type Props = {};

export default function LoadingSubjectPublic({}: Props) {
  return (
    <main className="min-h-screen">
      <PageHeader
        title="All Subject"
        breadcrumbs={[{ title: "Home", href: "/" }, { title: "All Subjects" }]}
      />
      <section className="container py-12">
        <p>
          Explore our offerings in IIT, JEE, and NEET preparation, benefit from
          our top-notch online coaching. Seamlessly prepare for exams with our
          comprehensive resources, including formulas and online tutorials. Our
          platform caters to both 10th and 12th board examinations, covering
          various syllabus including CBSE, ICSE, ISC, and UP Board.
        </p>
        <div className="w-full mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ServiceCardLoading />
          <ServiceCardLoading />
          <ServiceCardLoading />
          <ServiceCardLoading />
        </div>
      </section>
    </main>
  );
}
