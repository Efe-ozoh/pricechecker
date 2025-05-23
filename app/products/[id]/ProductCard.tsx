import React from 'react';
import { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { formatNumber } from '@/lib/utils';

interface Props {
    product: Product;
}

const ProductCard = ({product}: Props) => {
  return (
   <Link href={`/products/${product._id}`} className='product-card'>
    <div>
        <Image 
          src={product.image}
          alt={product.title}
          width={200}
          height={200}
          className='product-card_img' />

          <div>
            <div className='flex flex-col gap-3 dark:text-white py-2'>
                <h3 className='product-title dark:text-white'>{product.title}</h3>

                <div className='flex justify-between dark:text-white'>
                    <p className='text-black opacity-50 text-lg capitalize dark:text-white'>
                        {product.category}
                    </p>

                    <p className='text-black dark:text-white text-lg font-semibold'>
                        <span>{product?.currency}</span>
                        <span>{`${formatNumber(product.currentPrice)}`}</span>
                    </p>
                </div>
            </div>
          </div>
    </div>
   </Link>
  )
}

export default ProductCard
