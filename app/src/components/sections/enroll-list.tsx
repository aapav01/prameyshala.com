"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ClassCard from "@/components/cards/class-card";

type Props = {};

export default function EnrollList({}: Props) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [enrollList, setEnrollList] = useState([]);

  useEffect(() => {
    async function getEnrollList() {
      try {
        const enrollListData = await fetch("/api/enroll-list", {
          method: "POST",
          body: JSON.stringify({
            // @ts-expect-error
            token: session?.user?.token,
          }),
        }).then((res) => {
          setLoading(false);
          return res.json();
        });
        console.log(enrollListData);
        setEnrollList(enrollListData.myEnrollments);
      } catch (error) {
        console.error(error);
      }
    }
    loading && getEnrollList();
  }, [session, loading]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 py-4 gap-4">
      {/* @ts-ignore */}
      {!loading &&
        enrollList.map((item: any, index: number) => (
          <ClassCard key={index} standard={item.standard} enroll />
        ))}
    </div>
  );
}
