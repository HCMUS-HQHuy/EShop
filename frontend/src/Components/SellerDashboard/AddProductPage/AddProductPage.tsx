import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductSchema from 'src/Types/product.ts';
import CategoryInput from 'src/Components/Shared/CategoryInput/CategoryInput.tsx';
import ToggleSwitch from 'src/Components/Shared/ToggleSwitch/ToggleSwitch.tsx';
import s from './AddProductPage.module.scss';
import api from 'src/Api/index.api.ts';
import LoadingPage from 'src/Components/LoadingPage/LoadingPage.tsx';

// Component Icon nhỏ để tái sử dụng
const IconPlus = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5V19" stroke="#848d97" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 12H19" stroke="#848d97" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

const AddProductPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditMode = Boolean(productId);

  const additionalImagesInputRef = useRef<HTMLInputElement>(null);
  const [productData, setProductData] = useState({
    name: '', shortName: '', sku: '', description: '', price: '', discount: '', stock_quantity: '',
    mainImage: undefined as File | undefined,
    additionalImages: [] as File[],
    deletedImages: [] as string[],
    categories: [] as number[],
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      console.log(`Fetching data for product: ${productId}`);
      api.product.shopFetchById(productId as string).then(res => {
        const { product } = res.data;
        setProductData({
          ...product,
          isActive: product.status === 'Active',
          deletedImages: [],
        });
      }).catch(err => {
        console.error('Error fetching product data:', err);
        alert('Failed to load product data.');
        navigate('/seller/products');
      }).finally(() => {
        setIsLoading(false);
      });
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
    setProductData(prev => {
      const updatedAdditionalImages = prev.additionalImages.filter((_, index) => index !== indexToRemove);
      const removedImage = prev.additionalImages[indexToRemove];
      const shouldAddToDeleted = removedImage && !(removedImage instanceof File);

      const updatedDeletedImages = shouldAddToDeleted
        ? [...prev.deletedImages, removedImage as string]
        : prev.deletedImages;

      return {
        ...prev,
        additionalImages: updatedAdditionalImages,
        deletedImages: updatedDeletedImages,
      };
    });
  };

  // 3. Đây là phần quan trọng nhất: Sửa lại hoàn toàn handleSubmit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationResult = isEditMode ? ProductSchema.EditingRequest.safeParse(productData)
      : ProductSchema.CreatingRequest.safeParse(productData);
    if (!validationResult.success) {
      console.error("Validation errors:", validationResult.error.format());
      alert('Please fix validation errors before submitting.');
      return;
    }
    const formData = new FormData();

    // Thêm các trường dữ liệu dạng text/number vào FormData
    formData.append('name', productData.name);
    formData.append('shortName', productData.shortName);
    formData.append('sku', productData.sku);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('discount', productData.discount);
    formData.append('stock_quantity', productData.stock_quantity);
    formData.append('status', productData.isActive ? 'Active' : 'Inactive');

    productData.categories.forEach(category => {
      formData.append('categories[]', String(category));
    });
    if (productData.mainImage) {
      formData.append('mainImage', productData.mainImage);
    }
    productData.additionalImages.forEach(file => {
      formData.append('additionalImages', file);
    });

    try {
      console.log('Submitting FormData...');
      if (isEditMode) {
        if (productId === undefined)
          throw new Error('Product ID is required for editing.');
        productData.deletedImages.forEach(url => {
          formData.append('deletedImages[]', url);
        });
        console.log('Editing product with ID:', productId, formData);
        await api.product.shopUpdateById(productId, formData);
      } else {
        await api.product.create(formData);
      }
      navigate('/seller/products');
    } catch (err) {
      console.error('Error creating product:', err);
      alert('Failed to create product.');
    }
  };

  if (isLoading) {
    return <LoadingPage />;
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
                  <img src={typeof productData.mainImage === 'string' ? productData.mainImage : URL.createObjectURL(productData.mainImage)} alt="Main Preview" />
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
                  <img src={typeof file === 'string' ? file : URL.createObjectURL(file)} alt={`Preview ${index}`} />
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
            <div className={`${s.formRow}`}>
              <div className={`${s.formGroup}`}>
                <label htmlFor="shortName">Short Name</label>
                <input type="text" id="shortName" name="shortName" value={productData.shortName} onChange={handleChange} />
              </div>
              <div className={s.formGroup}>
                <label htmlFor="sku">SKU</label>
                <input type="text" id="sku" name="sku" value={productData.sku} onChange={handleChange} required />
              </div>
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
              <label>Categories</label>
              <CategoryInput categoryIds={productData.categories} onCategoriesChange={(cats) => setProductData(p => ({ ...p, categories: cats }))} />
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
                <button type="button" onClick={() => navigate('/seller/products')} className={s.cancelButton}>Cancel</button>
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