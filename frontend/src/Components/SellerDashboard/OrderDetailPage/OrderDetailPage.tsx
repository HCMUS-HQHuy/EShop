import { Link, useParams } from 'react-router-dom';
import s from './OrderDetailPage.module.scss';
import { useEffect, useState } from 'react';
import api from 'src/Api/index.api.ts';
import { ORDER_STATUS } from 'src/Types/common.ts';

type orderDetails = {
    orderId: number;
    date: string;
    status: string;
    customer: { name: string; email: string; phone: string; };
    shippingAddress: string;
    items: {
        id: string;
        name: string;
        sku: string;
        quantity: number;
        price: number;
        discount: number;
        imageUrl: string;
    }[];
    summary: {
        subtotal: number;
        shipping: number;
        discount: number;
        total: number;
    };
};

// Dữ liệu giả - sau này sẽ fetch từ API bằng orderId
const mockOrderDetail = {
    orderId: 1234,
    date: '2025-09-05T10:30:00Z',
    status: 'Processing',
    customer: { name: 'John Doe', email: 'john.doe@example.com', phone: '555-1234' },
    shippingAddress: '123 Main St, Anytown, USA 12345',
    items: [
        { id: 'p001', name: 'NETGEAR R6700 Nighthawk', sku: '382934', quantity: 1, price: 99.00, discount: 5, imageUrl: 'https://via.placeholder.com/40' },
        { id: 'p002', name: 'Arlo Technologies NETGEAR Baby Monitor', sku: '382955', quantity: 2, price: 19.00, discount: 0, imageUrl: 'https://via.placeholder.com/40' },
        { id: 'p003', name: 'Nintendo Switch Pro Controller', sku: 'N-0392', quantity: 1, price: 19.00, discount: 10, imageUrl: 'https://via.placeholder.com/40' },
    ],
    summary: { subtotal: 137.00, shipping: 2.00, discount: 6.85, total: 132.15 }
};

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState<orderDetails | null>(null);

    useEffect(() => {
        // Fetch order details from API
        api.seller.getOrderDetails(Number(orderId)).then(data => {
            setOrder(data);
        });
    }, [orderId]);

    if (!order) {
        return <div>Loading...</div>;
    }

    return (
        <div className={s.orderDetailPage}>
            <header className={s.header}>
                <div className={s.headerInfo}>
                    <Link to="/seller/orders" className={s.backLink}>&larr; Back to Orders</Link>
                    <h1>Order #{orderId}</h1>
                    <span className={`${s.status} ${s[order.status.toLowerCase()]}`}>{order.status}</span>
                </div>
            </header>

            <div className={s.layoutGrid}>
                <div className={s.mainContent}>
                    <div className={s.tableContainer}>
                        <table className={s.itemsTable}>
                            <thead>
                                <tr>
                                    <th className={s.imageCol}>#</th>
                                    <th className={s.skuCol}>SKU</th>
                                    <th className={s.nameCol}>Name</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th>Disc.</th>
                                    <th className={s.totalCol}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map(item => {
                                    const totalBeforeDiscount = item.price * item.quantity;
                                    const totalAfterDiscount = totalBeforeDiscount * (1 - item.discount / 100);
                                    return (
                                        <tr key={item.id}>
                                            <td><img src={item.imageUrl} alt={item.name} /></td>
                                            <td>{item.sku}</td>
                                            <td>{item.name}</td>
                                            <td>${item.price.toFixed(2)}</td>
                                            <td>x {item.quantity}</td>
                                            <td className={s.discountCell}>
                                                {item.discount > 0 ? `${item.discount}%` : '—'}
                                            </td>
                                            <td className={s.totalCol}>${totalAfterDiscount.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className={s.summaryContainer}>
                        <div className={s.summaryRow}>
                            <span>Subtotal</span>
                            <span>${order.summary.subtotal.toFixed(2)}</span>
                        </div>
                        <div className={s.summaryRow}>
                            <span>Shipping</span>
                            <span>${order.summary.shipping.toFixed(2)}</span>
                        </div>
                        <div className={s.summaryRow}>
                            <span>Discount</span>
                            <span className={s.discountCell}>-${order.summary.discount.toFixed(2)}</span>
                        </div>
                        <div className={`${s.summaryRow} ${s.grandTotal}`}>
                            <span>Total</span>
                            <span>${order.summary.total.toFixed(2)}</span>
                        </div>
                    </div>

                </div>

                <div className={s.sideContent}>
                    <div className={s.card}>
                        <h3 className={s.cardTitle}>Customer</h3>
                        <div className={s.infoContainer}>
                            <p className={s.infoItem}><strong>Name:</strong> {order.customer.name}</p>
                            <p className={s.infoItem}><strong>Email:</strong> {order.customer.email}</p>
                            <p className={s.infoItem}><strong>Phone:</strong> {order.customer.phone}</p>
                        </div>
                    </div>
                    <div className={s.card}>
                        <h3 className={s.cardTitle}>Shipping Address</h3>
                        <p className={s.shippingAddress}>{order.shippingAddress}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;