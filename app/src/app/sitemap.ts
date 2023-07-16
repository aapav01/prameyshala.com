import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://prameyshala.com',
      lastModified: new Date(),
    },
    {
      url: 'https://prameyshala.com/about',
      lastModified: new Date(),
    },
    {
      url: 'https://prameyshala.com/privacy-policy',
      lastModified: new Date("2023-07-11T18:30:00.000Z"),
    },
    {
      url: 'https://prameyshala.com/refund-policy',
      lastModified: new Date("2023-07-11T18:30:00.000Z"),
    },
    {
      url: 'https://prameyshala.com/terms-and-conditions',
      lastModified: new Date("2023-07-11T18:30:00.000Z"),
    },
  ]
}
