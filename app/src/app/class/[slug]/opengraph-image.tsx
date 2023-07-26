import { ImageResponse } from "next/server";
import { notFound } from "next/navigation";
// GRAPHQL API - APPLOLO
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";

type Props = {
  params: { slug: string };
};

// Image metadata
export const alt = "Pramey Shala";
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

const query = gql`
  query standard_og($slug: String!) {
    standard(slug: $slug) {
      id
      name
    }
  }
`;


async function getData({ params }: Props) {
  try {
    const api_data = await getClient().query({
      query,
      variables: { slug: params.slug },
    });
    return api_data.data;
  } catch (error) {
    return notFound();
  }
}

// Image generation
export default async function Image({ params }: Props) {
  const data = await getData({ params });
  return new ImageResponse(
    (
      <div
        style={{
          background: "#17093e",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
          color: "white",
          fontFamily: "sans-serif",
          fontSize: "24px",
          position: "relative"
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height={88} fill="white" viewBox="0 0 148 24.9">
          <path d="M15.1,11.8c-.3,.6-.7,1.2-1.2,1.7-.7,.8-1.6,1.4-2.5,1.8-1,.5-2.1,.7-3.3,.7s-1.1,0-1.7-.2c-.5-.1-1-.3-1.5-.5,0,0,0,0,0,0v-3.6h0c.2,.2,.3,.4,.5,.5,.4,.4,1,.5,1.5,.4,.3,0,.5-.2,.8-.3,1.5-.9,3-1.7,4.5-2.6,.7-.4,1-1,1-1.7,0-.7-.4-1.2-1-1.6-.8-.5-1.6-.9-2.4-1.4-.7-.4-1.5-.9-2.2-1.3-.5-.3-1-.3-1.5,0-.8,.3-1.2,1-1.2,1.8V15.8c0,1,.1,2.9-.3,3.8-.1,.3-.3,.6-.5,.8s-.4,.4-.6,.6c-.7,.7-1.5,1.4-2.2,2.2,0,0,0,0-.1,.1-.1,0-.6-1-.6-1.1,0-.2-.1-.3-.1-.5V7.5c0-.5,.2-1,.3-1.5,.2-.9,.6-1.7,1.1-2.5,0-.1,.2-.3,.2-.3,0,0,.4-.5,.8-.9,.7-.7,1.5-1.2,1.6-1.3,.5-.3,1-.5,1.6-.7C6.5,0,7.4,0,8.4,0c1.2,0,2.3,.4,3.4,1,.8,.4,1.5,1,2.1,1.6,.3,.3,.6,.7,.8,1.1,0,.1,.2,.2,.2,.4,.3,.6,.6,1.2,.8,1.9,.2,.6,.3,1.2,.3,1.8,0,1.4-.3,2.8-1,4.1h0Z" />
          <path d="M23.3,7.7c.6-.4,1.3-.5,2.1-.5v3.2h-.8c-1,0-1.7,.2-2.1,.7-.5,.4-.7,1.2-.7,2.3v5.9h-3V7.4h3v1.8c.4-.6,.9-1.1,1.5-1.5h0Z" />
          <path d="M27.4,10.1c.5-.9,1.1-1.7,2-2.1,.8-.5,1.7-.7,2.8-.7s1.7,.2,2.3,.5c.7,.4,1.2,.8,1.6,1.3v-1.7h3v11.9h-3v-1.7c-.4,.6-.9,1-1.6,1.4s-1.5,.6-2.3,.6-1.9-.2-2.7-.8c-.8-.5-1.5-1.2-2-2.2-.5-.9-.7-2-.7-3.2s.2-2.3,.7-3.2h0Zm8.2,1.3c-.3-.5-.7-.9-1.2-1.2-.5-.3-1-.4-1.6-.4s-1.1,.1-1.5,.4c-.5,.3-.9,.7-1.1,1.2-.3,.5-.4,1.1-.4,1.8s.2,1.3,.4,1.9c.3,.5,.7,1,1.2,1.2,.5,.3,1,.4,1.5,.4s1.1-.2,1.6-.4,.9-.7,1.2-1.2c.3-.5,.4-1.1,.4-1.9s-.2-1.3-.4-1.9h0Z" />
          <path d="M60.3,8.6c.9,.9,1.3,2.1,1.3,3.7v7h-3v-6.6c0-.9-.2-1.6-.7-2.1-.5-.5-1.1-.7-1.9-.7s-1.5,.2-1.9,.7c-.5,.5-.7,1.2-.7,2.1v6.6h-3v-6.6c0-.9-.2-1.6-.7-2.1-.5-.5-1.1-.7-1.9-.7s-1.5,.2-2,.7c-.5,.5-.7,1.2-.7,2.1v6.6h-3V7.4h3v1.4c.4-.5,.9-.9,1.5-1.2s1.3-.4,2-.4,1.7,.2,2.5,.6,1.3,1,1.7,1.7c.4-.7,1-1.2,1.7-1.7,.7-.4,1.5-.6,2.4-.6,1.4,0,2.6,.5,3.5,1.3h0Z" />
          <path d="M75.4,14.2h-8.7c0,.9,.4,1.5,.9,2s1.2,.7,2,.7,1.9-.5,2.4-1.4h3.2c-.3,1.1-1,2.1-2,2.8-1,.7-2.2,1.1-3.6,1.1s-2.2-.2-3.1-.8c-.9-.5-1.6-1.2-2.1-2.1-.5-.9-.8-2-.8-3.2s.2-2.3,.7-3.2c.5-.9,1.2-1.7,2.1-2.1,.9-.5,1.9-.7,3.1-.7s2.1,.2,3,.7,1.6,1.2,2.1,2.1,.7,1.9,.7,3.1,0,.8,0,1.2h0Zm-3-2.1c0-.8-.3-1.4-.8-1.8-.6-.5-1.2-.7-2-.7s-1.4,.2-1.9,.7c-.5,.5-.8,1.1-.9,1.9h5.6Z" />
          <path d="M89,7.4l-7.4,17.5h-3.2l2.6-5.9-4.8-11.6h3.4l3.1,8.3,3.1-8.3s3.2,0,3.2,0Z" />
          <path fillOpacity={0.7} d="M92.9,18.9c-.8-.3-1.4-.8-1.8-1.4-.4-.6-.7-1.3-.7-2.1h2.1c0,.7,.4,1.3,.9,1.8,.5,.5,1.3,.7,2.2,.7s1.7-.2,2.2-.7c.5-.5,.8-1.1,.8-1.8s-.2-1-.5-1.4c-.3-.4-.7-.6-1.2-.8-.5-.2-1.1-.4-1.9-.6-1-.2-1.8-.5-2.4-.8-.6-.2-1.1-.7-1.5-1.2-.4-.6-.6-1.3-.6-2.2s.2-1.5,.6-2.2c.4-.6,1-1.1,1.7-1.4,.7-.3,1.6-.5,2.6-.5,1.4,0,2.5,.3,3.4,1,.9,.7,1.4,1.6,1.5,2.8h-2.1c0-.6-.4-1.1-.9-1.5-.5-.4-1.2-.6-2.1-.6s-1.5,.2-2,.6-.8,1-.8,1.8,.2,1,.5,1.3,.7,.6,1.1,.8c.5,.2,1.1,.4,1.9,.6,1,.3,1.8,.6,2.4,.8s1.1,.7,1.5,1.2,.6,1.3,.6,2.2-.2,1.4-.6,2.1-1,1.2-1.7,1.6-1.7,.6-2.7,.6-1.9-.2-2.6-.5h0Z" />
          <path fillOpacity={0.7} d="M111.6,7.9c.7,.4,1.3,1,1.7,1.7s.6,1.7,.6,2.8v6.9h-1.9v-6.6c0-1.2-.3-2.1-.9-2.7-.6-.6-1.4-.9-2.4-.9s-1.8,.3-2.5,1-.9,1.6-.9,2.8v6.5h-2V3.4h2v5.8c.4-.6,.9-1.1,1.6-1.4,.7-.3,1.4-.5,2.3-.5s1.7,.2,2.4,.6h0Z" />
          <path fillOpacity={0.7} d="M117.1,10.2c.5-.9,1.2-1.6,2-2.1,.9-.5,1.8-.7,2.9-.7s1.9,.2,2.7,.7c.8,.4,1.3,1,1.7,1.7v-2.1h2v11.7h-2v-2.2c-.4,.7-1,1.3-1.7,1.7s-1.7,.7-2.7,.7-2-.2-2.8-.8c-.8-.5-1.5-1.2-2-2.2-.5-.9-.7-2-.7-3.2s.2-2.2,.7-3.2h0Zm8.7,.8c-.4-.6-.8-1.2-1.4-1.5-.6-.3-1.3-.5-2-.5s-1.4,.2-2,.5c-.6,.3-1.1,.8-1.4,1.5-.4,.6-.5,1.4-.5,2.3s.2,1.7,.5,2.3c.4,.7,.8,1.2,1.4,1.5,.6,.3,1.3,.5,2,.5s1.4-.2,2-.5c.6-.3,1.1-.9,1.4-1.5s.5-1.4,.5-2.3-.2-1.7-.5-2.3Z" />
          <path fillOpacity={0.7} d="M133.5,3.4v15.9h-2V3.4h2Z" />
          <path fillOpacity={0.7} d="M136.8,10.2c.5-.9,1.2-1.6,2-2.1,.9-.5,1.8-.7,2.9-.7s1.9,.2,2.7,.7c.8,.4,1.3,1,1.7,1.7v-2.1h2v11.7h-2v-2.2c-.4,.7-1,1.3-1.7,1.7s-1.7,.7-2.7,.7-2-.2-2.8-.8c-.8-.5-1.5-1.2-2-2.2-.5-.9-.7-2-.7-3.2s.2-2.2,.7-3.2h0Zm8.7,.8c-.4-.6-.8-1.2-1.4-1.5-.6-.3-1.3-.5-2-.5s-1.4,.2-2,.5c-.6,.3-1.1,.8-1.4,1.5-.4,.6-.5,1.4-.5,2.3s.2,1.7,.5,2.3c.4,.7,.8,1.2,1.4,1.5,.6,.3,1.3,.5,2,.5s1.4-.2,2-.5c.6-.3,1.1-.9,1.4-1.5s.5-1.4,.5-2.3-.2-1.7-.5-2.3Z" />
        </svg>
        <span style={{ marginTop: '28px', textTransform: 'capitalize' }}>Elevate your academic performance</span>
        <span style={{ marginTop: '18px', textTransform: 'capitalize', fontSize: '48px' }}>{data.standard.name}</span>
        <svg viewBox="0 0 28 28" fill="none" style={{ position: 'absolute', top: '10%', right: '25%' }} xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.5961 10.265L19 1.33069L10.0022 3.73285L1 6.1306L7.59393 12.6627L14.1879 19.1992L16.5961 10.265Z"
            stroke="#FFB31F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg viewBox="0 0 28 28" fill="none" style={{ position: 'absolute', top: '12%', right: '20%' }} xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.5961 10.265L19 1.33069L10.0022 3.73285L1 6.1306L7.59393 12.6627L14.1879 19.1992L16.5961 10.265Z"
            stroke="#1FB3FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg viewBox="0 0 28 28" fill="none" style={{ position: 'absolute', top: '6%', right: '22%' }} xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.5961 10.265L19 1.33069L10.0022 3.73285L1 6.1306L7.59393 12.6627L14.1879 19.1992L16.5961 10.265Z"
            stroke="#F1138F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg viewBox="0 0 28 28" height={500} fill="none" style={{ position: 'absolute', top: '0%', right: '5%', opacity: 0.2 }} xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 1C7.37258 1 1.99999 6.37258 1.99999 13C1.99999 19.6274 7.37258 25 14 25C20.6274 25 26 19.6274 26 13C26 6.37258 20.6274 1 14 1Z"
            fill="url(#paint0)"
          />
          <defs>
            <radialGradient id="paint0" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(14 13) rotate(90) scale(13.5 13.5)">
              <stop stopColor="#1799ff" />
              <stop offset="1" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>
        <svg viewBox="0 0 28 28" height={500} fill="none" style={{ position: 'absolute', bottom: '-50%', left: '-20%', opacity: 0.2 }} xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 1C7.37258 1 1.99999 6.37258 1.99999 13C1.99999 19.6274 7.37258 25 14 25C20.6274 25 26 19.6274 26 13C26 6.37258 20.6274 1 14 1Z"
            fill="url(#paint0)"
          />
          <defs>
            <radialGradient id="paint0" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(14 13) rotate(90) scale(15 15)">
              <stop stopColor="#1799ff" />
              <stop offset="1" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
