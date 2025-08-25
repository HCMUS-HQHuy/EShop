import React, { useState, useRef, type DragEvent } from 'react';
import s from './ImageDropzone.module.scss';

interface ImageDropzoneProps {
  onFilesAccepted: (files: File[]) => void;
  multiple?: boolean;
  label: string;
}

const ImageDropzone = ({ onFilesAccepted, multiple = false, label }: ImageDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Cần thiết để sự kiện onDrop hoạt động
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAccepted(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesAccepted(Array.from(e.target.files));
    }
  };

  return (
    <div 
      className={`${s.dropzone} ${isDragging ? s.dragging : ''}`}
      onClick={() => fileInputRef.current?.click()}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input 
        ref={fileInputRef} 
        type="file" 
        multiple={multiple} 
        accept="image/*"
        onChange={handleFileSelect}
        className={s.hiddenInput}
      />
      <div className={s.content}>
        <span>☁️</span>
        <p>{label}</p>
        <small>Drag & Drop or Browse</small>
      </div>
    </div>
  );
};

export default ImageDropzone;