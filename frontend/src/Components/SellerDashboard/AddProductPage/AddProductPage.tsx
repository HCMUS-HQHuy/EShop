import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import s from './AddProductPage.module.scss';

const AddProductPage = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '',
    sku: '',
    stock: 0,
    price: 0,
    description: '',
    status: 'Draft', // Mặc định là bản nháp
    image: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setProductData(prev => ({ ...prev, image: file }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Triển khai logic upload ảnh và gửi dữ liệu đến API
    console.log('Submitting new product:', productData);
    alert('Product added successfully! (Simulation)');
    // Sau khi thêm thành công, quay trở lại trang quản lý sản phẩm
    navigate('products');
  };

  return (
    <div className={s.addProductPage}>
      <header className={s.header}>
        <h1>Add New Product</h1>
        <Link to="/seller/products" className={s.backLink}>
          &larr; Back to Products
        </Link>
      </header>

      <form onSubmit={handleSubmit} className={s.form}>
        <div className={s.formGrid}>
          {/* Cột trái: Thông tin chính */}
          <div className={s.mainInfo}>
            <div className={s.formGroup}>
              <label htmlFor="name">Product Name</label>
              <input type="text" id="name" name="name" required onChange={handleChange} />
            </div>

            <div className={s.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" rows={8} onChange={handleChange}></textarea>
            </div>

            <div className={s.formRow}>
              <div className={s.formGroup}>
                <label htmlFor="sku">SKU (Stock Keeping Unit)</label>
                <input type="text" id="sku" name="sku" required onChange={handleChange} />
              </div>
              <div className={s.formGroup}>
                <label htmlFor="stock">Stock Quantity</label>
                <input type="number" id="stock" name="stock" required onChange={handleChange} min="0" />
              </div>
            </div>
          </div>

          {/* Cột phải: Giá, Trạng thái, Ảnh */}
          <div className={s.sideInfo}>
            <div className={s.formGroup}>
              <label htmlFor="price">Price ($)</label>
              <input type="number" id="price" name="price" required onChange={handleChange} min="0" step="0.01" />
            </div>

            <div className={s.formGroup}>
              <label htmlFor="status">Status</label>
              <select id="status" name="status" onChange={handleChange} value={productData.status}>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div className={s.formGroup}>
              <label>Product Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {productData.image && <img src={URL.createObjectURL(productData.image)} alt="Preview" className={s.imagePreview} />}
            </div>
          </div>
        </div>

        <div className={s.formActions}>
          <button type="submit" className={s.saveButton}>Save Product</button>
          <button type="button" onClick={() => navigate('/seller-dashboard/products')} className={s.cancelButton}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;