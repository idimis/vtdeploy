"use client";

import Link from "next/link";
import Image, { StaticImageData } from "next/image";

import musicIcon from "@/public/icons/music.png";
import nightlifeIcon from "@/public/icons/nightlife.png";
import artsIcon from "@/public/icons/arts.png";
import holidaysIcon from "@/public/icons/holiday.png";
import foodIcon from "@/public/icons/food.png";

interface Category {
  name: string;
  slug: string;
  icon: StaticImageData;
}

const categories: Category[] = [
  { name: "Music", slug: "music", icon: musicIcon },
  { name: "Nightlife", slug: "nightlife", icon: nightlifeIcon },
  { name: "Performance & Arts", slug: "performance-arts", icon: artsIcon },
  { name: "Holiday", slug: "holiday", icon: holidaysIcon },
  { name: "Food & Drink", slug: "food-drink", icon: foodIcon },
];

const CategorySection: React.FC = () => {
  return (
    <section className="max-w-[1440px] mx-auto px-8 py-12 my-8">
      <div className="flex flex-wrap justify-center md:justify-around">
        {categories.map((category) => (
          <Link
            href={`/category/${category.slug}`}
            key={category.slug}
            className="flex flex-col items-center cursor-pointer w-1/2 md:w-1/5"
          >
            <div className="w-24 h-24 md:w-28 md:h-28 border-2 border-gray-200 bg-transparent rounded-full flex items-center justify-center mb-4">
              <Image
                src={category.icon}
                alt={category.name}
                width={72}
                height={72}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-sm md:text-lg text-center font-medium">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
