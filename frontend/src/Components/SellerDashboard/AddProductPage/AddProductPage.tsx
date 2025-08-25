import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryInput from 'src/Components/Shared/CategoryInput/CategoryInput.tsx';
import ToggleSwitch from 'src/Components/Shared/ToggleSwitch/ToggleSwitch.tsx';
import s from './AddProductPage.module.scss';

// Component Icon nhỏ để tái sử dụng
const IconPlus = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5V19" stroke="#848d97" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 12H19" stroke="#848d97" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

const AddProductPage = () => {
  const navigate = useNavigate();
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);

  const [productData, setProductData] = useState({
    name: '', shortName: '', description: '', price: 0, discount: 0, stock_quantity: 0,
    mainImage: undefined as File | undefined,
    additionalImages: [] as File[],
    categories: [] as string[],
    isActive: true,
  });

  const handleMainImageChange = (files: File[]) => {
    if (files.length > 0) {
      setProductData(prev => ({ ...prev, mainImage: files[0] }));
    }
  };

  // Logic quan trọng: Giới hạn số lượng ảnh phụ là 5
  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const spaceLeft = 5 - productData.additionalImages.length;
      const filesToUpload = files.slice(0, spaceLeft);
      setProductData(prev => ({ ...prev, additionalImages: [...prev.additionalImages, ...filesToUpload] }));
    }
  };

  const removeAdditionalImage = (indexToRemove: number) => {
    setProductData(prev => ({ ...prev, additionalImages: prev.additionalImages.filter((_, index) => index !== indexToRemove) }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ...
    navigate('/seller-dashboard/products');
  };

  return (
    <div className={s.addProductPage}>
      <form onSubmit={handleSubmit} className={s.formGrid}>
        {/* === CỘT TRÁI (MEDIA) === */}
        <div className={s.mediaColumn}>
          <div className={s.card}>
            <h3>Main Image</h3>
            <div className={s.mainImageContainer}>
              {productData.mainImage ? (
                <>
                  <img src={URL.createObjectURL(productData.mainImage)} alt="Main Preview" />
                  <button type="button" className={s.deleteButton} onClick={() => setProductData(p => ({ ...p, mainImage: undefined }))}>&times;</button>
                </>
              ) : (
                <ImageUploader onFilesAccepted={handleMainImageChange} />
              )}
            </div>
          {/* </div>
          <div className={s.card}> */}
            <h3>Others Images</h3>
            <div className={s.othersImagesGrid}>
              {/* Ô đầu tiên LUÔN LÀ NÚT UPLOAD */}
              <div className={s.uploadTile} onClick={() => additionalImagesInputRef.current?.click()}>
                <IconPlus />
                <span>Upload</span>
                <input ref={additionalImagesInputRef} type="file" multiple accept="image/*" className={s.hiddenInput} onChange={handleAdditionalImagesChange} />
              </div>

              {productData.additionalImages.map((file, index) => (
                <div key={index} className={s.imagePreviewTile}>
                  <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
                  <button type="button" className={s.deleteButton} onClick={() => removeAdditionalImage(index)}>&times;</button>
                </div>
              ))}
              {Array.from({ length: 5 - productData.additionalImages.length }).map((_, index) => (
                <div key={index} className={s.placeholderTile}></div>
              ))}
            </div>
          </div>
        </div>

        {/* === CỘT PHẢI (DETAILS) === */}
        <div className={s.detailsColumn}>
          <div className={s.card}>
            <div className={s.formGroup}>
              <label htmlFor="name">Product Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className={s.formGroup}>
              <label htmlFor="shortName">Short Name</label>
              <input type="text" id="shortName" name="shortName" />
            </div>
            <div className={s.formRow}>
              <div className={s.formGroup}>
                <label htmlFor="price">Price</label>
                <input type="number" id="price" name="price" required min="0" step="0.01" />
              </div>
              <div className={s.formGroup}>
                <label htmlFor="discount">Discount (%)</label>
                <input type="number" id="discount" name="discount" min="0" max="100" />
              </div>
              <div className={s.formGroup}>
                <label htmlFor="stock_quantity">Stock Quantity</label>
                <input type="number" id="stock_quantity" name="stock_quantity" required min="0" />
              </div>
            </div>
            <div className={s.formGroup}>
              <label>Category (Tags)</label>
              <CategoryInput categories={productData.categories} onCategoriesChange={(cats) => setProductData(p => ({ ...p, categories: cats }))} />
            </div>
            <div className={s.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" rows={15}></textarea>
            </div>
            <div className={s.actions}>
              <div className={s.toggleGroup}>
                <ToggleSwitch checked={productData.isActive} onChange={(c) => setProductData(p => ({ ...p, isActive: c }))} />
                <label>Product active</label>
              </div>
              <div className={s.buttonGroup}>
                <button type="button" onClick={() => navigate('/seller-dashboard/products')} className={s.cancelButton}>Cancel</button>
                <button type="submit" className={s.saveButton}>Save</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const ImageUploader = ({ onFilesAccepted }: { onFilesAccepted: (files: File[]) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) onFilesAccepted(Array.from(e.target.files));
  };
  return (
    <div className={s.imageUploader} onClick={() => fileInputRef.current?.click()}>
      <IconPlus />
      <p>Drag & Drop or <span>Browse</span></p>
      <input ref={fileInputRef} type="file" className={s.hiddenInput} accept="image/*" onChange={handleFileSelect} />
    </div>
  );
};

export default AddProductPage;