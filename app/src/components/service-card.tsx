import Link from "next/link";
import React, { ReactNode } from "react";

type ServiceCardProps = {
  title: string;
  description?: string;
  passHref: string;
  icon?: ReactNode;
};

function ServiceCard(props: ServiceCardProps) {
  return (
    <div className="single__service">
      {props.icon && (
        <div className="service__img">
          <span className="service__icon">{props.icon}</span>
          <div className="service__bg__img">
            <svg
              className="service__icon__bg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M63.3775 44.4535C54.8582 58.717 39.1005 53.2202 23.1736 47.5697C7.2467 41.9192 -5.18037 32.7111 3.33895 18.4477C11.8583 4.18418 31.6595 -2.79441 47.5803 2.85105C63.5011 8.49652 71.8609 30.2313 63.3488 44.4865L63.3775 44.4535Z"
                fill="#5F2DED"
                fillOpacity="0.05"
              />
            </svg>
          </div>
        </div>
      )}
      <div className="service__content">
        <h3>
          <Link href={props.passHref}>{props.title}</Link>
        </h3>
        {props.description && <p>{props.description}</p>}
      </div>
      <div className="service__small__img">
        <svg fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.5961 10.265L19 1.33069L10.0022 3.73285L1 6.1306L7.59393 12.6627L14.1879 19.1992L16.5961 10.265Z"
            stroke="#FFB31F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default ServiceCard;
