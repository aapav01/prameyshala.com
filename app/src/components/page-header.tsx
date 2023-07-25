import React from "react";

type Props = {
  title: String;
  breadcrumbs: Array<{
    title: String;
    href?: String;
  }>;
  variant?: 1|2;
  children?: React.ReactNode;
};

export default function PageHeader(props: Props) {
  if (props.variant == 2)
    return (
    <header className="py-12 bg-indigo-50 relative">
      <div className="container text-foreground flex lg:px-32">
        <div className="w-full lg:w-8/12">
          <ul className="block font-sans text-lg">
            {props.breadcrumbs.map((breadcrumb, index) => (
              <li key={index} className="inline-block mt-2">
                {breadcrumb.href ? (
                  <a href={`${breadcrumb.href}`} className="after:p-1 after:content-['›']">
                    {breadcrumb.title}
                  </a>
                ) : (
                  breadcrumb.title
                )}
              </li>
            ))}
          </ul>
          <div className="pt-16 relative z-10">
            <h1 className="text-2xl md:text-4xl font-bold">{props.title}</h1>
            {props.children}
          </div>
        </div>
      </div>
    </header>
    )
  else
    return (
      <header className="py-36 bg-indigo-50 relative">
        <div className="container text-center text-foreground">
          <h1 className="text-3xl md:text-6xl font-bold">{props.title}</h1>
          <ul className="block font-normal text-lg">
            {props.breadcrumbs.map((breadcrumb, index) => (
              <li key={index} className="inline-block mt-2">
                {breadcrumb.href ? (
                  <a href={`${breadcrumb.href}`} className="after:p-1 after:content-['›']">
                    {breadcrumb.title}
                  </a>
                ) : (
                  breadcrumb.title
                )}
              </li>
            ))}
          </ul>
          {props.children}
        </div>
      </header>
    );
}
