import React, { use, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import s from './CategoryInput.module.scss';
import { useSelector } from 'react-redux';
import type { RootState } from 'src/Types/store.ts';
import type { CategoryInfor } from 'src/Types/category.ts';

interface CategoryInputProps {
  categoryIds: number[];
  onCategoriesChange: (categories: number[]) => void;
  placeholder?: string;
}

const CategoryInput = ({ categoryIds, onCategoriesChange, placeholder }: CategoryInputProps) => {
  const { categoryList } = useSelector((state: RootState) => state.categories);
  const [inputValue, setInputValue] = useState('');
  const [categoryOutput, setCategoryOutput] = useState<CategoryInfor[]>([]);
  const [suggestions, setSuggestions] = useState<CategoryInfor[]>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCategoryOutput(categoryList.filter(cat => categoryIds.includes(cat.categoryId)));
  }, [categoryList, categoryIds]);

  useEffect(() => {
    console.log("Category list from store:", categoryList, categoryIds);
    if (inputValue) {
      const filteredSuggestions = categoryList
        .filter(cat => cat.title.toLowerCase().includes(inputValue.toLowerCase()))
        .filter(cat => !categoryIds.includes(cat.categoryId));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions(categoryList);
    }
    setActiveIndex(-1);
  }, [inputValue, categoryList, categoryIds]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsSuggestionsVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const addCategory = (newCategory: CategoryInfor) => {
    if (newCategory && !categoryIds.includes(newCategory.categoryId) && categoryIds.length < 3) {
      onCategoriesChange([...categoryIds, newCategory.categoryId]);
      setCategoryOutput([...categoryOutput, newCategory]);
    }
    setInputValue('');
    // setIsSuggestionsVisible(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
      case ',':
        e.preventDefault();
        if (activeIndex > -1 && suggestions[activeIndex]) {
          addCategory(suggestions[activeIndex]);
          setActiveIndex(-1);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;

      case 'Backspace':
        if (!inputValue && categoryIds.length > 0 && categoryIds[categoryIds.length - 1] != undefined) {
          removeCategory(categoryIds[categoryIds.length - 1]!);
        }
        break;

      case 'Escape':
        setIsSuggestionsVisible(false);
        break;
    }
  };

  const removeCategory = (categoryToRemove: number) => {
    onCategoriesChange(categoryIds.filter((categoryId) => categoryId !== categoryToRemove));
    setCategoryOutput(categoryOutput.filter(cat => cat.categoryId !== categoryToRemove));
  };

  return (
    <div className={s.container}>
      <div className={s.categoryInputContainer}>
        {categoryOutput.map((category: CategoryInfor) => (
          <div key={category.categoryId} className={s.categoryTag}>
            {category.title}
            <button type="button" onClick={() => removeCategory(category.categoryId)}>&times;</button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsSuggestionsVisible(true)}
          placeholder={categoryOutput.length === 0 ? (placeholder || "Add a category...") : ""}
          className={s.inputCategory}
          autoComplete="off"
        />
      </div>

      {isSuggestionsVisible && suggestions.length > 0 && (
        <ul className={s.suggestionsList}>
          {suggestions.map((suggestion, index) => (
            <li key={suggestion.title} 
              className={index === activeIndex ? s.activeSuggestion : ''}
              onMouseDown={() => addCategory(suggestion)}
              >
                {suggestion.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default CategoryInput;