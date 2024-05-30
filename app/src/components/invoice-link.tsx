'use client'
import React from "react";
import { jsPDF } from 'jspdf';


type Props = {
  paymentData: any;
}

const GenerateInvoicePDF = ({ paymentData }: Props) => {
  const generateInvoicePDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text('Payment Invoice', 105, 20, { align: 'center' });

    // Line below header
    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25);

    // Client Information
    // paymentData.forEach((payment: any, index: any) => {
    //   doc.setFontSize(12);
    //   doc.text('Client Information:', 10, 35);
    //   doc.setFontSize(10);
    //   doc.text(`Name: ${payment.user.fullName}`, 10, 40);
    //   doc.text('Address: 123 Main Street, City, Country', 10, 45);
    //   doc.text('Email: john.doe@example.com', 10, 50);

    // });

    // Payment Information
    doc.setFontSize(16);
    doc.text('Payment Details:', 10, 60);

    paymentData.forEach((payment: any, index: any) => {
      let y = 70 + (index * 30);
      doc.setFontSize(10);
      doc.text(`Payment ID: ${payment.id}`, 10, y);
      doc.text(`Class Enrolled: ${payment.standard.name}`, 10, y += 5);
      doc.text(`Status: ${payment.status}`, 10, y += 5);
      doc.text(`Amount: ${payment.amount}`, 10, y += 5);
      doc.text(`Created At: ${new Date(payment.createdAt).toLocaleDateString()}`, 10, y += 5);

      // Adding a separator line after each payment entry
      doc.setLineWidth(0.1);
      doc.line(10, y + 5, 200, y + 5);
    });

    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for your business!', 105, 280, { align: 'center' });
    doc.text('If you have any questions about this invoice, please contact', 105, 285, { align: 'center' });
    doc.text('email@example.com', 105, 290, { align: 'center' });

    doc.save('invoice.pdf');
  };

  return (
    <button onClick={generateInvoicePDF} className="font-medium text-blue-600 hover:underline">
      Get Invoice
    </button>
  );
};


export default GenerateInvoicePDF;
