"use client";

import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider"
import { Label } from "../ui/label";
import { toast } from "@/components/ui/use-toast";

type Props = {
  file: string,
  type: string,
  lessonId:number;
};
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function Assignment({ file,type,lessonId }: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [scale, setScale] = useState<number[]>([1]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(()=>{
  async function progressSubmit() {
    if (!session?.user) {
      router.push("/login?callbackUrl=" + window.location.href);
      return;
    }
    const progress:number = (pageNumber/numPages);
    const result = await fetch("/api/progress", {
      method: "POST",
      body: JSON.stringify({
        lessonID: lessonId,
        progress: progress,
        /*@ts-ignore*/
        token: session.user.token,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .catch((err) => {
        console.error(err);
      });
    toast({
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-green-900 p-4">
          <code className="text-white">{JSON.stringify(result, null, 2)}</code>
        </pre>
      ),
    });
  }
  if(pageNumber && numPages){
    progressSubmit();
  }
},[pageNumber])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);

  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function NavigationBar() {
    return (
      <div className="flex justify-between items-center">
          <p className="p-1">
            Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
          </p>
          <div className="w-full max-w-2xl">
            <Label>Zoom Level {parseInt(`${scale[0] * 100}`)}%</Label>
            <Slider defaultValue={scale} onValueChange={setScale} min={0.8} max={2} step={0.1} />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              disabled={pageNumber <= 1}
              onClick={previousPage}
            >
              Previous
            </Button>
            <Button
              type="button"
              disabled={pageNumber >= numPages}
              onClick={nextPage}
            >
              Next
            </Button>
          </div>
        </div>
    )
  }

  var source_file = `${process.env.NEXT_PUBLIC_MEDIA_CDN}/static/media/${file}`;
  if (process.env.NODE_ENV === "development") {
    var source_file = `/static/media/${file}`;
  }
  //source_file = `/${file.substring(20)}`;
  return (
    <div className="m-4 p-4 rounded-2xl shadow-xl border-2">
      <div className=" border-b-2 mb-2 pb-4">
        <h2 className="text-2xl font-bold font-sans">{type}</h2>
        <NavigationBar />
      </div>
      <Document
        className={"flex flex-col items-center overflow-x-scroll"}
        file={source_file}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page scale={scale[0]} pageNumber={pageNumber}/>
      </Document>
      <div className=" border-t-2 mt-2 pt-4">
        <NavigationBar />
      </div>
    </div>
  );
}
