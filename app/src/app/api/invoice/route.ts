import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOption";

const query = gql`
  query get_payment($paymentId: ID!) {
    payment(id: $paymentId) {
      id
      amount
      method
      createdAt
      orderGatewayId
      paymentGatewayId
      status
      user {
        fullName
        id
      }
      standard {
        name
      }
    }
  }
`;

export default async function handler(req :any , res: any) {
  const { paymentId } = req.query;
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const client = getClient();
    const { data } = await client.query({
      query,
      variables: { paymentId },
    });
    const paymentData = data.payment;
    const PDFDocument = require('pdfkit')
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;

    page.drawText(`Invoice - Payment ID: ${paymentData.id}`, {
      x: 50,
      y: height - 50,
      size: fontSize,
    });
    page.drawText(`Amount: ${paymentData.amount}`, {
      x: 50,
      y: height - 70,
      size: fontSize,
    });
    page.drawText(`Method: ${paymentData.method}`, {
      x: 50,
      y: height - 90,
      size: fontSize,
    });
    page.drawText(`Order Gateway ID: ${paymentData.orderGatewayId}`, {
      x: 50,
      y: height - 110,
      size: fontSize,
    });
    page.drawText(`Payment Gateway ID: ${paymentData.paymentGatewayId}`, {
      x: 50,
      y: height - 130,
      size: fontSize,
    });
    page.drawText(`Status: ${paymentData.status}`, {
      x: 50,
      y: height - 150,
      size: fontSize,
    });
    page.drawText(`User: ${paymentData.user.fullName}`, {
      x: 50,
      y: height - 170,
      size: fontSize,
    });
    page.drawText(`Standard: ${paymentData.standard.name}`, {
      x: 50,
      y: height - 190,
      size: fontSize,
    });

    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${paymentData.id}.pdf`
    );
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
