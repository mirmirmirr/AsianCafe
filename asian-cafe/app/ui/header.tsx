// import ACLogo from './ac-logo';
// import NavLinks from './navlinks';

// export default function Header() {
//   return (
//     <div className="flex flex-col gap-4 row-start-1 items-center justify-center">
//       <ACLogo width={100} />
//       <NavLinks />
//     </div>
//   );
// }


'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ACLogoVertical, ACLogoHorizontal } from './ac-logo';
import NavLinks from './navlinks';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Change state when scrolled past 50px
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.div
      className={`fixed top-0 left-0 w-[95vw] z-10 bg-lightgreen flex border-b-2 border-black m-8 mt-0 pt-4`}
      initial={false}
      animate={{
        flexDirection: isScrolled ? 'row' : 'column',
        justifyContent: isScrolled ? 'space-between' : 'center',
        alignItems: isScrolled ? 'center' : 'center',
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
  );
}