"use client";

import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider"
import { Label } from "../ui/label";

type Props = {
  file: string;
};

export default function Assignment({ file }: Props) {
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number[]>([1.5]);

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

  return (
    <div className="m-4 p-4 rounded-2xl shadow-xl border-2">
      <div className=" border-b-2 mb-2 pb-4">
        <h2 className="text-2xl font-bold font-sans">Assignment</h2>
        <NavigationBar />
      </div>
      {/* Render PDF Here */}
      <div className=" border-t-2 mt-2 pt-4">
        <NavigationBar />
      </div>
    </div>
  );
}
