import { fetchExtraOptions } from "@/app/lib/menu";

export default async function ExtraOptions({ selectedItem }) {
  const extras = await Promise.all(
    selectedItem.extras.map(async (cat) => {
      const catOptions = await fetchExtraOptions(cat);
      return {
        cat,
        options: catOptions || [],
      };
    })
  );

  return (
    <div>
      {extras.map(({ cat, options }, index) => (
        <div key={index}>
          <h3>{cat}</h3>
          <div>
            {options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <input
                  type="checkbox"
                  id={`option-${index}-${optionIndex}`}
                  name={cat}
                  value={option.option}
                />
                <label htmlFor={`option-${index}-${optionIndex}`}>
                  {option.option}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}