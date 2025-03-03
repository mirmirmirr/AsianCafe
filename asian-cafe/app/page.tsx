'use client'

import { EmblaCarousel } from "./ui/components/carousel";
import { useEffect } from 'react';
import api from '@/app/lib/axios';
import Link from "next/link";
import Map from "@/app/ui/layout/map";

export default function Home() {

  useEffect(() => {
    api.get('/api/ping')
      .then(response => {
        console.log('App is awake:', response);
      })
      .catch(error => {
        console.error('Failed to wake up app:', error);
      });
  }, []);  

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
            <div className="text-[18px] flex flex-col gap-4">
              <p> Our restaurant offers a wide array of authentic Asian Food, such as Ramen Noodle Soup, Stir-Fried Ramen Noodles, Beef Teriyaki, Hibachi Chicken, Thai Red Curry Chicken </p>
              <p> Come in to try our delicous food today! </p>
              <p> Dine in and pick up available </p>
            </div>
            <Link href="/menu" className="w-fit border-[1px] border-darkgreen font-[600] p-4 mt-4 hover:bg-darkgreen hover:text-white">
              ORDER ONLINE
            </Link>
          </div>

          <EmblaCarousel />
        </div>

        <div id="store-info" className="flex flex-col md:grid md:grid-cols-[1fr_2fr_1fr] justify-items-center gap-4 text-center text-[18px] mt-10 mb-8">
            <div className="col-start-1">
            <h1 className="font-[600] mb-2">LOCATION</h1>
            <Link className="hover:underline" href="https://www.google.com/maps/search/?api=1&query=511+E+Genesee+St,+Fayetteville,+NY+13066" target="_blank" rel="noopener noreferrer">
              <p>511 E Genesee St</p>
              <p>Fayetteville, NY 13066</p>
            </Link>
            </div>
          <div className="col-start-2">
            <h1 className="font-[600] mb-2">HOURS</h1>
            <div>
              <div className="grid grid-cols-[1fr_1fr]">
                <div className="text-left">
                  <p>Sunday to Monday</p>
                  <p>Tuesday to Friday</p>
                  <p className="text-lightgreen">nnn</p>
                  <p>Saturday</p>
                </div>
                <div className="text-right">
                  <p>CLOSED</p>
                  <p>11am - 2pm</p>
                  <p>4pm - 8pm</p>
                  <p>4pm - 8pm</p>
                </div>
              </div>
            </div>
          </div>
            <div className="col-start-3">
            <h1 className="font-[600] mb-2">CONTACT</h1>
            <Link href="tel:+13156377778" className="hover:underline">
              <p>(315) 637-7778</p>
            </Link>
            </div>
        </div>

        <Map />

      </main>
    </div>
  );
}
