import { fetchSectionItems } from '@/app/lib/menu';

import MenuItems from "../ui/menu/menu-items";

export default async function Page() {
  const allItems = await fetchSectionItems();

  return (
    <div className="grid grid-rows-[5px_1fr_20px] min-h-screen gap-16">
      <main className="row-start-2 grid grid-cols-[300px_1fr_300px] gap-x-8">
        <div className='border-2 border-black p-4 h-[350px] col-start-1'>
          <h1 className='text-[20px] font-[600]'>Categories</h1>
          <ol>
            <li>Appetizers</li>
            <li>Hibachi Fried Rice</li>
            <li>Japanese Yaki Udon</li>
            <li>Pad Thai</li>
            <li>Thai Red Curry</li>
            <li>Teriyaki Dishes</li>
            <li>Hibachi Dishes</li>
            <li>Rice Bowls</li>
            <li>House Specialty Dishes</li>
            <li>Fresh Steamed Dishes</li>
            <li>Homemade Ramen</li>
            <li>Beverages and Sides</li>
          </ol>
        </div>
        <div className='col-start-2'>
          <MenuItems sectionName='Appetizers' allItems={allItems}/>
          <MenuItems sectionName='Hibachi Fried Rice' allItems={allItems}/>
          <MenuItems sectionName='Japanese Yaki Udon' allItems={allItems}/>
          <MenuItems sectionName='Pad Thai' allItems={allItems}/>
          <MenuItems sectionName='Thai Red Curry' allItems={allItems}/>
          <MenuItems sectionName='Teriyaki Dishes' allItems={allItems}/>
          <MenuItems sectionName='Hibachi Dishes' allItems={allItems}/>
          <MenuItems sectionName='Rice Bowls' allItems={allItems}/>
          <MenuItems sectionName='House Specialty Dishes' allItems={allItems}/>
          <MenuItems sectionName='Fresh Steamed Dishes' allItems={allItems}/>
          <MenuItems sectionName='Homemade Ramen' allItems={allItems}/>
          <MenuItems sectionName='Beverages and Sides' allItems={allItems}/>
        </div>
        <div className='border-l-2 border-black p-4 col-start-3'>
          <h1 className='text-[20px] font-[600]'>My Order</h1>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p>&#169; 2018 Asian Cafe Asian Restaurant</p>
      </footer>
    </div>
  );
}