import { CrawlerState } from '..'
import { JUMIA_BASE_URL } from '../constants'

const crawlNextPage = (crawlerState: CrawlerState, nextPagePath: string) => {
  const nextPageLink = JUMIA_BASE_URL + nextPagePath;
  console.log("[Crawler/Search] Crawling this search page: ", nextPageLink);
  crawlerState.instance?.queue(nextPageLink);
}

export default crawlNextPage
