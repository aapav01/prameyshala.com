import React from "react";

type Props = {
  title: String;
  breadcrumbs: Array<{
    title: String;
    href?: String;
  }>;
};

export default function PageHeader(props: Props) {
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
      </div>
    </header>
  );
}
