import Image from "next/image";
import { useEffect, useState } from "react";

export default function AddButton({ checked }) {
  const [symbol, setSymbol] = useState({ src: "/icons/add.svg", alt: "Add Icon"});
  const [color, setColor] = useState("darkgreen")

  useEffect(() => {
    if (checked) {
      setSymbol({ src: "/icons/subtract.svg", alt: "Subctract Icon" });
      setColor("red");
    } else {
      setSymbol({ src: "/icons/add.svg", alt: "Add Icon"});
      setColor("darkgreen")
    }
  }, [checked])

  return (
    <button className={`bg-${color} rounded-full p-2`}>
      <Image className="invert" src={symbol.src} alt={symbol.alt} width={20} height={20} />
    </button>
  )
}

