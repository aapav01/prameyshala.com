import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOption";
import React from 'react'

type Props = {
  params: {}
}

const query = gql`
 query getGrades {
  grades {
    grade
    quiz {
      name
      id
    }
    assignment {
      id
      title
    }
    student {
      fullName
      email
      photo
      id
    }
    enrolledClass {
      name
    }
  }
}
`;

async function getStudentGrades(session: { user: { token: string } }) {
  const { data, errors } = await getClient().query({
    query: query,
    context: {
      fetchOptions: {
        cache: "no-store",
      },
      headers: {
        Authorization: `JWT ${session?.user?.token}`,
      },
    },
  });

  return data;
}

export default async function studentgrades({ }: Props) {
  const session = await getServerSession(authOptions);
  // @ts-expect-error
  const data = await getStudentGrades(session);


  return (
    <main className="min-h-screen">
      <header className="py-12 bg-indigo-50 relative">
        <div className="container text-foreground">
          <span className="text-xl">Welcome, </span>
          {/* @ts-ignore */}
          <h1 className="text-4xl font-bold">{data?.grades[0].student?.fullName}</h1>
          <p className="text-sm font-thin">{data?.grades[0].student?.email}</p>
        </div>
      </header>
      <section className="container py-12">
        <div className="py-2">
          <h2 className="text-4xl font-medium">
            Student <span className="rock2-underline">Report</span>
          </h2>
        </div>
        <div className="py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <div className="relative flex flex-col bg-clip-border bg-transparent text-gray-700 shadow-md p-8 rounded-xl border border-slate-200">
              <div className="relative bg-clip-border overflow-hidden bg-transparent text-gray-700 shadow-none mx-0 mt-0 flex items-center justify-between gap-4">
                <h6 className="block antialiased tracking-normal font-serif text-2xl font-semibold leading-relaxed text-blue-gray-900">
                  Class Information
                </h6>
              </div>
              <div className="p-0">
                <hr className="my-4 border-blue-gray-50" />
                <ul className="flex flex-col gap-4 p-0">
                  <li className="flex items-center gap-4">
                    <p className="block antialiased font-serif text-sm sm:text-xl leading-normal text-blue-gray-900 font-semibold capitalize">
                      Enrolled Class:
                    </p>
                    <p className="block antialiased font-serif text-sm sm:text-xl leading-normal font-normal text-gray-400">
                      {data.grades[0].enrolledClass.name}
                    </p>
                  </li>
                  <li className="flex items-center gap-4">
                    <p className="block antialiased font-serif text-sm sm:text-xl leading-normal text-blue-gray-900 font-semibold capitalize">
                      Total Grade:
                    </p>
                    <p className="block antialiased font-serif text-sm sm:text-xl leading-normal font-normal text-gray-400">
                      {data.grades[0].grade}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main >
  )
}
