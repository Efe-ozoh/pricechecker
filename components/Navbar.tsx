import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

import ThemeToggle from "./DarkMode";



const Navbar = () => {
  return (
   <header className='w-full'>
    <nav className='nav items-center  justify-between flex flex-row' >
        <Link href='/' className='flex items-center gap-1'>
            <Image
            src="/assets/icons/logo.svg"
            width={27}
            height={27}
            alt="logo"/>

            <p className="nav-logo">
                Price<span className="text-primary">Market</span>
            </p>

         
            </Link>
           <div className="flex items-center gap-5">
              <ThemeToggle />
            </div>
        
    </nav>

   </header>
  )
}

export default Navbar
