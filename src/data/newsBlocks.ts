export interface NewsBlockData {
  newsImage: string
  newsHeadline: string
  newsSource: string
  newsDate: string
  href: string
}

export const newsBlocks: NewsBlockData[] = [
  {
    newsImage: story01,
    newsHeadline:
      'Raids on Medical Cannabis Dispensaries Threaten Drug-Testing Services',
    newsSource: 'The Tyee',
    newsDate: 'January 29, 2025',
    href: 'https://thetyee.ca/News/2025/01/30/Raids-Medical-Cannabis-Dispensaries/',
  },
  {
    newsImage: story02,
    newsHeadline:
      'Police raid Vancouver cannabis dispensaries linked to Dana Larsen ',
    newsSource: 'Vancouver Sun',
    newsDate: 'January 28, 2025',
    href: 'https://potheadbooks.com/',
  },
  {
    newsImage: story03,
    newsHeadline:
      'Pot Activist, retailer Dana Larsen sue for not paying supplier',
    newsSource: 'North Shore News',
    newsDate: 'May 31, 2024',
    href: 'https://potheadbooks.com/',
  },
]
