import React, { useState, type KeyboardEvent } from 'react';
import s from './CategoryInput.module.scss';

interface CategoryInputProps {
  categories: string[];
  onCategoriesChange: (categories: string[]) => void;
  placeholder?: string;
}

const CategoryInput = ({ categories, onCategoriesChange, placeholder }: CategoryInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newCategory = inputValue.trim();
      if (newCategory && !categories.includes(newCategory)) {
        onCategoriesChange([...categories, newCategory]);
      }
      setInputValue('');
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    onCategoriesChange(categories.filter(category => category !== categoryToRemove));
  };

  return (
    <div className={s.categoryInputContainer}>
      {categories.map((category, index) => (
        <div key={index} className={s.categoryTag}>
          {category}
          <button type="button" onClick={() => removeCategory(category)}>&times;</button>
        </div>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Add a category..."}
        className={s.input}
      />
    </div>
  );
};

export default CategoryInput;