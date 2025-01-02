import { fetchSectionItems } from '@/app/lib/menu';
import Link from 'next/link';
import { MenuItems, MenuItemsDropDown} from "../ui/menu/menu-items";

export default async function Page() {
  const allItems = await fetchSectionItems();

  const sections = [
    "Appetizers",
    "Hibachi Fried Rice",
    "Japanese Yaki Udon",
    "Pad Thai",
    "Thai Red Curry",
    "Teriyaki Dishes",
    "Hibachi Dishes",
    "Rice Bowls",
    "House Specialty Dishes",
    "Fresh Steamed Dishes",
    "Homemade Ramen",
    "Beverages and Sides",
  ];

  return (
    <div className="grid grid-rows-[210px_1fr_20px] min-h-screen gap-8">
      <main className="row-start-2 md:grid md:grid-cols-[1fr_300px] lg:grid-cols-[300px_1fr_300px] gap-x-8">
        <div className='hidden lg:block border-2 border-black p-4 h-[350px] col-start-1 sticky top-[100px]'>
          <h1 className='text-[20px] font-[600]'>Categories</h1>
          <ol>
            {sections.map((category) => (
                <li key={category}>
                  <a
                    href={`#${category.replace(/\s+/g, "-").toLowerCase()}`}
                    className="hover:underline"
                  >
                    {category}
                  </a>
                </li>
              ))}
          </ol>
        </div>
        <div className='md:col-start-1 lg:col-start-2'>
          {sections.map((category) => (
            <div
              key={category}
              id={category.replace(/\s+/g, "-").toLowerCase()}
            >
              <div className='hidden md:block'> <MenuItems sectionName={category} allItems={allItems} /> </div>
              <div className='md:hidden'> <MenuItemsDropDown sectionName={category} allItems={allItems} /> </div>
            </div>
          ))}
        </div>
        <div className='hidden md:block border-l-2 border-black p-4 col-start-2 lg:col-start-3'>
          <h1 className='text-[20px] font-[600] sticky top-[100px]'>My Order</h1>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p>&#169; 2018 Asian Cafe Asian Restaurant</p>
      </footer>
    </div>
  );
}