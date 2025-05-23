import HeroCarousel from "@/components/HeroCarousel";
import Searchbar from "@/components/Searchbar";
import { getAllProducts } from "@/lib/actions";
import Image from "next/image";
import ProductCard from "./products/[id]/ProductCard";

export default async function Home() {

  const allProducts = await getAllProducts();

  return (
    <>
      <section className="px-6 md:px-20 py-24">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
          <p  className="small-text text-gray-700 dark:text-gray-200">
            The Best Price is Here:
            <Image
            src="/assets/icons/arrow-right.svg"
            alt="arrow-right"
            width={16}
            height={16} />
          </p>

          <h1 className="head-text text-gray-900 dark:text-white">
            Get started using 
            <span className="text-primary"> MarketPrice</span>

          </h1>

          <p className="mt-6 mb-2 text-gray-800 dark:text-white">
            Best price and analytics currently at your fingertips
            to assist you on your price shopping decisions. 
          </p>

          <Searchbar/>
        </div>

        <HeroCarousel/>

        </div>
      </section>

      <section className="trending-section">
        <h2 className="section-text text-gray-900 dark:text-white">Trending</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allProducts?.map((product) => (
            <ProductCard  key={product.id} product={product}/>
          ))} 
        </div>
      </section>
    </>
  );
}
