import { EmblaCarousel } from "./carousel";


export default function Home() {
  const description = [
    'Our restaurant offers a wide array of authentic Asian Food, such as Ramen Noodle Soup, Stir-Fried Ramen Noodles, Beef Teriyaki, Hibachi Chicken, Thai Red Curry Chicken',
    'Try our delicious food and service today. Come in for a Asian Lunch Special or during evenings for a delicious Asian style dinner'
  ]

  return (
    <div className="grid grid-rows-[190px_1fr_20px] justify-items-center min-h-screen gap-6">
      <main className="flex flex-row gap-4 row-start-2 items-center justify-center">
        <div className="w-[40vw] text-center">
          Online Order


          {/* <h1 className={`text-[40px] text-red font-[700]`}>Asian Cafe</h1>
          <h2 className="text-red font-[300] mb-8">511 E Genesee St, Fayetteville, NY 13066</h2>

          {description.map((para, index) => (
            <p key={index} className="text-[16px] mb-2">
              {para}
            </p>
          ))} */}
        </div>
        <EmblaCarousel />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p>&#169; 2025 Asian Cafe Asian Restaurant</p>
      </footer>
    </div>
  );
}
