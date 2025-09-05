import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './ManageOrders.module.scss';
import { formatDateTime } from 'src/Functions/formatting.ts';
import api from 'src/Api/index.api.ts';
import type { ORDER_STATUS } from 'src/Types/common.ts';

// Dữ liệu giả - sau này sẽ lấy từ API

type Order = {
  id: string;
  orderId: number;
  customer: string;
  date: string;
  total: number;
  status: ORDER_STATUS;
};

const ManageOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
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
  
  useEffect(() => {
    api.seller.getOrders()
      .then(orders => {
        console.log("Fetched orders:", orders);
        setOrders(orders);
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
      });
  }, []);

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
                <tr key={order.orderId}>
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