import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './ManageProducts.module.scss';

// --- Dữ liệu giả (sau này sẽ lấy từ API) ---
const mockProducts = [
  { id: 'p001', imageUrl: 'https://via.placeholder.com/40x40', name: 'Gaming Chair, local pickup only', sku: 'CLW-BLK-01', stock: 56, price: 150.00, discount: 10, sold: 120, rating: { score: 4.8, count: 82 }, status: 'Active' },
  { id: 'p002', imageUrl: 'https://via.placeholder.com/40x40', name: 'Heimer Miller Sofa (Mint Condition)', sku: 'WBH-RED-05', stock: 24, price: 89.99, discount: 0, sold: 250, rating: { score: 4.9, count: 156 }, status: 'Active' },
  { id: 'p003', imageUrl: 'https://via.placeholder.com/40x40', name: 'Playstation 4 Limited Edition', sku: 'OGT-50B-01', stock: 0, price: 12.50, discount: 0, sold: 500, rating: { score: 4.5, count: 230 }, status: 'OutOfStock' },
  { id: 'p004', imageUrl: 'https://via.placeholder.com/40x40', name: 'Brand New Bike, Local buyer only', sku: 'MSL-WHT-11', stock: 12, price: 210.00, discount: 15, sold: 45, rating: { score: 4.2, count: 21 }, status: 'LowStock' },
  { id: 'p005', imageUrl: 'https://via.placeholder.com/40x40', name: 'Lego Star War edition', sku: 'HWB-OAK-01', stock: 52, price: 45.00, discount: 0, sold: 88, rating: { score: 0, count: 0 }, status: 'Active' },
];

const StarRating = ({ score, count }: { score: number, count: number }) => {
  if (count === 0) {
    return <span className={s.noRating}>—</span>;
  }
  return (
    <div className={s.ratingCell}>
      <span className={s.star}>⭐</span>
      <span className={s.score}>{score.toFixed(1)}</span>
      <span className={s.count}>({count})</span>
    </div>
  );
};

// --- Component ManageProducts ---
const ManageProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('All');

  // Logic lọc sản phẩm dựa trên tab và ô tìm kiếm
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        if (activeTab === 'OutOfStock') return p.stock === 0;
        if (activeTab === 'LowStock') return p.stock > 0 && p.stock <= 15;
        return true;
      })
      .filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [products, searchTerm, activeTab]);


  const handleEditProduct = (productId: string) => {
    // Điều hướng đến trang edit với ID của sản phẩm
    navigate(`edit/${productId}`);
  };
  // Logic xử lý chọn/bỏ chọn sản phẩm
  const handleSelectProduct = (productId: string) => {
    setSelectedProductIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map(p => p.id)); // Chọn tất cả
    }
  };
  
  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProductIds.length} selected products?`)) {
      setProducts(prev => prev.filter(p => !selectedProductIds.includes(p.id)));
      setSelectedProductIds([]); // Reset lựa chọn
      alert(`${selectedProductIds.length} products deleted.`);
    }
  };

  return (
    <div className={s.manageProductsPage}>
      <header className={s.header}>
        <h1>Products</h1>
        <div className={s.headerActions}>
          <button className={s.uploadBtn}>↑ Upload CSV</button>
          <button onClick={() => navigate('new')} className={s.addProductBtn}>+ Add product</button>
        </div>
      </header>

      <div className={s.card}>
        <div className={s.filterTabs}>
          <button onClick={() => setActiveTab('All')} className={activeTab === 'All' ? s.active : ''}>All {products.length}</button>
          <button onClick={() => setActiveTab('OutOfStock')} className={activeTab === 'OutOfStock' ? s.active : ''}>Out of stock {products.filter(p => p.stock === 0).length}</button>
          <button onClick={() => setActiveTab('LowStock')} className={activeTab === 'LowStock' ? s.active : ''}>Low stock {products.filter(p => p.stock > 0 && p.stock <= 15).length}</button>
        </div>

        <div className={s.toolbar}>
          <input 
            type="text" 
            placeholder="Search..." 
            className={s.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className={s.filterBtn}>Filters</button>
        </div>

        <div className={s.tableContainer}>
          <table className={s.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" checked={selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0} onChange={handleSelectAll} /></th>
                <th>Product name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Stock</th>
                <th>Sold</th>
                <th>Rating</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className={selectedProductIds.includes(product.id) ? s.selected : ''}>
                  <td><input type="checkbox" checked={selectedProductIds.includes(product.id)} onChange={() => handleSelectProduct(product.id)} /></td>
                  <td className={s.productCell}>
                    <img src={product.imageUrl} alt={product.name} className={s.productImage} />
                    <span>{product.name}</span>
                  </td>
                  <td>{product.sku}</td>
                  {/* 4. Thêm các ô dữ liệu mới vào body của bảng */}
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    {product.discount > 0 ? `${product.discount}%` : '—'}
                  </td>
                  <td>{product.stock}</td>
                  <td>{product.sold}</td>
                  <td>
                    <StarRating score={product.rating.score} count={product.rating.count} />
                  </td>
                  <td><span className={`${s.status} ${s[product.status.toLowerCase()]}`}>{product.status}</span></td>
                  <td><button className={s.moreActionsBtn} onClick={() => handleEditProduct(product.id)}>...</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProductIds.length > 0 && (
        <div className={s.bulkActionBar}>
          <span>{selectedProductIds.length} items selected</span>
          <div className={s.bulkActions}>
            <button>Print labels</button>
            <button>Export CSV</button>
            <button onClick={handleBulkDelete} className={s.deleteAction}>Delete</button>
          </div>
          <button onClick={() => setSelectedProductIds([])} className={s.clearSelection}>Clear selections</button>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;