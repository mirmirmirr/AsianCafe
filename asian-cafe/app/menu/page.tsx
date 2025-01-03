import { fetchSectionItems } from '@/app/lib/menu';
import Link from 'next/link';
import { MenuItems, MenuItemsDropDown} from "../ui/menu/menu-items";

export default async function Page() {
  const allItems = await fetchSectionItems();

  const sections = [
    { sectionName: "Appetizers", subSectionNames: [], description: [""] },
    { sectionName: "Hibachi Fried Rice", subSectionNames: [], description: ["Hibachi Style Fried Rice with Egg and Veg."] },
    { sectionName: "Japanese Yaki Udon", subSectionNames: [], description: ["Stir-Fried Japanese Wheat Noodles with Veg."] },
    { sectionName: "Pad Thai", subSectionNames: [], description: ["Stir-Fried Thai Rice Noodles with Eggs, Vegetables and Lime, Topped with Peanuts."] },
    { sectionName: "Thai Red Curry", subSectionNames: [], description: ["Served with White Rice, or Fried Rice Extra $2"] },
    { sectionName: "Teriyaki Dishes", subSectionNames: [], description: ["Served with White Rice, or Fried Rice Extra $2"] },
    { sectionName: "Hibachi Dishes", subSectionNames: [], description: ["Served with White Rice, or Fried Rice Extra $2"] },
    { sectionName: "Rice Bowls", subSectionNames: [], description: ["Served with White Rice, or Fried Rice Extra $2"] },
    { sectionName: "House Specialty Dishes", subSectionNames: [], description: ["Served with White Rice, or Fried Rice Extra $2"] },
    { sectionName: "Fresh Steamed Dishes", subSectionNames: [], description: ["Served with White Rice, or Fried Rice Extra $2"] },
    { sectionName: "Homemade Ramen", subSectionNames: ["Ramen Noodle Soup", "Stir-Fried Ramen Noodles"], description: ["Homemade Fresh Ramen (or Udon or Rice Noodle) in Tonkotsu broth (or Spicy Curry Broth, Miso Broth or Clear Vegetable Broth) with egg, fish cake, bamboo shoot, sweet corn, seaweed, scallions, and red chili oil", "Stir-fried noodles with veg and eggs"] },
    { sectionName: "Beverages and Sides", subSectionNames: [], description: [""] }
  ];

  return (
    <div className="grid grid-rows-[210px_1fr_20px] min-h-screen gap-8">
      <main className="row-start-2 md:grid md:grid-cols-[1fr_300px] lg:grid-cols-[300px_1fr_300px] gap-x-8">
        <div className='hidden lg:block border-2 border-black p-4 h-[350px] col-start-1 sticky top-[100px]'>
          <h1 className='text-[20px] font-[600]'>Categories</h1>
          <ol>
            {sections.map((category, index) => (
                <li key={index}>
                  <a
                    href={`#${category.sectionName.replace(/\s+/g, "-").toLowerCase()}`}
                    className="hover:underline"
                  >
                    {category.sectionName}
                  </a>
                </li>
              ))}
          </ol>
        </div>
        <div className='md:col-start-1 lg:col-start-2'>
          {sections.map((category, index) => (
            <div
              key={index}
              id={category.sectionName.replace(/\s+/g, "-").toLowerCase()}
            >
              <div className='hidden md:block'> <MenuItems sectionName={category.sectionName} allItems={allItems} subSectionName={category.subSectionNames} descriptions={category.description}/> </div>
              <div className='md:hidden'> <MenuItemsDropDown sectionName={category.sectionName} allItems={allItems} subSectionName={category.subSectionNames} descriptions={category.description} /> </div>
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