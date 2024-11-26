"use client";

import { Category } from "@prisma/client";
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcOldTimeCamera,
  FcMusic,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc";
import { IconType } from "react-icons/lib";
import CategoryItem from "./category-item";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  Music: FcMusic,
  Photography: FcOldTimeCamera,
  Fitness: FcSportsMode,
  Accounting: FcSalesPerformance,
  "Computer Science": FcMultipleDevices,
  Filming: FcFilmReel,
  Engineering: FcEngineering,
};

const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-2 pb-2">
      {items.map((category) => {
        return (
          <CategoryItem
            key={category.id}
            label={category.name}
            icon={iconMap[category.name]}
            value={category.id}
          />
        );
      })}
    </div>
  );
};

export default Categories;
