import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeJumiaProduct(url: string){
    if(!url) return;

    const apiKey = process.env.SCRAPER_API_KEY
    const targetUrl = await url
    const searchUrl = `http://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(targetUrl)}`;


    try {
        const response = await axios.get(searchUrl);
        const $ = cheerio.load(response.data);
        let discountPrice = Number(($("span.-ubpt.-fs24.-prxs").text().slice(1)).trim().replace(',', ''));
        const productPrice = Number(($("span.-tal.-gy5.-lthr.-fs16.-pvxs.-ubpt").text().slice(1)).trim().replace(',', ''));
        const title = $("h1.-fs20.-pts.-pbxs").text();
        const imgUrl = $("#imgs a.itm").attr("href") || "";
        const currencySmbol = $("span.-ubpt.-fs24.-prxs").text().slice(0,1); 
        const unitsRemaining = $("p.-df.-i-ctr.-fs12.-pbs.-rd5").text() || $("p.-df.-i-ctr.-fs12.-pbs.-gy5").text();
        const productDesc = $("div.markup.-mhm.-pvl.-oxa.-sc").text() || $("div.markup.-mhm.-pvl.-oxa.-sc p").text();
        const ratings = $("a.-plxs._more").text();
       const percentDiscount = $("span.bdg._dsct._dyn.-mls").attr("data-disc");


    //    price correction for discount price
    if(discountPrice < 1){
        discountPrice = productPrice
    };


        const data = {
            
                url,
                currency: currencySmbol,
                image: imgUrl,
                title,
                currentPrice: discountPrice,
                originalPrice:  productPrice,
                priceHistory: [],
                discountRate:  Number(percentDiscount?.slice(percentDiscount.length) || 0),
                category: 'category',
                reviewsCount:100,
                stars: 4.5,
                isOutOfStock: false,
                description: productDesc,
                lowestPrice:  discountPrice,
                highestPrice:  productPrice,
                averagePrice:  discountPrice,
              
        };
        console.log(data)
        return data;

    } catch (error: any) {
        throw new Error(`failled to scrape product: ${error.message}`)
    }


    

};