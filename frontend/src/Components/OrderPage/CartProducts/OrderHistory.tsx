// OrderHistory.tsx
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useState } from "react";
import s from "./OrderHistory.module.scss";
import type { RootState } from "src/Types/store.ts";
import { ORDER_STATUS } from "src/Types/common.ts";

interface Order {
    orderId: string;
    orderDate: string;
    status: ORDER_STATUS;
    totalAmount: number;
    customerInfo: {
        name: string;
        phone: string;
        address: string;
    };
    products: Array<{
        productId: string;
        name: string;
        image: string;
        price: number;
        quantity: number;
        subtotal: number;
    }>;
    shippingFee: number;
    tax: number;
    discount?: number;
}

const OrderHistory = () => {
    const { t } = useTranslation();
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

    // Giả sử bạn có orders trong Redux store
    const mockOrders: Order[] = [
        {
            orderId: "ORD-2024-001234",
            orderDate: "2024-09-03T14:30:00Z",
            status: ORDER_STATUS.SHIPPING,
            totalAmount: 3489.35,
            customerInfo: {
                name: "Nguyễn Văn Minh",
                phone: "+84 901 234 567",
                address: "123 Đường Lê Lợi, Phường Phú Hội, Thành phố Huế"
            },
            products: [
                {
                    productId: "IPHONE14PM-128GB-PURPLE",
                    name: "iPhone 14 Pro Max",
                    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
                    price: 1099.00,
                    quantity: 1,
                    subtotal: 1099.00
                },
                {
                    productId: "AIRPODS-PRO-2ND-WHITE",
                    name: "AirPods Pro (2nd generation)",
                    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop",
                    price: 249.00,
                    quantity: 1,
                    subtotal: 249.00
                }
            ],
            shippingFee: 25.00,
            tax: 167.35,
            discount: 50.00
        },
        {
            orderId: "ORD-2024-001235",
            orderDate: "2024-09-01T10:15:00Z",
            status: ORDER_STATUS.DELIVERED,
            totalAmount: 1299.99,
            customerInfo: {
                name: "Trần Thị Lan",
                phone: "+84 907 654 321",
                address: "456 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
            },
            products: [
                {
                    productId: "MBP13-M2-256GB-SILVER",
                    name: "MacBook Air 13\" M2",
                    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop",
                    price: 1199.00,
                    quantity: 1,
                    subtotal: 1199.00
                }
            ],
            shippingFee: 20.00,
            tax: 80.99,
            discount: 0
        },
        {
            orderId: "ORD-2024-001236",
            orderDate: "2024-08-28T16:45:00Z",
            status: ORDER_STATUS.PENDING,
            totalAmount: 599.99,
            customerInfo: {
                name: "Lê Văn Hoàng",
                phone: "+84 912 345 678",
                address: "789 Đường Trần Hưng Đạo, Quận 5, TP. Hồ Chí Minh"
            },
            products: [
                {
                    productId: "IPAD-AIR-64GB-BLUE",
                    name: "iPad Air 5th Gen",
                    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop",
                    price: 579.00,
                    quantity: 1,
                    subtotal: 579.00
                }
            ],
            shippingFee: 15.00,
            tax: 29.99,
            discount: 24.00
        }
    ];

    const ordersData = mockOrders;
    const orderStatusLabels = "orderHistory.status";

    // Filter orders based on status
    const filteredOrders = selectedStatus === 'all'
        ? ordersData
        : ordersData.filter((order: Order) => order.status === selectedStatus);

    const toggleOrderDetails = (orderId: string) => {
        const newExpandedOrders = new Set(expandedOrders);
        if (newExpandedOrders.has(orderId)) {
            newExpandedOrders.delete(orderId);
        } else {
            newExpandedOrders.add(orderId);
        }
        setExpandedOrders(newExpandedOrders);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount * 1000); // Assuming prices are in thousands
    };

    return (
        <div className={s.orderHistory}>
            {filteredOrders.length === 0 ? (
                <div className={s.emptyState}>
                    <p>{t('orderHistory.noOrders', 'No orders found')}</p>
                </div>
            ) : (
                <div className={s.ordersContainer}>
                    {filteredOrders.map((order: Order) => {
                        const isExpanded = expandedOrders.has(order.orderId);

                        return (
                            <div key={order.orderId} className={s.orderCard}>
                                {/* Order Summary - Always Visible */}
                                <div className={s.orderSummary}>
                                    <div className={s.orderBasicInfo}>
                                        <h3 className={s.orderId}>
                                            {t('orderHistory.orderNumber', 'Order')}: {order.orderId}
                                        </h3>
                                        <p className={s.orderDate}>
                                            {formatDate(order.orderDate)}
                                        </p>
                                    </div>

                                    <div className={s.orderActions}>
                                        <button
                                            className={s.toggleBtn}
                                            onClick={() => toggleOrderDetails(order.orderId)}
                                        >
                                            {isExpanded
                                                ? t('orderHistory.hideDetails', 'Hide')
                                                : t('orderHistory.showDetails', 'Show')
                                            }
                                            <span className={`${s.toggleIcon} ${isExpanded ? s.expanded : ''}`}>
                                                ▼
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className={s.orderDetails}>
                                    <div className={s.orderMeta}>
                                        <div className={s.statusContainer}>
                                            <span className={s.statusLabel}>
                                                {t('orderHistory.status.label', 'Status')}:
                                            </span>
                                            <span
                                                className={`${s.statusBadge} ${s[order.status.toLowerCase()]}`}
                                            >
                                                {t(`${orderStatusLabels}.${order.status}`, order.status)}
                                            </span>
                                        </div>
                                        <div className={s.totalAmount}>
                                            <span className={s.totalLabel}>
                                                {t('orderHistory.total', 'Total')}:
                                            </span>
                                            <span className={s.totalValue}>
                                                {formatCurrency(order.totalAmount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Details - Conditionally Visible */}
                                {isExpanded && (
                                    <div className={s.orderDetails}>
                                        {/* Status and Total */}

                                        {/* Customer Information */}
                                        <div className={s.customerInfo}>
                                            <h4 className={s.sectionTitle}>
                                                {t('orderHistory.customerInfo', 'Customer Information')}
                                            </h4>
                                            <div className={s.infoGrid}>
                                                <div className={s.infoRow}>
                                                    <span className={s.label}>{t('orderHistory.recipient', 'Recipient')}:</span>
                                                    <span className={s.value}>{order.customerInfo.name}</span>
                                                </div>
                                                <div className={s.infoRow}>
                                                    <span className={s.label}>{t('orderHistory.phone', 'Phone')}:</span>
                                                    <span className={s.value}>{order.customerInfo.phone}</span>
                                                </div>
                                                <div className={s.infoRow}>
                                                    <span className={s.label}>{t('orderHistory.address', 'Address')}:</span>
                                                    <span className={s.value}>{order.customerInfo.address}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Products */}
                                        <div className={s.productsSection}>
                                            <h4 className={s.sectionTitle}>
                                                {t('orderHistory.products', 'Products')} ({order.products.length})
                                            </h4>
                                            <div className={s.productsList}>
                                                {order.products.map((product) => (
                                                    <div key={product.productId} className={s.productItem}>
                                                        <div className={s.productImageContainer}>
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className={s.productImage}
                                                            />
                                                        </div>
                                                        <div className={s.productInfo}>
                                                            <h5 className={s.productName}>{product.name}</h5>
                                                            <p className={s.productId}>ID: {product.productId}</p>
                                                            <div className={s.productPricing}>
                                                                <span className={s.price}>{formatCurrency(product.price)}</span>
                                                                <span className={s.quantity}>x {product.quantity}</span>
                                                                <span className={s.subtotal}>{formatCurrency(product.subtotal)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Order Total Breakdown */}
                                        <div className={s.totalBreakdown}>
                                            <div className={s.totalRow}>
                                                <span>{t('orderHistory.subtotal', 'Subtotal')}:</span>
                                                <span>{formatCurrency(order.products.reduce((sum, p) => sum + p.subtotal, 0))}</span>
                                            </div>
                                            <div className={s.totalRow}>
                                                <span>{t('orderHistory.shipping', 'Shipping')}:</span>
                                                <span>{formatCurrency(order.shippingFee)}</span>
                                            </div>
                                            <div className={s.totalRow}>
                                                <span>{t('orderHistory.tax', 'Tax')}:</span>
                                                <span>{formatCurrency(order.tax)}</span>
                                            </div>
                                            {order.discount && order.discount > 0 && (
                                                <div className={s.totalRow}>
                                                    <span>{t('orderHistory.discount', 'Discount')}:</span>
                                                    <span className={s.discount}>-{formatCurrency(order.discount)}</span>
                                                </div>
                                            )}
                                            <div className={`${s.totalRow} ${s.finalTotal}`}>
                                                <span>{t('orderHistory.grandTotal', 'Grand Total')}:</span>
                                                <span>{formatCurrency(order.totalAmount)}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className={s.actionButtons}>
                                            {/* <button className={s.viewDetailsBtn}>
                                                {t('orderHistory.viewFullDetails', 'View Full Details')}
                                            </button>
                                            {(order.status === 'shipped' || order.status === 'processing') && (
                                                <button className={s.trackBtn}>
                                                    {t('orderHistory.trackOrder', 'Track Order')}
                                                </button>
                                            )} */}
                                            {order.status === ORDER_STATUS.PENDING && (
                                                <button className={s.cancelBtn}>
                                                    {t('orderHistory.cancelOrder', 'Cancel Order')}
                                                </button>
                                            )}
                                            <button className={s.reorderBtn}>
                                                {t('orderHistory.reorder', 'Reorder')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;