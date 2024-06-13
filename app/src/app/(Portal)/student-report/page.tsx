import React from "react";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOption";

// GRAPHQL API - APOLLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";

import { Card } from "@/components/ui/card";
import LineChartComponent from "@/components/ui/charts/line-chart";
import BarChartComponent from "@/components/ui/charts/bar-chart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Initials from "@/lib/initials";

type Props = {
  searchParams: { chapterId?: number };
};

const query = gql`
  query getGrades {
    grades {
      grade
      quiz {
        name
        id
        lessonSet {
          id
          title
          chapter {
            name
            id
            subject {
              id
              name
            }
          }
        }
      }
      assignment {
        id
        title
        lessonSet {
          id
          title
          chapter {
            id
            name
            subject {
              id
              name
            }
          }
        }
      }
    }
  }
`;

const studentQuery = gql`
  query me {
    me {
      id
      fullName
      email
      city
      country
      createdAt
      phoneNumber
      photo
      enrollmentSet {
        id
        standard {
          createdAt
          name
        }
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

async function getStudentDetails(session: { user: { token: string } }) {
  const { data, errors } = await getClient().query({
    query: studentQuery,
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

export default async function studentgrades({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  // @ts-expect-error
  const data = await getStudentGrades(session);
  // @ts-expect-error
  const studentData = await getStudentDetails(session);

  const chapterId = searchParams.chapterId
    ? searchParams.chapterId.toString()
    : null;
  const showChapterChart = Boolean(chapterId);
  const hasGrades = data?.grades && data.grades.length > 0;

  // Overall Grades Average
  let totalGrade = 0;
  for (let i = 0; i < data?.grades?.length; i++) {
    totalGrade += parseFloat(data?.grades[i]?.grade);
  }
  const averageGrade = totalGrade / data?.grades?.length;

  // Quiz
  const quizGrade = data?.grades
    ?.map(({ grade, quiz, student }: any) => ({ grade, quiz, student }))
    .filter((data: any) => data?.quiz);

  // Assignment
  const assignmentGrade = data?.grades
    ?.map(({ grade, assignment, student }: any) => ({
      grade,
      assignment,
      student,
    }))
    .filter((data: any) => data?.assignment);
  const assignmentchapterGrade = data?.grades
    ?.map(({ grade, assignment }: any) => ({
      grade,
      chapter: assignment ? assignment?.lessonSet[0]?.chapter : null,
    }))
    .filter((data: any) => data?.chapter);
  const assignmentsubjectGrade = data?.grades
    ?.map(({ grade, assignment }: any) => ({
      grade,
      subject: assignment ? assignment?.lessonSet[0]?.chapter?.subject : null,
    }))
    .filter((data: any) => data?.subject);

  // Quiz Chart Data
  const quizChartDataByName = data?.grades
    ?.filter((item: any) => item?.quiz)
    .reduce((acc: any, item: any) => {
      const existingQuiz = acc.find((q: any) => q.name === item?.quiz?.name);
      if (existingQuiz) {
        existingQuiz.grades.push(parseFloat(item?.grade));
      } else {
        acc.push({
          name: item?.quiz?.name,
          grades: [parseFloat(item?.grade)],
        });
      }
      return acc;
    }, []);

  const quizchartDataBySubject = data?.grades
    ?.filter((item: any) => item?.quiz)
    .reduce((acc: any, item: any) => {
      const existingQuiz = acc.find(
        (q: any) => q.name === item?.quiz?.lessonSet[0]?.chapter?.subject?.name
      );
      if (existingQuiz) {
        existingQuiz.grades.push(parseFloat(item?.grade));
      } else {
        acc.push({
          name: item?.quiz?.lessonSet[0]?.chapter?.subject?.name,
          grades: [parseFloat(item?.grade)],
        });
      }
      return acc;
    }, []);

  const avgquizgradesbysubject = quizchartDataBySubject?.map(
    ({ name, grades }: any) => {
      const averageGrade = (
        grades.reduce((acc: any, grade: any) => acc + grade, 0) / grades.length
      ).toFixed(2);
      return {
        name,
        grade: averageGrade,
      };
    }
  );

  const quizchartDataByChapter = data?.grades
    ?.filter((item: any) => item?.quiz)
    .reduce((acc: any, item: any) => {
      const existingQuiz = acc.find(
        (q: any) => q.name === item?.quiz?.lessonSet[0]?.chapter?.name
      );
      if (existingQuiz) {
        existingQuiz.grades.push(parseFloat(item?.grade));
      } else {
        acc.push({
          name: item?.quiz?.lessonSet[0]?.chapter?.name,
          grades: [parseFloat(item?.grade)],
        });
      }
      return acc;
    }, []);

  const highestQuizGradesbyChapter = quizchartDataByChapter?.map(
    ({ name, grades }: any) => ({
      name,
      grade: Math.max(...grades),
    })
  );

  // Filtered data for the specific chapter
  const filteredGrades = chapterId
    ? data?.grades.filter(
      (grade: any) =>
        grade?.quiz?.lessonSet[0]?.chapter?.id.toString() === chapterId
    )
    : [];

  const quizChartDataForChapter = filteredGrades.reduce(
    (acc: any, item: any) => {
      const existingQuiz = acc.find((q: any) => q.name === item?.quiz?.name);
      if (existingQuiz) {
        existingQuiz.grades.push(parseFloat(item?.grade));
      } else {
        acc.push({
          name: item?.quiz?.name,
          grades: [parseFloat(item?.grade)],
        });
      }
      return acc;
    },
    []
  );

  const chapterChartData = quizChartDataForChapter.map(
    ({ name, grades }: any) => {
      const chartFormattedData = grades.map((grade: any, index: number) => ({
        name,
        grade,
        attempt: `Attempt ${index + 1}`,
      }));
      return chartFormattedData;
    }
  );

  return (
    <main className="min-h-screen">
      <header className="py-12 bg-indigo-50 relative">
        <div className="container text-foreground">
          <h1 className="text-5xl font-bold">Report Card</h1>
          <p className="text-sm font-thin">Hi, {studentData?.me?.fullName}</p>
        </div>
      </header>
      <section className="container py-12">
        <div className="flex flex-col gap-4 mb-10">
          <div className="relative flex flex-col bg-clip-border bg-transparent text-gray-700 shadow-md p-6 border border-slate-200 grow rounded-xl">
            <div className="relative bg-clip-border overflow-hidden bg-transparent text-gray-700 shadow-none mx-0 mt-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-6 mb-4">
                <Avatar className="lg:min-h-24 lg:min-w-24 lg:text-3xl">
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_MEDIA_CDN}/static/media/${studentData?.me?.photo}`}
                  />
                  <AvatarFallback>
                    {Initials(studentData?.me?.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h5 className="block antialiased tracking-normal font-serif text-xl sm:text-2xl font-semibold leading-snug text-blue-500">
                    {studentData?.me?.fullName}
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
                    {studentData?.me?.email}
                  </p>
                </li>
                <li className="flex items-center gap-4">
                  <p className="block antialiased font-serif text-base sm:text-xl leading-normal text-blue-gray-900 font-semibold capitalize">
                    Phone:
                  </p>
                  <p className="block antialiased font-serif text-base sm:text-xl leading-normal font-normal text-gray-400">
                    {formatPhoneNumber(studentData?.me?.phoneNumber)}
                  </p>
                </li>
                <li className="flex items-center gap-4">
                  <p className="block antialiased font-serif text-base sm:text-xl leading-normal text-blue-gray-900 font-semibold capitalize">
                    Enrolled Class:
                  </p>
                  <p className="block antialiased font-serif text-base sm:text-xl leading-normal font-normal text-gray-400">
                    {studentData?.me?.enrollmentSet?.[0]?.standard?.name}
                  </p>
                </li>
                <li className="flex items-center gap-4">
                  <p className="block antialiased font-serif text-base sm:text-xl leading-normal text-blue-gray-900 font-semibold capitalize">
                    Overall Grade:
                  </p>
                  {averageGrade ? (
                    <p className="block antialiased font-serif text-base sm:text-xl leading-normal font-normal text-gray-400">
                      {averageGrade.toFixed(2)}
                    </p>
                  ) : (
                    <p className="block antialiased font-serif text-base sm:text-xl leading-normal font-normal text-gray-400">
                      No Grades available.
                    </p>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
        {!hasGrades ? (
          <Card className="p-4">
            <h1>No Quiz/Assignments given yet.</h1>
          </Card>
        ) : (
          <div>
            {!showChapterChart && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-col h-full">
                  <Card className="p-6 pl-3 text-xl grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {quizGrade
                      ?.reduce((accumulator: any, gradedata: any) => {
                        const existingIndex = accumulator.findIndex(
                          (item: any) =>
                            item?.quiz?.name === gradedata?.quiz?.name
                        );
                        if (existingIndex !== -1) {
                          accumulator[existingIndex].grades.push(
                            gradedata?.grade
                          );
                        } else {
                          accumulator.push({
                            quiz: gradedata?.quiz,
                            grades: [gradedata?.grade],
                          });
                        }
                        return accumulator;
                      }, [])
                      .map((gradedata: any, index: any) => (
                        <div key={`quiz_${index}`} className="mb-8">
                          <p className="font-serif text-xl sm:text-2xl font-semibold leading-relaxed text-blue-500 mx-2">
                            Attempt wise {gradedata?.quiz?.name} grades
                          </p>
                          <hr className="border-blue-gray-50 " />
                          <ul className="mx-2 pt-4 text-lg sm:text-xl">
                            <li>
                              Grades:
                              {gradedata?.grades?.map(
                                (grade: any, attemptIndex: any) => (
                                  <span
                                    key={`grade_${attemptIndex}`}
                                    className={`ml-2 ${grade > 7.5
                                        ? "text-green-500"
                                        : grade >= 5
                                          ? "text-orange-400"
                                          : "text-red-600"
                                      }`}
                                  >
                                    {grade}
                                  </span>
                                )
                              )}
                            </li>
                          </ul>
                          <div className="mt-4">
                            {quizChartDataByName?.map(
                              (data: any, dataIndex: number) => {
                                if (data?.name === gradedata?.quiz?.name) {
                                  let chartFormattedData: {
                                    name: string;
                                    grade: number;
                                    attempt: String;
                                  }[] = [];
                                  for (
                                    let i = 0;
                                    i < data?.grades?.length;
                                    i++
                                  ) {
                                    chartFormattedData.push({
                                      name: data?.name,
                                      grade: data?.grades[i],
                                      attempt: `Attempt ${i + 1}`,
                                    });
                                  }
                                  return (
                                    <LineChartComponent
                                      chartData={chartFormattedData}
                                      key={dataIndex}
                                      XAxisDatakey="attempt"
                                      YAxisDatakey="grade"
                                    />
                                  );
                                }
                                return null;
                              }
                            )}
                          </div>
                        </div>
                      ))}
                  </Card>
                </div>
                <div className="relative flex flex-col bg-clip-border bg-transparent text-gray-700 shadow-md p-6 border border-slate-200 grow rounded-xl">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Chapter Wise Quiz Grades
                  </h2>
                  <div className="bg-white p-4 rounded shadow-md">
                    <LineChartComponent
                      chartData={highestQuizGradesbyChapter}
                      XAxisDatakey="name"
                      YAxisDatakey="grade"
                    />
                  </div>
                </div>
                <div className="relative flex flex-col bg-clip-border bg-transparent text-gray-700 shadow-md p-6 border border-slate-200 grow rounded-xl">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Subject Wise Quiz Grades (Average)
                  </h2>
                  <div className="bg-white p-4 rounded shadow-md">
                    <BarChartComponent
                      chartData={avgquizgradesbysubject}
                      XAxisDatakey="name"
                      YAxisDatakey="grade"
                    />
                  </div>
                </div>
              </div>
            )}
            {showChapterChart && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-col h-full">
                  <Card className="p-6 pl-3 text-xl grid grid-cols-1 sm:grid-cols-1 gap-2">
                    {filteredGrades?.length > 0 ? (
                      filteredGrades
                        ?.reduce((accumulator: any, gradedata: any) => {
                          const existingIndex = accumulator.findIndex(
                            (item: any) =>
                              item?.quiz?.name === gradedata?.quiz?.name
                          );
                          if (existingIndex !== -1) {
                            accumulator[existingIndex].grades.push(
                              gradedata?.grade
                            );
                          } else {
                            accumulator.push({
                              quiz: gradedata?.quiz,
                              grades: [gradedata?.grade],
                            });
                          }
                          return accumulator;
                        }, [])
                        .map((gradedata: any, index: any) => (
                          <div key={`quiz_${index}`} className="mb-8">
                            <p className="font-serif text-xl sm:text-2xl font-semibold leading-relaxed text-blue-500 mx-2">
                              {gradedata?.quiz?.lessonSet[0]?.chapter?.name}{" "}
                              Quiz Grades by Attempt
                            </p>
                            <hr className="border-blue-gray-50 " />
                            <ul className="mx-2 pt-4 text-lg sm:text-xl">
                              <li>
                                Grades:
                                {gradedata?.grades?.map(
                                  (grade: any, attemptIndex: any) => (
                                    <span
                                      key={`grade_${attemptIndex}`}
                                      className={`ml-2 ${grade > 7.5
                                          ? "text-green-500"
                                          : grade >= 5
                                            ? "text-orange-400"
                                            : "text-red-600"
                                        }`}
                                    >
                                      {grade}
                                    </span>
                                  )
                                )}
                              </li>
                            </ul>
                            <div className="mt-4">
                              {chapterChartData?.map(
                                (chartData: any, chartIndex: any) => {
                                  if (
                                    chartData?.[0]?.name ===
                                    gradedata?.quiz?.name
                                  ) {
                                    return (
                                      <LineChartComponent
                                        chartData={chartData}
                                        key={chartIndex}
                                        XAxisDatakey="attempt"
                                        YAxisDatakey="grade"
                                      />
                                    );
                                  }
                                  return null;
                                }
                              )}
                            </div>
                          </div>
                        ))
                    ) : (
                      <div>
                        <h1>No Quiz/Assignment given for this Chapter.</h1>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
