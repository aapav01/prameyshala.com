import PageHeader from "@/components/page-header";
import { Metadata } from "next";
import React from "react";

type Props = {};

export const metadata: Metadata = {
  alternates: {
    canonical: "https://prameyshala.com/refund-policy",
  },
}

export default function RefundPolicy({}: Props) {
  return (
    <main className="min-h-screen">
      <PageHeader
        title={"Refund Policy"}
        breadcrumbs={[
          { title: "Home", href: "/" },
          { title: "Refund Policy" },
        ]}
      />
      <section className="container py-12">
        <div className="prose text-lg max-w-5xl">
          <h2>Refund Policy</h2>
          <strong>Effective Date: [11-07-2023]</strong>
          <p>
            Thank you for choosing Prameyshala, an edtech platform operated by
            Webkolek, a sole proprietor firm. We are committed to providing
            high-quality educational content and services to our users. We
            understand that there may be situations where a refund is necessary,
            and we have established the following refund policy to ensure a fair
            and transparent process for all users.
          </p>
          <strong>Refund Eligibility:</strong>
          <p>
            a. Subscription Plans: Refunds are available for subscription plans
            purchased on Prameyshala if the user meets the following conditions:
          </p>
          <p>
            i. The refund request is made within 7 days from the date of
            purchase.
            <br />
            ii. The user has not accessed or utilized any of the paid content or
            services during the refund period. iii. The user provides a valid
            reason for the refund request.
          </p>
          <p>
            b. Course Purchases: Refunds are available for individual course
            purchases on Prameyshala if the user meets the following conditions:
          </p>
          <p>
            i. The refund request is made within 7 days from the date of
            purchase.
            <br />
            ii. The user has not completed or accessed more than 10% of the
            course content. iii. The user provides a valid reason for the refund
            request.
          </p>
          <strong>Non-Refundable Items:</strong>
          <p>
            a. Consumable Content: Refunds are not available for consumable
            content such as downloadable materials, e-books, or digital
            resources that have been accessed or utilized by the user.
          </p>
          <p>
            b. Promotional and Discounted Offers: Refunds are not available for
            any purchases made through promotional or discounted offers unless
            explicitly stated otherwise in the offer terms and conditions.
          </p>
          <strong>Refund Process:</strong>
          <p>
            a. To initiate a refund request, users must contact our customer
            support team by sending an email to <a href="mailto:info@prameyshala.com">info@prameyshala.com</a> or by
            submitting a refund request through our website within the specified
            time frame.
          </p>
          <p>
            b. The refund request should include the following information: i.
            User&apos;s name and contact details.
            <br />
            ii. Date of purchase.
            <br />
            iii. Order/Transaction ID.
          </p>
          <p>iv. Reason for the refund request.</p>
          <p>
            c. Our customer support team will review the refund request and
            respond within 45 business days to inform the user about the
            eligibility and approval status.
          </p>
          <p>
            d. If the refund is approved, the refund amount will be processed
            using the same payment method used for the original purchase. Please
            note that the processing time may vary depending on the payment
            provider and may take up to 60 business days.
          </p>
          <strong>Dispute Resolution:</strong>
          <p>
            a. If the user is dissatisfied with the refund decision, they may
            contact our customer support team to discuss the matter further. We
            will make reasonable efforts to resolve any disputes or concerns in
            a fair and amicable manner.
          </p>
          <strong>Modifications to the Refund Policy:</strong>
          <p>
            a. Webkolek reserves the right to modify or update this refund
            policy at any time without prior notice. Any changes will be
            effective immediately upon posting the updated policy on the
            Prameyshala website.
          </p>
          <p>
            By using the Prameyshala platform and making a purchase, you
            acknowledge that you have read, understood, and agree to be bound by
            the terms and conditions outlined in this refund policy.
          </p>
          <p>
            If you have any questions or require further assistance, please
            contact our customer support team at <a href="mailto:info@prameyshala.com">info@prameyshala.com</a>.
          </p>
          <p>Thank you for choosing Prameyshala!</p>
        </div>
      </section>
    </main>
  );
}
