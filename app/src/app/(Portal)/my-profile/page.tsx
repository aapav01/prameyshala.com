import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOption";
import React from "react";

type Props = {};

const query = gql`
  query me {
    me {
      id
      fullName
      email
      city
      country
      createdAt
      lastLogin
      isActive
      phoneNumber
      photo
      state
      updatedAt
      enrollmentSet {
        id
        standard {
          createdAt
          name
        }
        expirationDate
     }
    }
  }
`;

async function getPaymentDetails(session: any) {
  try {
    const res = await getClient().query({
      query,
      context: {
        headers: {
          Authorization: `JWT ${session.user?.token}`,
        },
      },
    });
    return res as any;
  } catch (error) {
    console.log(error);
    return { error };
  }
}

export default async function MyProfilePage({ }: Props) {
  const session = await getServerSession(authOptions);
  const { data, error } = await getPaymentDetails(session);

  if (error) {
    return <div>Error occurred: {error.message}</div>;
  }

  const lastLogin = data.me?.lastLogin ? new Date(data.me.lastLogin) : null;
  const lastLoginFormatted = lastLogin ? lastLogin.toISOString().split("T").join(" ").split(".")[0] : "";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="container py-4">
      <div className="relative mt-4 h-72 sm:h-96 w-full overflow-hidden rounded-xl bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-red-500/50"></div>
      </div>
      <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-lg mx-3 -mt-16 mb-6 lg:mx-4">
        <div className="p-4">
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="avatar">
                <div className="w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-full shadow-lg shadow-blue-gray-500/40">
                  {data.me?.photo ? (
                    <img
                      src={data.me.photo}
                      width="64px"
                      height="64px"
                      alt={data.me.fullName}
                    />
                  ) : (
                    <img
                      src="https://placehold.co/600x600"
                      width="144px"
                      height="144px"
                      alt={data.me.fullName}
                    />
                  )}
                </div>
              </div>
              <div>
                <h5 className="block antialiased tracking-normal font-serif text-xl sm:text-2xl font-semibold leading-snug text-blue-gray-900">
                  {data.me?.fullName}
                </h5>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 mb-10 px-4">
            <div className="relative flex flex-col bg-clip-border bg-transparent text-gray-700 shadow-md p-8 rounded-xl border border-slate-200">
              <div className="relative bg-clip-border overflow-hidden bg-transparent text-gray-700 shadow-none mx-0 mt-0 flex items-center justify-between gap-4">
                <h6 className="block antialiased tracking-normal font-serif text-xl font-semibold leading-relaxed text-blue-gray-900">
                  Profile Information
                </h6>
                <a className="btn btn-ghost btn-sm btn-square">
                  <i className="fad fa-pencil"></i>
                </a>
              </div>
              <div className="p-0">
                <hr className="my-4 border-blue-gray-50" />
                <ul className="flex flex-col gap-4 p-0">
                  <li className="flex items-center gap-4">
                    <p className="block antialiased font-serif text-sm sm:text-xl leading-normal text-blue-gray-900 font-semibold capitalize">
                      First Name:
                    </p>
                    <p className="block antialiased font-serif text-sm sm:text-xl leading-normal font-normal text-gray-400">
                      {data.me?.fullName}
                    </p>
                  </li>
                  <li className="flex items-center gap-4">
                    <p className="block antialiased font-serif text-sm sm:text-xl leading-normal text-blue-gray-900 font-semibold capitalize">
                      Mobile:
                    </p>
                    <p className="block antialiased font-serif text-sm sm:text-xl leading-normal font-normal text-gray-400">
                      {data.me?.phoneNumber}
                    </p>
                  </li>
                  <li className="flex items-center gap-4">
                    <p className="block antialiased font-serif text-sm sm:text-xl leading-normal text-blue-gray-900 font-semibold capitalize">
                      Email:
                    </p>
                    <p className="block antialiased font-serif text-xs sm:text-xl leading-normal font-normal text-gray-400 whitespace-normal sm:whitespace-nowrap">
                      {data.me?.email}
                    </p>
                  </li>
                  <li className="flex items-center gap-4">
                    <p className="block antialiased font-serif text-sm sm:text-xl leading-normal text-blue-gray-900 font-semibold capitalize">
                      Last Login:
                    </p>
                    <p className="block antialiased font-serif text-sm sm:text-xl leading-normal font-normal text-gray-400">
                      {lastLoginFormatted}
                    </p>
                  </li>
                  <li className="flex items-center gap-4">
                    <p className="block antialiased font-serif text-sm sm:text-xl leading-normal text-blue-gray-900 font-semibold capitalize">
                      Joined On:
                    </p>
                    <p className="block antialiased font-serif text-sm sm:text-xl leading-normal font-normal text-gray-400">
                      {formatDate(data.me?.createdAt)}
                    </p>
                  </li>
                  <li className="flex items-center gap-4">
                    <p className="block antialiased font-serif text-sm sm:text-xl leading-normal text-blue-gray-900 font-semibold capitalize">
                      is Active:
                    </p>
                    <p className="block antialiased font-serif text-sm sm:text-xl leading-normal font-normal text-gray-400">
                      {data.me?.isActive ? "Yes" : "No"}
                    </p>
                  </li>
                  <li className="flex items-center gap-4">
                    <p className="block antialiased font-serif text-sm sm:text-xl leading-normal text-blue-gray-900 font-semibold capitalize">
                      Country:
                    </p>
                    <p className="block antialiased font-serif text-sm sm:text-xl leading-normal font-normal text-gray-400">
                      {data.me?.country}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="px-4 pb-4">
            <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900 mb-2">
              Your Enrolled Courses
            </h6>
            <p className="block antialiased mb-1 font-sans text-sm leading-normal font-normal text-blue-gray-500">
              You have enrolled in {data.me?.enrollmentSet.length || 0} courses
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.me?.enrollmentSet.map((enrolled: any) => (
                <div key={enrolled.id} className="flex flex-col card shadow p-4 gap-1 rounded-xl border border-slate-200">
                  <span className="text-lg sm:text-xl font-bold">{enrolled.standard?.name}</span>
                  <ul className="flex flex-col gap-1 p-0">
                    <li className="flex items-center gap-1">
                      <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-semibold capitalize">Created At:</p>
                      <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-500">{formatDate(enrolled.standard?.createdAt)}</p>
                    </li>
                    <li className="flex items-center gap-1">
                      <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-semibold capitalize">Expiration Date:</p>
                      <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-500">{enrolled.expirationDate}</p>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
