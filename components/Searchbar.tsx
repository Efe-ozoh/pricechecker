"use client"

import { scrapeAndStoreProduct } from "@/lib/actions";
import React, { FormEvent, useState } from "react";


const isValidAmazonProductUrl = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostName = parsedURL.hostname;

     if(hostName.includes('jumia.com') || hostName.includes('jumia.')
    || hostName.endsWith('jumia')){
       return true;
     }else{ 
      return false;
    };

  }catch (error) {
    return false;
  }

  
};

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoadig, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const isValidLink = isValidAmazonProductUrl(searchPrompt);

      if(!isValidLink) {
        return alert('Please provide a valid Amazon link')
      }
      
      try {
        setIsLoading(true);

        // scraping the amazon product page

        const product = await scrapeAndStoreProduct(searchPrompt);
      } catch (error) {
        setIsLoading(false)
        console.log(error)
    } finally{
      setIsLoading(false);
    }
    };

  return (
    <form className='flex flex-warp gap-4 mt12'
    onSubmit={handleSubmit}>
       <input 
       type="text"
       value={searchPrompt}
       onChange={e => setSearchPrompt(e.target.value)}
       placeholder="Enter product link or name" 
       className="searchbar-input"/>

       <button type="submit" className="searchbar-btn" disabled={searchPrompt === ""}>
        {isLoadig ? "Search..." : "Search"}
       </button>
    </form>
  )
}

export default Searchbar;
