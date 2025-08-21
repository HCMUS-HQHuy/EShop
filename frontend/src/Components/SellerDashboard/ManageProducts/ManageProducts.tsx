import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './ManageProducts.module.scss';

// Dữ liệu giả - sau này sẽ lấy từ API
const mockProducts = [
  { id: 'p001', imageUrl: 'https://via.placeholder.com/60', name: 'Classic Leather Watch', sku: 'CLW-BLK-01', stock: 75, price: 150.00, status: 'Active' },
  { id: 'p002', imageUrl: 'https://via.placeholder.com/60', name: 'Wireless Bluetooth Headphones', sku: 'WBH-RED-05', stock: 120, price: 89.99, status: 'Active' },
  { id: 'p003', imageUrl: 'https://via.placeholder.com/60', name: 'Organic Green Tea (50 bags)', sku: 'OGT-50B-01', stock: 0, price: 12.50, status: 'OutOfStock' },
  { id: 'p004', imageUrl: 'https://via.placeholder.com/60', name: 'Modern Standing Lamp', sku: 'MSL-WHT-11', stock: 32, price: 210.00, status: 'Draft' },
  { id: 'p005', imageUrl: 'https://via.placeholder.com/60', name: 'Handcrafted Wooden Bowl', sku: 'HWB-OAK-01', stock: 15, price: 45.00, status: 'Active' },
];

const ManageProducts = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate('new');
  };

  const handleEditProduct = (productId: string) => {
    alert(`Editing product: ${productId}`);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm(`Are you sure you want to delete product ${productId}?`)) {
      // TODO: Gọi API để xóa sản phẩm
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
      alert(`Product ${productId} deleted.`);
    }
  };

  // Lọc sản phẩm dựa trên ô tìm kiếm
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={s.manageProducts}>
      <header className={s.header}>
        <h1>Manage Products</h1>
        <button onClick={handleAddProduct} className={s.addProductBtn}>
          + Add New Product
        </button>
      </header>

      <div className={s.toolbar}>
        <input 
          type="text" 
          placeholder="Search by name or SKU..." 
          className={s.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* TODO: Thêm các bộ lọc (filter) ở đây nếu cần */}
      </div>

      <div className={s.tableContainer}>
        <table className={s.productTable}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>SKU</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td><img src={product.imageUrl} alt={product.name} className={s.productImage} /></td>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.stock}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <span className={`${s.status} ${s[product.status.toLowerCase()]}`}>
                    {product.status}
                  </span>
                </td>
                <td className={s.actions}>
                  <button onClick={() => handleEditProduct(product.id)} className={`${s.actionBtn} ${s.editBtn}`}>Edit</button>
                  <button onClick={() => handleDeleteProduct(product.id)} className={`${s.actionBtn} ${s.deleteBtn}`}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={s.pagination}>
        <button>&laquo; Prev</button>
        <span>Page 1 of 5</span>
        <button>Next &raquo;</button>
      </div>
    </div>
  );
};

export default ManageProducts;