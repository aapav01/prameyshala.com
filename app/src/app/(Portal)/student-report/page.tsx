import React from 'react'
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOption";

// GRAPHQL API - APPOLLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";

import { Card } from '@/components/ui/card';
import LineChartComponent from '@/components/ui/charts/line-chart';


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
      lessonSet{
        id
        title
        chapter{
          name
          id
          subject{
            id
            name
          }
        }
      }
    }
    assignment {
      id
      title
      lessonSet{
        id
        title
        chapter{
          id
          name
          subject{
            id
            name
          }
        }
      }
    }
    student {
      fullName
      photo
      email
      id
      phoneNumber
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

function formatPhoneNumber(phoneNumber: any) {

  const countryCode = phoneNumber.substring(0, 3);
  const areaCode = phoneNumber.substring(3, 7);
  const mainNumber = phoneNumber.substring(7);
  return `${countryCode} ${areaCode}${mainNumber}`;
}

export default async function studentgrades({ }: Props) {
  const session = await getServerSession(authOptions);
  // @ts-expect-error
  const data = await getStudentGrades(session);

  let totalGrade = 0;
  for (let i = 0; i < data.grades.length; i++) {
    totalGrade += parseFloat(data.grades[i].grade);
  }
  const averageGrade = totalGrade / data.grades.length;

  // quiz
  const quizGrade = data?.grades?.map(({ grade, quiz, student }: any) => ({ grade, quiz, student })).filter((data: any) => data.quiz);
  const quizchapterGrade = data?.grades.map(({ grade, quiz }: any) => ({
    grade,
    chapter: quiz ? quiz.lessonSet[0].chapter : null
  })).filter((data: any) => data.chapter);
  const quizsubjectGrade = data?.grades.map(({ grade, quiz }: any) => ({
    grade,
    subject: quiz ? quiz.lessonSet[0].chapter.subject : null
  })).filter((data: any) => data.subject);

  // assignment
  const assignmentGrade = data?.grades?.map(({ grade, assignment, student }: any) => ({ grade, assignment, student })).filter((data: any) => data.assignment);
  const assignmentchapterGrade = data?.grades.map(({ grade, assignment }: any) => ({
    grade,
    chapter: assignment ? assignment.lessonSet[0].chapter : null
  })).filter((data: any) => data.chapter);
  const assignmentsubjectGrade = data?.grades.map(({ grade, assignment }: any) => ({
    grade,
    subject: assignment ? assignment.lessonSet[0].chapter.subject : null
  })).filter((data: any) => data.subject);


  //  Quiz Chart Data
  const quizChartDataByName = data.grades.filter((item: any) => item.quiz).reduce((acc: any, item: any) => {
    const existingQuiz = acc.find((q: any) => q.name === item.quiz.name);
    if (existingQuiz) {
      existingQuiz.grades.push(parseFloat(item.grade));
    } else {
      acc.push({
        name: item.quiz.name,
        grades: [parseFloat(item.grade)]
      });
    }
    return acc;
  }, []);


  const quizchartDataBySubject = data.grades.filter((item: any) => item.quiz).reduce((acc: any, item: any) => {
    const existingQuiz = acc.find((q: any) => {
      return q.name === item.quiz.lessonSet[0].chapter.subject.name
    });
    if (existingQuiz) {
      existingQuiz.grades.push(parseFloat(item.grade));
    } else {
      acc.push({
        name: item.quiz.lessonSet[0].chapter.subject.name,
        grades: [parseFloat(item.grade)]
      });
    }
    return acc;
  }, []);

  const quizchartDataByChapter = data.grades.filter((item: any) => item.quiz).reduce((acc: any, item: any) => {
    const existingQuiz = acc.find((q: any) => {
      return q.name === item.quiz.lessonSet[0].chapter.name
    });
    if (existingQuiz) {
      existingQuiz.grades.push(parseFloat(item.grade));
    } else {
      acc.push({
        name: item.quiz.lessonSet[0].chapter.name,
        grades: [parseFloat(item.grade)]
      });
    }
    return acc;
  }, []);

  const quizFormattedChartData = quizchartDataByChapter.map((data: any) => {
    return ({
      ...data,
      grades: (data.grades.reduce((sum: number, grade: number) => sum + grade, 0) / data.grades.length).toFixed(2),
    })
  })


  const assignchartData = data.grades.filter((item: any) => item.assignment).map((item: any) => ({
    name: item.assignment.title,
    grade: parseFloat(item.grade)
  }));

  return (
    <main className="min-h-screen">
      <header className="py-12 bg-indigo-50 relative">
        <div className="container text-foreground">
          <h1 className="text-5xl font-bold">Report Card</h1>
          <p className="text-sm font-thin">Hi, {data?.grades[0].student?.fullName}</p>
        </div>
      </header>
      <section className="container py-12">
        <div>
          <div className="flex flex-col gap-4 mb-10">
            <div className="relative flex flex-col bg-clip-border bg-transparent text-gray-700 shadow-md p-6 border border-slate-200 grow rounded-xl">
              <div className="relative bg-clip-border overflow-hidden bg-transparent text-gray-700 shadow-none mx-0 mt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-6 mb-4">
                  <div className="avatar">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-full shadow-lg shadow-gray-500/40">
                      {data?.grades[0].student ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_MEDIA_CDN}/static/media/${data?.grades[0].student?.photo}`}
                          width="144px"
                          height="144px"
                          alt={data?.grades[0].student?.fullName}
                        />
                      ) : (
                        <img
                          src="https://placehold.co/600x600"
                          width="144px"
                          height="144px"
                          alt={data?.me?.fullName}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <h5 className="block antialiased tracking-normal font-serif text-xl sm:text-2xl font-semibold leading-snug text-blue-500">
                      {data?.grades[0].student?.fullName}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="p-0">
                <hr className="border-gray-200 max-sm:mb-4" />
                <ul className="flex flex-col gap-4 sm:p-4 p-1">
                  <li className="flex items-center gap-4">
                    <p className="block antialiased font-serif text-base sm:text-xl leading-normal text-blue-gray-900 font-semibold capitalize">
                      Email:
                    </p>
                    <p className="block antialiased font-serif text-base sm:text-xl leading-normal font-normal text-gray-400">
                      {data.grades[0].student.email}
                    </p>
                  </li>
                  <li className="flex items-center gap-4">
                    <p className="block antialiased font-serif text-base sm:text-xl leading-normal text-blue-gray-900 font-semibold capitalize">
                      Phone:
                    </p>
                    <p className="block antialiased font-serif text-base sm:text-xl leading-normal font-normal text-gray-400">
                      {formatPhoneNumber(data.grades[0].student.phoneNumber)}
                    </p>
                  </li>
                  <li className="flex items-center gap-4">
                    <p className="block antialiased font-serif text-base sm:text-xl leading-normal text-blue-gray-900 font-semibold capitalize">
                      Enrolled Class:
                    </p>
                    <p className="block antialiased font-serif text-base sm:text-xl leading-normal font-normal text-gray-400">
                      {data.grades[0].enrolledClass.name}
                    </p>
                  </li>
                  <li className="flex items-center gap-4">
                    <p className="block antialiased font-serif text-base sm:text-xl leading-normal text-blue-gray-900 font-semibold capitalize">
                      Overall Grade:
                    </p>
                    <p className="block antialiased font-serif text-base sm:text-xl leading-normal font-normal text-gray-400">
                      {averageGrade.toFixed(2)}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col h-full">
              <Card className='p-6 text-xl flex-1'>
                {quizGrade.reduce((accumulator: any, gradedata: any) => {
                  const existingIndex = accumulator.findIndex((item: any) => item.quiz.name === gradedata.quiz.name);
                  if (existingIndex !== -1) {
                    accumulator[existingIndex].grades.push(gradedata.grade);
                  } else {
                    accumulator.push({
                      quiz: gradedata.quiz,
                      grades: [gradedata.grade]
                    });
                  }
                  return accumulator;
                }, []).map((gradedata: any, index: any) => (
                  <div key={`quiz_${index}`} className="mb-8">
                    <p className='font-serif text-xl sm:text-2xl font-semibold leading-relaxed text-blue-500 mx-2'>
                      {gradedata.quiz.name}
                    </p>
                    <hr className="border-blue-gray-50 " />
                    <ul className='mx-2 pt-4 text-lg sm:text-xl'>
                      <li>
                        Grades:
                        {gradedata.grades.map((grade: any, attemptIndex: any) => (
                          <span key={`grade_${attemptIndex}`} className={`ml-2 ${grade > 7.5 ? 'text-green-500' : grade >= 5 ? 'text-orange-400' : 'text-red-600'}`}>
                            {grade}
                          </span>
                        ))}
                      </li>
                    </ul>
                    <div className="mt-4">
                      {quizChartDataByName.map((data: any, dataIndex: number) => {
                        if (data.name === gradedata.quiz.name) {
                          let chartFormattedData: {
                            name: string;
                            grade: number;
                            attempt: number;
                          }[] = [];
                          for (let i = 0; i < data.grades.length; i++) {
                            chartFormattedData.push({
                              "name": data.name,
                              'grade': data.grades[i],
                              'attempt': i + 1
                            })
                          }
                          return <LineChartComponent chartData={chartFormattedData} key={dataIndex} />;
                        }
                        return null;
                      })}
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main >
  )
}
