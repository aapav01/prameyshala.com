"use client";

import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

type Props = {
  file: string;
};

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function Assignment({ file }: Props) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className="m-4 p-4 rounded-2xl shadow-xl border-2">
      <h2 className="text-2xl font-bold font-sans">Assignment</h2>
      <Document
        className={"flex w-full items-center justify-center text-2xl"}
        file={`${process.env.NEXT_PUBLIC_MEDIA_CDN}/static/media/${file}`}
        onSourceError={(error) => {alert('Error while retrieving document source! ' + error.message)}}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
}
