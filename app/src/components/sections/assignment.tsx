"use client";

import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "../ui/button";

type Props = {
  file: string;
};

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function Assignment({ file }: Props) {
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);

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

  var source_file = `${process.env.NEXT_PUBLIC_MEDIA_CDN}/static/media/${file}`;
  if (process.env.NODE_ENV === "development") {
    var source_file = `/static/media/${file}`;
  }

  return (
    <div className="m-4 p-4 rounded-2xl shadow-xl border-2">
      <div className=" border-b-2 mb-2 pb-4">
        <h2 className="text-2xl font-bold font-sans">Assignment</h2>
        <div className="flex justify-between items-center">
          <p className="p-1">
            Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
          </p>
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
      </div>
      <Document
        className={"flex flex-col items-center"}
        file={source_file}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
    </div>
  );
}
