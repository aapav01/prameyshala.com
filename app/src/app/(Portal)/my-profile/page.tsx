import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOption";
import React from "react";
import GenerateInvoicePDF from "@/components/invoice-link";

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
      paymentsSet {
        amount
        createdAt
        id
        orderGatewayId
        method
        status
        standard {
        name
      }
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
    return { error };
  }
}

export default async function MyProfilePage({ }: Props) {
  const session = await getServerSession(authOptions);
  const { data, errors } = await getPaymentDetails(session);

  const lastLogin = data?.me?.lastLogin ? new Date(data.me.lastLogin) : null;
  let lastLoginFormatted = "";
  if (lastLogin) {
    const year = lastLogin.getFullYear();
    const month = lastLogin.getMonth() + 1;
    const day = lastLogin.getDate();
    const hours = lastLogin.getHours();
    const minutes = lastLogin.getMinutes();
    const seconds = lastLogin.getSeconds();
    const amPM = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    lastLoginFormatted = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year} ${formattedHours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds} ${amPM}`;
  }

  const formatDate = (inputDate: any) => {
    const date = new Date(inputDate);
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const formattedDate = `${monthNames[monthIndex]} ${day}, ${year}`;
    return formattedDate;
  };

  return (
    <div className="container py-2 px-0">
      <div className="relative mt-auto h-72 sm:h-96 w-full overflow-hidden rounded-xl bg-cover bg-center max-sm:hidden">
        <div className="absolute inset-0 w-full bg-red-500/50 max-sm:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/profile/cover.png"
            height={720}
            width={1440}
            alt="cover"
            className="-mt-24"
          />
        </div>
      </div>
      <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-lg mx-3 sm:-mt-8 mb-6 lg:mx-4">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row m-2 mb-6 sm:m-6 items-start justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="avatar">
                <div className="w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-full shadow-lg shadow-blue-gray-500/40">
                  {data?.me?.photo ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_MEDIA_CDN}/static/media/${data?.me?.photo}`}
                      width="144px"
                      height="144px"
                      alt={data?.me?.fullName}
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
                <h5 className="block antialiased tracking-normal font-serif text-xl sm:text-2xl font-semibold leading-snug">
                  {data?.me?.fullName}
                </h5>
                <h2 className="text-gray-400 text-xs sm:text-base"> Last Login : {lastLoginFormatted}</h2>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 sm:px-4">
            <div className="relative flex flex-col bg-clip-border bg-transparent text-gray-700 shadow-md p-6 rounded-xl border border-slate-200">
              <div className="relative bg-clip-border overflow-hidden bg-transparent text-gray-700 shadow-none mx-0 mt-0 flex items-center justify-between gap-4">
                <h6 className="block antialiased tracking-normal font-serif text-xl font-semibold leading-relaxed text-blue-gray-900">
                  Profile Information
                </h6>
              </div>
              <div className="p-0">
                <hr className="my-4 border-gray-200" />
                <ul className="flex flex-col gap-4 antialiased font-serif leading-normal text-base sm:text-lg">
                  <li className="flex items-center gap-4">
                    <p className="text-blue-gray-900 font-semibold capitalize">
                      Mobile:
                    </p>
                    <p className="font-normal text-gray-400">
                      {data?.me?.phoneNumber}
                    </p>
                  </li>
                  <li className="flex items-center gap-4">
                    <p className="text-blue-gray-900 font-semibold capitalize">
                      Email:
                    </p>
                    <p className="font-normal text-gray-400 whitespace-normal sm:whitespace-nowrap">
                      {data?.me?.email}
                    </p>
                  </li>
                  <li className="flex items-center gap-4">
                    <p className="text-blue-gray-900 font-semibold capitalize">
                      Enrolled Class:
                    </p>
                    <p className="font-normal text-gray-400">
                      {data?.me?.enrollmentSet[0].standard.name}
                    </p>
                  </li>
                  <li className="flex items-center gap-4">
                    <p className="text-blue-gray-900 font-semibold capitalize">
                      Joined On:
                    </p>
                    <p className="font-normal text-gray-400">
                      {formatDate(data?.me?.createdAt)}
                    </p>
                  </li>
                  <li className="flex items-center gap-4">
                    <p className="text-blue-gray-900 font-semibold capitalize">
                      City:
                    </p>
                    <p className="font-normal text-gray-400">
                      {data?.me?.city}
                    </p>
                  </li>
                  <li className="flex items-center gap-4">
                    <p className="text-blue-gray-900 font-semibold capitalize">
                      Country:
                    </p>
                    <p className="font-normal text-gray-400">
                      {data?.me?.country}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative flex flex-col bg-clip-border bg-transparent text-gray-700 shadow-md p-5 rounded-xl border border-slate-200">
              <div className="relative bg-clip-border overflow-hidden bg-transparent text-gray-700 shadow-none mx-0 mt-0 flex items-center justify-between gap-4">
                <h6 className="block antialiased tracking-normal font-serif text-xl font-semibold leading-relaxed text-blue-gray-900">
                  Payment History
                </h6>
              </div>
              <div className="p-0">
                <hr className="my-5 border-gray-200" />
                <div>
                  <div className="relative overflow-x-auto shadow-md sm:rounded-md">
                    {/* @ts-ignore */}
                    {data?.me?.paymentsSet && data?.me?.paymentsSet.filter(payment => payment.status === "PAID").length > 0 ? (
                      <table className="w-full text-xs sm:text-base text-left rtl:text-right text-gray-500">
                        <thead className="text-xs sm:text-base text-gray-700 title bg-gray-50">
                          <tr className="bg-gray-100">
                            <th align="center" scope="col" className="px-2 sm:px-3 py-2 sm:py-4">Date</th>
                            <th align="center" scope="col" className="px-2 sm:px-3 py-2 sm:py-4">Class Enrolled</th>
                            <th align="center" scope="col" className="px-2 sm:px-3 py-2 sm:py-4">Status</th>
                            <th align="center" scope="col" className="px-2 sm:px-3 py-2 sm:py-4">Amount</th>
                            <th align="center" scope="col" className="px-2 sm:px-3 py-2 sm:py-4">Action</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-600">
                          {/* @ts-ignore */}
                          {data?.me?.paymentsSet.filter(payment => payment.status === "PAID").slice(0).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5).map((payment, index) => (
                            <tr key={index} className="odd:bg-white even:bg-gray-50 border-b">
                              <td align="center" className="pl-2 sm:pl-3 py-2 sm:py-3">{formatDate(payment?.createdAt)}</td>
                              <td align="center" scope="col" className="px-2 sm:px-3 py-2 sm:py-3">{payment?.standard?.name}</td>
                              <td align="center" scope="col" className="px-2 sm:px-3 py-2 sm:py-3">{payment?.status}</td>
                              <td align="center" scope="col" className="px-2 sm:px-3 py-2 sm:py-3">₹ {payment?.amount}</td>
                              <td align="center" scope="col" className="px-2 sm:px-3 py-2 sm:py-3">
                                <GenerateInvoicePDF paymentData={[payment]} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-gray-400 ">Not Enrolled in any classes.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="sm:px-4 pb-4">
            <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900 mb-2">
              Your Enrolled Courses
            </h6>
            <p className="block antialiased mb-1 font-sans text-sm leading-normal font-normal text-blue-gray-500">
              You have enrolled in {data?.me?.enrollmentSet.length || 0} courses
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data?.me?.enrollmentSet.map((enrolled: any) => (
                <div
                  key={enrolled.id}
                  className="flex flex-col shadow p-4 gap-1 rounded-xl border border-slate-200"
                >
                  <span className="text-lg sm:text-xl font-bold">
                    {enrolled?.standard?.name}
                  </span>
                  <ul className="flex flex-col gap-1 p-0">
                    <li className="flex items-center gap-1">
                      <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-semibold capitalize">
                        Created At:
                      </p>
                      <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-500">
                        {formatDate(enrolled?.standard?.createdAt)}
                      </p>
                    </li>
                    <li className="flex items-center gap-1">
                      <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-semibold capitalize">
                        Expiration Date:
                      </p>
                      <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-500">
                        {formatDate(enrolled?.expirationDate)}
                      </p>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
