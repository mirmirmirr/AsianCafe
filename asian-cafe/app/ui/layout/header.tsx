'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ACLogoVertical, ACLogoHorizontal } from './ac-logo';
import NavLinks from './navlinks';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className='flex items-center justify-center'>
      <motion.div
        className={`fixed top-[70px] md:top-[40px] w-[95vw] z-10 bg-[#E3ECB7] flex border-b-2 border-black p-8 pt-4`}
        initial={false}
        animate={{
        flexDirection: isScrolled ? 'row' : 'column',
        justifyContent: isScrolled ? 'space-between' : 'center',
        alignItems: 'center',
        height: isScrolled ? 70 : 230,
        padding: isScrolled ? '20px' : '16px',
        }}
        transition={{ duration: 0.3 }}
      >
        <div className={`flex items-center ${isScrolled ? 'gap-4' : 'flex-col gap-2'}`}>
          {isScrolled ? (<ACLogoVertical width={50}/>) : (<ACLogoHorizontal width={100}/>)}
        </div>
        <div
          className={`${
            isScrolled ? 'ml-auto' : 'mt-4'
          } flex items-center justify-center transition-all`}
        >
          <NavLinks />
        </div>
      </motion.div>
    </div>
  );
}