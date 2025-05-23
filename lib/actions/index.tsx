"use server"

import { revalidatePath } from "next/cache";

import { scrapeJumiaProduct } from "../scraper";
import { connectToDB } from "../mongoose";
import Product from "../models/product.model";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { generateEmailBody, sendEmail } from "../nodemailer";
import { User } from "@/types";

export async function scrapeAndStoreProduct(productUrl: string) {
    if(!productUrl) return;

    try {
        connectToDB();

        // // checking mongoose Product index and changing it from  unique index
        // const indexes = await Product.collection.indexes();
        //  console.log(indexes);

        //  await Product.collection.dropIndex("currency_1");
        //  await Product.syncIndexes();


        const scrapedProduct = await scrapeJumiaProduct(productUrl);

        if(!scrapedProduct) return;

        let product = scrapedProduct;

        const existingProduct = await Product.findOne( { url: scrapedProduct.url});

        if(existingProduct) {
            const updatePriceHistory: any = [
                ...existingProduct.priceHistory,
                { price: scrapedProduct.currentPrice, timestamp: new Date() }
            ]

            product = {
                ...scrapedProduct,
                priceHistory: updatePriceHistory,
                lowestPrice:  getLowestPrice(updatePriceHistory),
                highestPrice: getHighestPrice(updatePriceHistory),
                averagePrice: getAveragePrice(updatePriceHistory),
            }
        }
          
        const newProduct = await Product.findOneAndUpdate(
            { url: scrapedProduct.url },
            { $set: { ...product } },
            { upsert: true, new: true}
        );

        revalidatePath(`/products/${newProduct.id}`)
    } catch (error: any) {
        throw new Error(`Failed to create/update product: ${error.message}`)
    }
};

export async function getProductById(productId: string) {
   try {
    connectToDB();

    const product = await Product.findOne({ _id: productId });

    if(!product) return null;
     return product
   } catch (error) {
      console.log(error);
   }
};

export async function getAllProducts() {
    try {
        connectToDB();

        const products = await Product.find();

        return products
    } catch (error) {
        console.log(error)
    }
};


export async function getSimilarProducts(productId: string) {
    try {
        connectToDB();

        const currentProducts = await Product.findById(productId);

        if(!currentProducts)return null;

        const similarProducts = await Product.find({
            id: {$ne : productId}
        }).limit(3)

        return similarProducts;
    } catch (error) {
        console.log(error)
    }
};



export async function addUserEmailToProduct(productId: string, userEmail: string){
    
    // checking mongoose Product index and changing it from  unique index
        const indexes = await Product.collection.indexes();
         console.log(indexes);

        //  await Product.collection.dropIndex("currency_1");
        //  await Product.syncIndexes();
    
    try {
        const product = await Product.findById(productId);

        if(!product) return;
        const userExist = product.users.some((user: User) => user.email === userEmail);
        
        console.log(product)
        if(!userExist) {
            product.users.push({ email: userEmail});
            product.priceHistory.push({ prices: product.currentPrice });

            await product.save();

            const emailContent = await generateEmailBody(product, "WELCOME");

            await sendEmail(emailContent, [userEmail]);
        }
    } catch (error) {
        console.log(error)
    }
}