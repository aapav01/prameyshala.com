import React from "react";

type Props = {};

export default function PrivacyPolicy({}: Props) {
  return (
    <main className="min-h-screen">
      <header className="py-36 bg-indigo-50 relative">
        <div className="container text-center text-foreground">
          <h1 className="text-3xl md:text-6xl font-bold">Privacy Policy</h1>
          <ul className="block font-normal text-lg">
            <li className="inline-block mt-2">
              <a href="/" className="after:p-1 after:content-['›']">
                Home
              </a>
            </li>
            <li className="inline-block">Privacy Policy</li>
          </ul>
        </div>
      </header>
      <section className="container py-12">
        <div className="prose text-lg max-w-5xl">
          <h2>Privacy Policy</h2>
          <strong>Effective Date: [11-07-2023]</strong>
          <p>
            This Privacy Policy (&quot;Policy&quot;) outlines the privacy
            practices of Prameyshala, an educational technology platform
            operated by Webkolek, a sole proprietor firm registered in India
            (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). This Policy
            explains how we collect, use, store, and disclose your personal
            information when you access or use our website, mobile application,
            or any other service provided by Prameyshala (collectively referred
            to as the &quot;Platform&quot;).
          </p>
          <p>
            By accessing or using the Platform, you acknowledge that you have
            read, understood, and agree to be bound by this Policy. If you do
            not agree with this Policy, please refrain from accessing or using
            the Platform.
          </p>
          <p>
            <strong>Information We Collect</strong>
            <br />
            We may collect the following categories of personal information
            about you:
          </p>
          <p>
            1.1 Information You Provide: When you register for an account, we
            may collect your name, email address, contact number, and other
            information you voluntarily provide.
          </p>
          <p>
            1.2 Usage Information: We may collect information about how you
            interact with the Platform, including your IP address, device
            information, browser type, and operating system.
          </p>
          <p>
            1.3 Cookies and Similar Technologies: We may use cookies and similar
            technologies to collect information about your activities on the
            Platform. This helps us personalize and enhance your experience on
            the Platform. You can manage your cookie preferences through your
            browser settings.
          </p>
          <p>
            1.4 Third-Party Services: We may receive information from
            third-party services that you authorize, such as social media
            platforms or payment processors.
            <br />
          </p>
          <p>
            <strong>Use of Information</strong>
            <br />
            We may use the collected information for the following purposes:
          </p>
          <p>
            2.1 Providing and Improving the Platform: We use your information to
            operate, maintain, and enhance the functionality of the Platform and
            to provide personalized experiences.
          </p>
          <p>
            2.2 Communication: We may use your contact information to
            communicate with you, respond to your inquiries, provide technical
            support, and send you administrative messages and updates related to
            the Platform.
          </p>
          <p>
            2.3 Analytics and Research: We may analyze the usage of the Platform
            to understand trends, user preferences, and to improve our services.
            This analysis is performed in an aggregated and anonymized manner.
          </p>
          <p>
            2.4 Legal Compliance: We may use your information to comply with
            applicable laws, regulations, or legal obligations.
          </p>
          <p>
            <strong>Data Sharing and Disclosure</strong>
            <br />
            We may share your personal information in the following
            circumstances:
          </p>
          <p>
            3.1 Service Providers: We may engage third-party service providers
            who assist us in operating the Platform and provide necessary
            services. These providers have access to your information only to
            perform specific tasks on our behalf and are obligated to protect
            your information.
          </p>
          <p>
            3.2 Legal Requirements: We may disclose your information if required
            by law, regulation, legal process, or government request, or if we
            believe it is necessary to protect our rights, property, or safety,
            or the rights, property, or safety of others.
          </p>
          <p>
            3.3 Business Transfers: In the event of a merger, acquisition, or
            sale of all or a portion of our assets, your information may be
            transferred to the acquiring entity.
          </p>
          <p>
            <strong>Data Retention and Security</strong>
            <br />
            We will retain your personal information for as long as necessary to
            fulfill the purposes outlined in this Policy, unless a longer
            retention period is required or permitted by law. We implement
            reasonable security measures to protect your information from
            unauthorized access, loss, misuse, or alteration. However, please be
            aware that no method of transmission over the internet or electronic
            storage is 100% secure.
          </p>

          <p>
            <strong>Your Rights and Choices</strong>
            <br />
            You have the right to access, correct, or delete the personal
            information we hold about you. You can exercise these rights by
            contacting us using the information provided below. Please note that
            we may need to retain certain information as required by law or for
            legitimate business purposes.
          </p>

          <p>
            <strong>Children&apos;s Privacy</strong>
            <br />
            The Platform is not intended for children under the age of 13. We do
            not knowingly collect or solicit personal information from children.
            If we become aware that we have collected personal information from
            a child under the age of 13, we will take steps to promptly delete
            the information.
          </p>

          <p>
            <strong>Changes to this Policy</strong>
            <br />
            We may update this Policy from time to time. We will notify you of
            any material changes by posting the updated Policy on the Platform
            or by sending you a notification. Please review this Policy
            periodically for any updates.
          </p>
          <p>
            <strong>Contact Us</strong>
            <br />
            If you have any questions, concerns, or requests regarding this
            Policy or our privacy practices, please contact us at:
            <br />
            <address>prameyshala@gmail.com</address>
            We will endeavour to respond to your inquiries in a timely manner.
          </p>
          <p>
            By using the Prameyshala Platform, you acknowledge and agree to the
            collection, use, and disclosure of your personal information as
            described in this Policy.
          </p>
        </div>
      </section>
    </main>
  );
}
