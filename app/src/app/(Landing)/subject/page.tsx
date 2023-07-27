import React from "react";
import ServiceCard from "@/components/service-card";
// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import PageHeader from "@/components/page-header";

type Props = {};

const query = gql`
  {
    categories {
      name
      description
      id
      popular
      subjectSet {
        standard {
          name
          latestPrice
          beforePrice
          slug
          id
        }
      }
    }
  }
`;

export default async function AllCategories({}: Props) {
  const { data } = await getClient().query({ query });
  return (
    <main className="min-h-screen">
      <PageHeader
        title="All Subject"
        breadcrumbs={[{ title: "Home", href: "/" }, { title: "All Subjects" }]}
      />
      <section className="container py-12">
        <div className="w-full mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.categories.map((category: any) => {
            return (
              <ServiceCard
                key={category.id}
                category={category}
                icon={
                  <svg
                    className="service__icon"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g>
                      <path
                        d="M27.9228 12.1644H34.0478C34.3185 12.1644 34.5782 12.0616 34.7696 11.8788C34.9611 11.6959 35.0686 11.4479 35.0686 11.1894C35.0686 10.9308 34.9611 10.6828 34.7696 10.4999C34.5782 10.3171 34.3185 10.2144 34.0478 10.2144H27.9228C27.6521 10.2144 27.3924 10.3171 27.201 10.4999C27.0095 10.6828 26.902 10.9308 26.902 11.1894C26.902 11.4479 27.0095 11.6959 27.201 11.8788C27.3924 12.0616 27.6521 12.1644 27.9228 12.1644Z"
                        fill="#FFB31F"
                      />
                      <path
                        d="M13.0973 12.1388C12.9476 11.925 12.7156 11.7764 12.4517 11.7253C12.1879 11.6742 11.9136 11.7246 11.6885 11.8658L8.62601 13.8158C8.48705 13.9049 8.37319 14.0254 8.29446 14.1665C8.21574 14.3076 8.17456 14.4651 8.17456 14.625C8.17456 14.7849 8.21574 14.9424 8.29446 15.0835C8.37319 15.2246 8.48705 15.3451 8.62601 15.4343L11.6885 17.3843C11.8529 17.4942 12.0493 17.5522 12.25 17.55C12.4681 17.5484 12.6799 17.4801 12.8544 17.3552C13.0289 17.2302 13.1569 17.0552 13.2197 16.8557C13.2825 16.6562 13.2767 16.4427 13.2033 16.2466C13.1298 16.0504 12.9925 15.8819 12.8114 15.7658L11.025 14.625L12.8114 13.4843C13.0352 13.3413 13.1908 13.1197 13.2443 12.8677C13.2979 12.6157 13.245 12.3537 13.0973 12.1388Z"
                        fill="#FFB31F"
                      />
                      <path
                        d="M16.5783 9.75005C16.3157 9.68819 16.0381 9.7284 15.8065 9.86185C15.5749 9.9953 15.4082 10.2111 15.3431 10.4618L13.3014 18.2618C13.2599 18.3898 13.2465 18.5247 13.262 18.6579C13.2775 18.7911 13.3216 18.9198 13.3915 19.036C13.4615 19.1522 13.5557 19.2534 13.6684 19.3332C13.7811 19.4131 13.9099 19.4699 14.0466 19.5C14.1808 19.5347 14.321 19.5429 14.4586 19.524C14.5962 19.5051 14.7283 19.4596 14.8468 19.3902C14.9653 19.3208 15.0677 19.2291 15.1478 19.1205C15.2279 19.012 15.2839 18.889 15.3124 18.759L17.3541 10.959C17.3904 10.8309 17.399 10.697 17.3792 10.5656C17.3594 10.4342 17.3117 10.308 17.2391 10.1948C17.1665 10.0816 17.0704 9.98375 16.9567 9.90728C16.8431 9.8308 16.7143 9.7773 16.5783 9.75005Z"
                        fill="#5F2DED"
                      />
                      <path
                        d="M21.9989 13.8158L18.9364 11.8658C18.7114 11.7246 18.4371 11.6742 18.1732 11.7253C17.9094 11.7764 17.6774 11.925 17.5277 12.1388C17.3799 12.3537 17.3271 12.6157 17.3806 12.8677C17.4342 13.1197 17.5897 13.3413 17.8135 13.4843L19.6 14.625L17.8135 15.7658C17.6325 15.8819 17.4952 16.0504 17.4217 16.2466C17.3482 16.4427 17.3425 16.6562 17.4052 16.8557C17.468 17.0552 17.596 17.2302 17.7705 17.3552C17.9451 17.4801 18.1569 17.5484 18.375 17.55C18.5757 17.5522 18.772 17.4942 18.9364 17.3843L21.9989 15.4343C22.1379 15.3451 22.2518 15.2246 22.3305 15.0835C22.4092 14.9424 22.4504 14.7849 22.4504 14.625C22.4504 14.4651 22.4092 14.3076 22.3305 14.1665C22.2518 14.0254 22.1379 13.9049 21.9989 13.8158Z"
                        fill="#FFB31F"
                      />
                      <path
                        d="M27.9228 16.8072H40.1728C40.4435 16.8072 40.7032 16.7045 40.8946 16.5216C41.0861 16.3388 41.1936 16.0908 41.1936 15.8322C41.1936 15.5736 41.0861 15.3256 40.8946 15.1427C40.7032 14.9599 40.4435 14.8572 40.1728 14.8572H27.9228C27.6521 14.8572 27.3924 14.9599 27.201 15.1427C27.0095 15.3256 26.902 15.5736 26.902 15.8322C26.902 16.0908 27.0095 16.3388 27.201 16.5216C27.3924 16.7045 27.6521 16.8072 27.9228 16.8072Z"
                        fill="#FFB31F"
                      />
                      <path
                        d="M34.0392 19.5H27.451C27.3054 19.5 27.1657 19.5978 27.0628 19.772C26.9598 19.9461 26.902 20.1823 26.902 20.4286C26.902 20.6748 26.9598 20.911 27.0628 21.0852C27.1657 21.2593 27.3054 21.3571 27.451 21.3571H34.0392C34.1848 21.3571 34.3245 21.2593 34.4275 21.0852C34.5304 20.911 34.5883 20.6748 34.5883 20.4286C34.5883 20.1823 34.5304 19.9461 34.4275 19.772C34.3245 19.5978 34.1848 19.5 34.0392 19.5Z"
                        fill="#FFB31F"
                      />
                      <path
                        d="M43.8958 27.3V3.90005C43.8958 3.64146 43.7882 3.39347 43.5968 3.21062C43.4054 3.02777 43.1457 2.92505 42.875 2.92505H6.12496C5.85422 2.92505 5.59456 3.02777 5.40312 3.21062C5.21168 3.39347 5.10413 3.64146 5.10413 3.90005V27.3C4.2919 27.3 3.51294 27.6082 2.93861 28.1568C2.36428 28.7053 2.04163 29.4493 2.04163 30.225C2.04163 31.2594 2.47183 32.2514 3.23761 32.9828C4.00338 33.7142 5.04199 34.125 6.12496 34.125H42.875C43.9579 34.125 44.9965 33.7142 45.7623 32.9828C46.5281 32.2514 46.9583 31.2594 46.9583 30.225C46.9583 29.4493 46.6356 28.7053 46.0613 28.1568C45.487 27.6082 44.708 27.3 43.8958 27.3ZM41.8541 24.375H25.5208V4.87505H41.8541V24.375ZM7.14579 4.87505H23.4791V24.375H7.14579V4.87505ZM42.875 32.175H6.12496C5.58348 32.175 5.06417 31.9696 4.68128 31.6039C4.2984 31.2382 4.08329 30.7422 4.08329 30.225C4.08329 29.9665 4.19084 29.7185 4.38229 29.5356C4.57373 29.3528 4.83338 29.25 5.10413 29.25H18.7629L19.5081 30.6638C19.5929 30.8246 19.7227 30.9598 19.8831 31.0545C20.0434 31.1491 20.2281 31.1995 20.4166 31.2H28.5833C28.7718 31.1995 28.9565 31.1491 29.1168 31.0545C29.2772 30.9598 29.407 30.8246 29.4918 30.6638L30.237 29.25H43.8958C44.1665 29.25 44.4262 29.3528 44.6176 29.5356C44.8091 29.7185 44.9166 29.9665 44.9166 30.225C44.9166 30.7422 44.7015 31.2382 44.3186 31.6039C43.9357 31.9696 43.4164 32.175 42.875 32.175Z"
                        fill="#5F2DED"
                      />
                    </g>
                  </svg>
                }
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}