"use client";
import React from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type Props = {
  paymentData: any;
};

export default function GenerateInvoicePDF({ paymentData }: Props) {
  const handleGenerateInvoice = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const headerFontSize = 24;
    const headerColor = rgb(0, 0, 1);

    const drawText = (
      text: string,
      x: number,
      y: number,
      size = fontSize,
      color = rgb(0, 0, 0)
    ) => {
      page.drawText(text, { x, y, size, font, color });
    };

    const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
      page.drawLine({
        start: { x: x1, y: y1 },
        end: { x: x2, y: y2 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    };

    const { user, amount, createdAt, orderGatewayId, status, standard } =
      paymentData;

    const headerText = "INVOICE";
    const headerWidth = font.widthOfTextAtSize(headerText, headerFontSize);
    const headerX = (page.getWidth() - headerWidth) / 2 + 200;
    const headerY = page.getHeight() - 50;
    drawText(headerText, headerX, headerY, headerFontSize, headerColor);
    console.log(headerX);

    // Company Name and Slogan
    const response = await fetch("/img/logo.png");
    const logoArrayBuffer = await response.arrayBuffer();
    const logoPng = await pdfDoc.embedPng(logoArrayBuffer);

    const logoWidth = 200; // Adjust the width as needed
    const logoHeight = (logoPng.height * logoWidth) / logoPng.width;
    page.drawImage(logoPng, {
      x: 50,
      y: 815 - logoHeight,
      width: logoWidth,
      height: logoHeight,
    });

    // Street Address, City, ST, ZIP Code
    drawText("Order No. -", 50, 750);
    drawText(`${orderGatewayId}`, 120, 750);

    // Invoice Detail6
    drawText("Date -", 425, 750);
    drawText(createdAt, 465, 750);
    drawText("Invoice No. -", 425, 730);
    drawText("0001", 495, 730);
    // Bill To
    drawText("Bill To:", 50, 630);
    drawText(`${user.fullName}`, 50, 610);
    drawText(`${user.city},`, 50, 590);
    drawText(` ${user.country}`, 100, 590);
    drawText("Phone No. -", 50, 570);
    drawText(`${user.phoneNumber}`, 120, 570);

    // Table
    const tableTop = 550;
    const tableBottom = 190;
    const tableLeft = 50;
    const tableRight = 550;

    drawLine(tableLeft, tableTop, tableRight, tableTop);
    drawLine(tableLeft, tableBottom, tableRight, tableBottom);
    drawLine(tableLeft, tableTop, tableLeft, tableBottom);
    drawLine(tableRight, tableTop, tableRight, tableBottom);
    drawLine(tableLeft + 400, tableTop, tableLeft + 400, tableBottom);
    drawLine(tableLeft, tableBottom + 330, tableRight, tableBottom + 330);
    drawLine(tableLeft, tableBottom + 30, tableRight, tableBottom + 30);

    // Table Headers
    drawText("Course Purchased", tableLeft + 10, tableTop - 20);
    drawText("Amount Paid", tableLeft + 410, tableTop - 20);

    // Table Rows
    let rowY = tableTop - 50;
    drawText(`Enrolled In ${standard}`, tableLeft + 10, rowY);
    drawText(`Rs. ${amount}`, tableLeft + 410, rowY);

    // Total
    drawText("TOTAL", tableLeft + 10, tableBottom + 10);
    drawText(`Rs.${amount}`, tableLeft + 410, tableBottom + 10);

    // Footer
    drawText(
      "If you have any questions concerning this invoice, Write us at prameyshala@gmail.com",
      50,
      50
    );
    drawText("Thank you for your purchase!", 50, 30);

    const pdfBytes = await pdfDoc.save();
    const pdfUrl = URL.createObjectURL(
      new Blob([pdfBytes], { type: "application/pdf" })
    );

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Invoice.pdf";
    link.click();
  };

  return (
    <button
      onClick={handleGenerateInvoice}
      className="font-medium text-blue-600 hover:underline"
    >
      Get Invoice
    </button>
  );
}
