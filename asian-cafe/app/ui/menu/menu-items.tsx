import { fetchSectionItems } from '@/app/lib/menu';

export default async function MenuItems({sectionName, allItems}) {
  const sectionItems = allItems.filter(item => item.section === sectionName);

  return (
    <div className='mt-4'>
      <p className='text-[20px] font-[600]'>{sectionName}</p>
      {sectionItems.map((item) => {
        return (
          <div key={item.id} className='flex flex-row gap-8 justify-between'>
            <div className='flex flex-row gap-2'>
              <p className='w-[30px]'>{item.sectionid}.</p>
              <p>{item.name}</p>
            </div>
            <div className='flex flex-row gap-2'>
              <p>{parseFloat(item.price).toFixed(2)}</p>
              <p> button </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}