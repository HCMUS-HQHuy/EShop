import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductSchema from 'src/Types/product.ts';
import CategoryInput from 'src/Components/Shared/CategoryInput/CategoryInput.tsx';
import ToggleSwitch from 'src/Components/Shared/ToggleSwitch/ToggleSwitch.tsx';
import s from './AddProductPage.module.scss';
import api from 'src/Api/index.api.ts';

// Component Icon nhỏ để tái sử dụng
const IconPlus = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5V19" stroke="#848d97" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 12H19" stroke="#848d97" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

const AddProductPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditMode = Boolean(productId);

  const additionalImagesInputRef = useRef<HTMLInputElement>(null);
  const [productData, setProductData] = useState({
    name: '', shortName: '', description: '', price: '', discount: '', stock_quantity: '',
    mainImage: undefined as File | undefined,
    additionalImages: [] as File[],
    categories: [] as string[],
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      // ---- Dùng dữ liệu giả để test ----
      console.log(`Fetching data for product: ${productId}`);
      const mockProductToEdit = {
        name: 'Gaming Chair, local pickup only', shortName: 'Gaming Chair', 
        description: 'A very comfortable chair for gamers.', price: 150.00, discount: 10, 
        stock_quantity: 56, mainImage: null, additionalImages: [], 
        categories: ['Furniture', 'Gaming'], isActive: true,
      };
      
      // Chuyển đổi dữ liệu mock để phù hợp với state
      setProductData({
        ...mockProductToEdit,
        mainImage: undefined,
        price: String(mockProductToEdit.price),
        discount: String(mockProductToEdit.discount),
        stock_quantity: String(mockProductToEdit.stock_quantity),
      });
      setIsLoading(false);
    }
  }, [productId, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProductData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMainImageChange = (files: File[]) => {
    if (files.length > 0) {
      setProductData(prev => ({ ...prev, mainImage: files[0] }));
    }
  };

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

  // 3. Đây là phần quan trọng nhất: Sửa lại hoàn toàn handleSubmit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationResult = ProductSchema.CreatingRequest.safeParse(productData);
    if (!validationResult.success) {
      console.error("Validation errors:", validationResult.error.format());
      alert('Please fix validation errors before submitting.');
      return;
    }

    // Tạo một đối tượng FormData
    const formData = new FormData();

    // Thêm các trường dữ liệu dạng text/number vào FormData
    formData.append('name', productData.name);
    formData.append('shortName', productData.shortName);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('discount', productData.discount);
    formData.append('stock_quantity', productData.stock_quantity);
    formData.append('status', productData.isActive ? 'Active' : 'Inactive');

    productData.categories.forEach(category => {
      formData.append('categories[]', category);
    });
    if (productData.mainImage) {
      formData.append('mainImage', productData.mainImage);
    }
    productData.additionalImages.forEach(file => {
      formData.append('additionalImages', file);
    });

    try {
      // Gửi đối tượng formData đi
      console.log('Submitting FormData...');
      await api.product.create(formData);
      alert('Product created successfully! (Simulation)');
      navigate('/seller-dashboard/products');
    } catch (err) {
      console.error('Error creating product:', err);
      alert('Failed to create product.');
    }
  };

  if (isLoading) {
    return <div>Loading product data...</div>;
  }

  return (
    <div className={s.addProductPage}>
      <header className={s.header}>
        <h1>{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
      </header>
      <form onSubmit={handleSubmit} className={s.formGrid}>
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
                <h3>Others Images</h3>
                <div className={s.othersImagesGrid}>
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
        <div className={s.detailsColumn}>
          <div className={s.card}>
            <div className={s.formGroup}>
              <label htmlFor="name">Product Name</label>
              <input type="text" id="name" name="name" value={productData.name} onChange={handleChange} required />
            </div>
            <div className={s.formGroup}>
              <label htmlFor="shortName">Short Name</label>
              <input type="text" id="shortName" name="shortName" value={productData.shortName} onChange={handleChange} />
            </div>
            <div className={s.formRow}>
              <div className={s.formGroup}>
                <label htmlFor="price">Price</label>
                <input type="number" id="price" name="price" value={productData.price} required min="0" step="0.01" onChange={handleChange} />
              </div>
              <div className={s.formGroup}>
                <label htmlFor="discount">Discount (%)</label>
                <input type="number" id="discount" name="discount" value={productData.discount} min="0" max="100" onChange={handleChange} />
              </div>
              <div className={s.formGroup}>
                <label htmlFor="stock_quantity">Stock Quantity</label>
                <input type="number" id="stock_quantity" name="stock_quantity" value={productData.stock_quantity} required min="0" onChange={handleChange} />
              </div>
            </div>
            <div className={s.formGroup}>
              <label>Category (Tags)</label>
              <CategoryInput categories={productData.categories} onCategoriesChange={(cats) => setProductData(p => ({ ...p, categories: cats }))} />
            </div>
            <div className={s.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" rows={15} value={productData.description} onChange={handleChange}></textarea>
            </div>
            <div className={s.actions}>
              <div className={s.toggleGroup}>
                <ToggleSwitch checked={productData.isActive} onChange={(c) => setProductData(p => ({ ...p, isActive: c }))} />
                <label>Product active</label>
              </div>
              <div className={s.buttonGroup}>
                <button type="button" onClick={() => navigate('/seller-dashboard/products')} className={s.cancelButton}>Cancel</button>
                <button type="submit" className={s.saveButton}>{isEditMode ? 'Update Product' : 'Save Product'}</button>
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