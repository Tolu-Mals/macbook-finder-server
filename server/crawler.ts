import Crawler from 'crawler';

interface MacbookData {
  name: string;
  image: string;
}

const currentMacbooks: MacbookData[] = [];

const crawler = new Crawler({
  maxConnections: 1,
  rateLimit: 2000,
  callback: (error, res, done) => {
    if(error) console.log(done);
    else {
      const $ = res.$;
      const productList = $(".-paxs.row._no-g._4cl-3cm-shs > article");
      productList.each(function (_idx, article) {
        let name = $(article).find('.name').text();
        let image = $(article).find('img').attr('data-src') ?? '';
        let macbookData = { name, image };

        currentMacbooks.push(macbookData);
      });
    }
    console.log(JSON.stringify(currentMacbooks))
    done();
  }
});

crawler.queue("https://www.jumia.com.ng/computers-tablets/apple/?q=macbooks");
