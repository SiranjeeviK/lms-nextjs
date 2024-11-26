"use client";

import qs from "query-string";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { IconType } from "react-icons/lib";

interface CategoryItemProps {
  label?: string;
  icon?: IconType;
  value?: string;
}

const CategoryItem = ({ label, icon: Icon, value }: CategoryItemProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      {
        skipEmptyString: true,
        skipNull: true,
      },
    );

    router.push(url);
  };

  return (
    <div>
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-x-1 rounded-full border border-slate-200 px-3 py-2 text-sm transition hover:border-sky-700",
          isSelected && "border-sky-700 bg-sky-200/20 text-sky-800",
        )}
      >
        {Icon && <Icon size={20} />}
        <div className="truncate">{label}</div>
      </button>
    </div>
  );
};

export default CategoryItem;
