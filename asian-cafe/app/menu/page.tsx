import { fetchSectionItems } from '@/app/lib/menu';
import Link from 'next/link';
import { Section, SectionMobile } from "../ui/menu/menu-items";
import api from '@/app/lib/axios';
import Order from '@/app/ui/menu/order';
import OrderSummary from '../ui/menu/order-summary';

export default async function Page() {
  const response = await api.get('/api/menu');
  const data = response.data;

  const sections = data['menu'];
  // console.log(sections[0].section);

  return (
    <div className="grid grid-rows-[240px_1fr_20px] min-h-screen gap-8">
      <main className="row-start-2 md:grid md:grid-cols-[1fr_350px] lg:grid-cols-[300px_1fr_350px] gap-x-8">
        <div className='hidden lg:block border-2 border-black p-4 h-[350px] col-start-1 sticky top-[140px]'>
          <h1 className='text-[20px] font-[600]'>Categories</h1>
          <ol>
            {sections.map((category, index) => (
                <li key={index}>
                  <a
                    href={`#${category.section.replace(/\s+/g, "-").toLowerCase()}`}
                    className="hover:underline"
                  >
                    {category.section}
                  </a>
                </li>
              ))}
          </ol>
        </div>
        <div className='md:col-start-1 lg:col-start-2'>
          {sections.map((category, index) => (
            <div
              key={index}
              id={category.section.replace(/\s+/g, "-").toLowerCase()}
            >
              <div className='hidden md:block'> <Section section={category}/> </div>
              <div className='md:hidden'> <SectionMobile section={category} /> </div>
            </div>
          ))}
        </div>
        <div className='hidden md:block border-l-2 border-black p-4 pr-0 col-start-2 lg:col-start-3'>
          <div className='sticky top-[140px]'>
            <Order />
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p>&#169; 2018 Asian Cafe Asian Restaurant</p>
      </footer>
    </div>
  );
}