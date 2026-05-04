import React from "react";
import SkeletonLoading from "../ui/SkeletonLoading";

interface Props {
  categories: { categoryId: number; categoryName: string }[];
  activeCategoryId: number | null | undefined;
  loadingCategories: boolean;
  onCategoryClick: (id: number | null) => void;
}

const MenuFilters: React.FC<Props> = ({
  categories,
  activeCategoryId,
  onCategoryClick,
  loadingCategories,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {loadingCategories ? (
        <>
          {[...Array(4)].map((_, index) => (
            <div key={index} className="w-20 h-9">
              <SkeletonLoading />
            </div>
          ))}
        </>
      ) : (
        <>
          {/* ALL MENUS */}
          <button
            onClick={() => onCategoryClick(null)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              activeCategoryId === null
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            Semua Menu
          </button>

          {/* CATEGORY LIST */}
          {categories?.map((cat) => {
            const active = cat.categoryId === activeCategoryId;

            return (
              <button
                key={cat.categoryId}
                onClick={() => onCategoryClick(cat.categoryId)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.categoryName}
              </button>
            );
          })}
        </>
      )}
    </div>
  );
};

export default MenuFilters;
