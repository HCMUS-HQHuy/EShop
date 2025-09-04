import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './ManageOrders.module.scss';
import { formatDateTime } from 'src/Functions/formatting.ts';

// Dữ liệu giả - sau này sẽ lấy từ API
const mockOrders = [
  { id: 'ORD-1234', orderId: 1234, customer: 'John Doe', date: '2025-09-05T10:30:00Z', total: 150.00, status: 'Processing' },
  { id: 'ORD-1235', orderId: 1235, customer: 'Jane Smith', date: '2025-09-05T09:15:00Z', total: 75.50, status: 'Shipped' },
  { id: 'ORD-1236', orderId: 1236, customer: 'Peter Jones', date: '2025-09-04T15:00:00Z', total: 250.00, status: 'Delivered' },
  { id: 'ORD-1237', orderId: 1237, customer: 'Alice Williams', date: '2025-09-03T11:00:00Z', total: 35.20, status: 'Cancelled' },
];

const ManageOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = useMemo(() => {
    return orders
      .filter(o => activeTab === 'All' || o.status === activeTab)
      .filter(o =>
        o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `#${o.orderId}`.includes(searchTerm.toLowerCase())
      );
  }, [orders, activeTab, searchTerm]);
  
  const handleViewDetails = (orderId: number) => {
    navigate(`/seller/orders/${orderId}`);
  };

  return (
    <div className={s.manageOrdersPage}>
      <header className={s.header}>
        <h1>Manage Orders</h1>
      </header>

      <div className={s.card}>
        <div className={s.filterTabs}>
          <button onClick={() => setActiveTab('All')} className={activeTab === 'All' ? s.active : ''}>All</button>
          <button onClick={() => setActiveTab('Processing')} className={activeTab === 'Processing' ? s.active : ''}>Processing</button>
          <button onClick={() => setActiveTab('Shipped')} className={activeTab === 'Shipped' ? s.active : ''}>Shipped</button>
          <button onClick={() => setActiveTab('Delivered')} className={activeTab === 'Delivered' ? s.active : ''}>Delivered</button>
          <button onClick={() => setActiveTab('Cancelled')} className={activeTab === 'Cancelled' ? s.active : ''}>Cancelled</button>
        </div>

        <div className={s.toolbar}>
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer..." 
            className={s.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={s.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className={s.orderId} onClick={() => handleViewDetails(order.orderId)}>#{order.orderId}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>{order.customer}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td><span className={`${s.status} ${s[order.status.toLowerCase()]}`}>{order.status}</span></td>
                  <td><button onClick={() => handleViewDetails(order.orderId)} className={s.actionBtn}>View Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;