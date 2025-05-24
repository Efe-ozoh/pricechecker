import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeJumiaProduct } from "@/lib/scraper";
import {
  getHighestPrice,
  getLowestPrice,
  getAveragePrice,
  getEmailNotifType,
} from "@/lib/utils";
import { NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await connectToDB(); 

    const products = await Product.find({});
    if (!products.length) throw new Error("No products found");

    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        const scrapedProduct = await scrapeJumiaProduct(currentProduct.url);
        if (!scrapedProduct) throw new Error("Scraped product not found");

        const updatePriceHistory = [
          ...currentProduct.priceHistory,
          { price: scrapedProduct.currentPrice, timestamp: new Date() },
        ];

        const product = {
          ...scrapedProduct,
          priceHistory: updatePriceHistory,
          lowestPrice: getLowestPrice(updatePriceHistory),
          highestPrice: getHighestPrice(updatePriceHistory),
          averagePrice: getAveragePrice(updatePriceHistory),
        };

        const updatedProduct = await Product.findOneAndUpdate(
          { url: product.url },
          product,
          { new: true }
        );

        const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct);

        if (emailNotifType && updatedProduct?.users?.length > 0) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url,
          };

          const emailContent = await generateEmailBody(productInfo, emailNotifType);
          const userEmails = updatedProduct.users.map((user) => user.email);
          await sendEmail(emailContent, userEmails);
        }

        return updatedProduct;
      })
    );

    return NextResponse.json({ message: "OK", data: updatedProducts });
  } catch (error) {
    console.error("CRON ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}