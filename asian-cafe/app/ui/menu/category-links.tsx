'use client';

import React from 'react';

const CategoryLinks = ({ sections }) => {
  const handleScrollToSection = (e, sectionID) => {
    e.preventDefault();
    const element = document.getElementById(sectionID);
    if (element) {
      const headerOffset = 140;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset; 
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className='hidden lg:block border-2 border-black p-4 h-[370px] col-start-1 sticky top-[140px]'>
      <h1 className='text-[30px] font-[600] font-euphoria'>Categories</h1>
      <ol>
        {sections.map((category, index) => (
          <li key={index}>
            <a
              href={`#${category.id}`}
              className="hover:underline"
              onClick={(e) => handleScrollToSection(e, category.id)}
            >
              {category.section}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default CategoryLinks;