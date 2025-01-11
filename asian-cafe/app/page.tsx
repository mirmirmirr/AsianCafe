'use client'

import { EmblaCarousel } from "./ui/carousel";
import { useState, useEffect } from 'react';
import { ACLogoHorizontal, ACLogoVertical } from "./ui/ac-logo";
import NavLinks from "./ui/navlinks";
import Image from "next/image";


export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  const description = [
    'Our restaurant offers a wide array of authentic Asian Food, such as Ramen Noodle Soup, Stir-Fried Ramen Noodles, Beef Teriyaki, Hibachi Chicken, Thai Red Curry Chicken',
    'Come in to try our delicous food today!',
    'Dine in and pick up available'
  ]
  
  const hours = [
    'Closed on Sundays and Mondays',
    'Lunch: Tuesday - Friday, 11am to 2pm',
    'Dinner: Tuesday - Saturday, 4pm to 8pm',
  ]

  return (
    <div className="grid grid-rows-[270px_1fr] md:grid-rows-[230px_1fr_20px] justify-items-center min-h-screen gap-6">
      <main className="flex flex-col relative gap-4 row-start-2 items-center justify-center overflow-hidden">

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-[90vw] md:w-[40vw] flex flex-col text-center justify-center items-center mb-10" >
            {description.map((para, index) => (
              <p key={index} className="text-[18px] mb-4">
                {para}
              </p>
            ))}
            <button className="w-fit border-[1px] border-darkgreen font-[600] p-4 mt-4 hover:bg-darkgreen hover:text-white">
              ORDER ONLINE
            </button>
          </div>

          <EmblaCarousel />
        </div>

        <div className="flex flex-col md:grid md:grid-cols-[1fr_2fr_1fr] justify-items-center gap-4 text-center text-[18px] mt-10 mb-10">
          <div className="col-start-1">
            <h1 className="font-[600] mb-2">LOCATION</h1>
            <p>511 E Genesee St</p>
            <p>Fayetteville, NY 13066</p>
          </div>
          <div className="col-start-2">
            <h1 className="font-[600] mb-2">HOURS</h1>
            {hours.map((detail, index) => (
              <p key={index} className="mb-2">{detail}</p>
            ))}
          </div>
          <div className="col-start-3">
            <h1 className="font-[600] mb-2">CONTACT</h1>
            <p>(315) 637-7778</p>
          </div>
        </div>

      </main>
    </div>
  );
}
