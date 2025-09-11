import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import z from 'zod';
import s from './ManageProducts.module.scss';
import api from 'src/Api/index.api.ts';
import { PRODUCT_STATUS } from 'src/Types/common.ts';


const rate = z.object({
  count: z.coerce.number().min(0),
  score: z.coerce.number().min(0).max(5)
})

const productViewSchema = z.object({
  productId: z.number().min(1),
  imageUrl: z.string().min(10).max(1000),
  shortName: z.string(),
  sku: z.string(),
  price: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).max(100).default(0),
  stockQuantity: z.coerce.number().min(0),
  sold: z.coerce.number().min(0).default(0),
  rating: rate.default({ count: 0, score: 0 }),
  status: z.enum(PRODUCT_STATUS),
});

type Rating = z.infer<typeof rate>;
type ProductView = z.infer<typeof productViewSchema>;

const StarRating = ({ score, count }: Rating) => {
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
  const [products, setProducts] = useState<ProductView[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.product.shopFetch();
        const products = response.data.products as ProductView[];
        const parsed = z.array(productViewSchema).safeParse(products.map((product: ProductView) => ({...product, rating: product.rating || { count: 0, score: 0 }})));
        if (parsed.success) {
          setProducts(parsed.data);
          console.log("Fetched products:", parsed.data);
          setIsReady(true);
        } else {
          console.error("Failed to parse products:", parsed.error);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Logic lọc sản phẩm dựa trên tab và ô tìm kiếm
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        if (activeTab === 'OutOfStock') return p.stockQuantity === 0;
        if (activeTab === 'LowStock') return p.stockQuantity > 0 && p.stockQuantity <= 15;
        return true;
      })
      .filter(p =>
        p.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [products, searchTerm, activeTab]);

  const handleEditProduct = (productId: number) => {
    navigate(`edit/${productId}`);
  };
  // Logic xử lý chọn/bỏ chọn sản phẩm
  const handleSelectProduct = (productId: number) => {
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
      setSelectedProductIds(filteredProducts.map(p => p.productId)); // Chọn tất cả
    }
  };
  
  const handleBulkDelete = () => {
    if (selectedProductIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedProductIds.length} selected products?`)) {
      api.product.shopDeleteById(selectedProductIds[0]!).then(() => {
        setProducts(prev => prev.filter(p => !selectedProductIds.includes(p.productId)));
        setSelectedProductIds([]);
      }).catch(err => {
        console.error("Failed to delete products:", err);
      });
    }
  };

  if (isReady === false) {
    return <div>Loading...</div>;
  }

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
          <button onClick={() => setActiveTab('OutOfStock')} className={activeTab === 'OutOfStock' ? s.active : ''}>Out of stock {products.filter(p => p.stockQuantity === 0).length}</button>
          <button onClick={() => setActiveTab('LowStock')} className={activeTab === 'LowStock' ? s.active : ''}>Low stock {products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 15).length}</button>
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
                <tr key={product.productId} className={selectedProductIds.includes(product.productId) ? s.selected : ''}>
                  <td><input type="checkbox" checked={selectedProductIds.includes(product.productId)} onChange={() => handleSelectProduct(product.productId)} /></td>
                  <td className={s.productCell}>
                    <img src={`${import.meta.env.VITE_PUBLIC_URL}/${product.imageUrl}`} alt={product.shortName} className={s.productImage} />
                    <span>{product.shortName}</span>
                  </td>
                  <td>{product.sku}</td>
                  {/* 4. Thêm các ô dữ liệu mới vào body của bảng */}
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    {product.discount > 0 ? `${product.discount}%` : '—'}
                  </td>
                  <td>{product.stockQuantity}</td>
                  <td>{product.sold}</td>
                  <td>
                    <StarRating score={product.rating.score} count={product.rating.count} />
                  </td>
                  <td><span className={`${s.status} ${s[product.status.toLowerCase()]}`}>{product.status}</span></td>
                  <td><button className={s.moreActionsBtn} onClick={() => handleEditProduct(product.productId)}>...</button></td>
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