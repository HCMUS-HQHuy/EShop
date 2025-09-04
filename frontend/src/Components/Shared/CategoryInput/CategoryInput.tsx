import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import s from './CategoryInput.module.scss';
import type { RootState } from 'src/Types/store.ts';
import type { CategoryInfor } from 'src/Types/category.ts';
import { showAlert } from 'src/Features/alertsSlice.tsx';

interface CategoryInputProps {
  categoryIds: number[];
  onCategoriesChange: (categoryIds: number[]) => void;
  placeholder?: string;
}

interface CategoryOptionProps {
  category: CategoryInfor;
  selectedIds: number[];
  onToggle: (categoryId: number) => void;
  level: number;
}

const CategoryOption = ({ category, selectedIds, onToggle, level }: CategoryOptionProps) => {
  return (
    <>
      <li 
        onClick={() => onToggle(category.categoryId)}
        style={{ paddingLeft: `${15 + level * 20}px` }}
      >
        <input
          type="checkbox"
          checked={selectedIds.includes(category.categoryId)}
          readOnly
        />
        <span>{category.title}</span>
      </li>
      {category.subCategories && category.subCategories.map(child => (
        <CategoryOption
          key={child.categoryId}
          category={child}
          selectedIds={selectedIds}
          onToggle={onToggle}
          level={level + 1}
        />
      ))}
    </>
  );
};

const filterCategories = (categories: CategoryInfor[], searchTerm: string): CategoryInfor[] => {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
  return categories.reduce((acc, category) => {
    const childrenMatch = category.subCategories ? filterCategories(category.subCategories, searchTerm) : [];
    const selfMatch = category.title.toLowerCase().includes(lowerCaseSearchTerm);

    if (selfMatch || childrenMatch.length > 0) {
      acc.push({ ...category, subCategories: childrenMatch });
    }
    
    return acc;
  }, [] as CategoryInfor[]);
};

const CategoryInput = ({ categoryIds, onCategoriesChange, placeholder }: CategoryInputProps) => {
  const { categoryList } = useSelector((state: RootState) => state.categories);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const flat = (categories: CategoryInfor[]): CategoryInfor[] => {
    return categories.reduce((acc, category) => {
      acc.push(category);
      if (category.subCategories) {
        acc.push(...flat(category.subCategories));
      }
      return acc;
    }, [] as CategoryInfor[]);
  };
  const selectedCategories = flat(categoryList).filter(cat => categoryIds.includes(cat.categoryId));
  const filteredCategoryList = searchTerm ? filterCategories(categoryList, searchTerm) : categoryList;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleCategory = (categoryId: number) => {
    const isSelected = categoryIds.includes(categoryId);
    let newSelectedIds: number[];

    if (isSelected) {
      newSelectedIds = categoryIds.filter(id => id !== categoryId);
    } else {
      if (categoryIds.length < 3) {
        newSelectedIds = [...categoryIds, categoryId];
      } else {
        dispatch(showAlert({ alertState: 'error', alertText: "You can select up to 3 categories.", alertType: 'alert' }));
        return;
      }
    }
    onCategoriesChange(newSelectedIds);
  };

  return (
    <div className={s.container} ref={containerRef}>
      <div className={`${s.displayBox} ${isOpen ? s.isOpen : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <div className={s.tagsContainer}>
          {selectedCategories.length > 0 ? (
            selectedCategories.map(cat => (
              <div key={cat.categoryId} className={s.categoryTag}>
                {cat.title}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleCategory(cat.categoryId);
                  }}
                >
                  &times;
                </button>
              </div>
            ))
          ) : (
            <span className={s.placeholder}>{placeholder || "Select categories..."}</span>
          )}
        </div>
        <span className={s.arrowIcon}>▼</span>
      </div>

            {isOpen && (
        <div className={s.dropdown}>
          <input
            type="text"
            className={s.searchInput}
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className={s.optionsList}>
            {filteredCategoryList.length > 0 ? (
              // 4. Thay thế .map() cũ bằng .map() gọi CategoryOption
              filteredCategoryList.map(cat => (
                <CategoryOption
                  key={cat.categoryId}
                  category={cat}
                  selectedIds={categoryIds}
                  onToggle={handleToggleCategory}
                  level={0} // Bắt đầu từ cấp 0
                />
              ))
            ) : (
              <li className={s.noResults}>No categories found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategoryInput;