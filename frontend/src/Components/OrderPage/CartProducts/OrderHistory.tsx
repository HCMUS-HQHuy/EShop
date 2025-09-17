import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import s from "./OrderHistory.module.scss";
import type { RootState } from "src/Types/store.ts";
import { ORDER_STATUS } from "src/Types/common.ts";
import type { OrderItemType, OrderType } from "src/Types/product.ts";
import api from "src/Api/index.api.ts";

const OrderHistory = () => {
    const { t } = useTranslation();
    const [orderData, setOrderData] = useState<OrderType[]>(useSelector((state: RootState) => state.products.orderProducts));
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [expandedOrders, setExpandedOrders] = useState<number | null>(null);

    useEffect(() => {
        api.user.getOrders().then((res) => {
            console.log("Fetched Orders:", res);
            setOrderData(res.data.orders);
        });
    }, []);

    const orderStatusLabels = "orderHistory.status";

    const filteredOrders = selectedStatus === 'all'
        ? orderData
        : orderData.filter((order: OrderType) => order.status === selectedStatus);

    console.log("Filtered Orders:", filteredOrders);

    const toggleOrderDetails = (orderId: number) => {
        if (expandedOrders === orderId) {
            setExpandedOrders(null);
        } else {
            setExpandedOrders(orderId);
        }
    };

    const formatCurrency = (amount: number) => {
        console.log("Formatting amount:", amount);
        // return new Intl.NumberFormat('vi-VN', {
        //     style: 'currency',
        //     currency: 'VND'
        // }).format(amount * 1000);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className={s.orderHistory}>
            {filteredOrders.length === 0 ? (
                <div className={s.emptyState}>
                    <p>{t('orderHistory.noOrders', 'No orders found')}</p>
                </div>
            ) : (
                <div className={s.ordersContainer}>
                    {filteredOrders.map((order: OrderType) => {
                        const isExpanded = expandedOrders === order.orderId;

                        return (
                            <div key={order.orderId} className={s.orderCard}>
                                {/* Order Summary - Always Visible */}
                                <div className={s.orderSummary}>
                                    <div className={s.orderBasicInfo}>
                                        <h3 className={s.orderId}>
                                            {t('orderHistory.orderNumber', 'Order')}: #{order.orderId}
                                        </h3>
                                        <p className={s.orderDate}>
                                            Order At: {formatDate(order.createdAt)}
                                        </p>
                                        <p className={s.orderDate}>
                                            Payment Method: {t('orderHistory.paymentMethod.creditCard', 'Credit Card')}
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
                                                {formatCurrency(order.final)}
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
                                                    <span className={s.value}>{order.receiverName}</span>
                                                </div>
                                                <div className={s.infoRow}>
                                                    <span className={s.label}>{t('orderHistory.phone', 'Phone')}:</span>
                                                    <span className={s.value}>{order.phoneNumber}</span>
                                                </div>
                                                <div className={s.infoRow}>
                                                    <span className={s.label}>{t('orderHistory.address', 'Address')}:</span>
                                                    <span className={s.value}>{order.shippingAddress}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Products */}
                                        <div className={s.productsSection}>
                                            <h4 className={s.sectionTitle}>
                                                {t('orderHistory.products', 'Products')} ({order.orderItems.length})
                                            </h4>
                                            <div className={s.productsList}>
                                                {order.orderItems.map((item: OrderItemType) => (
                                                    <div key={item.product.productId} className={s.productItem}>
                                                        <div className={s.productImageContainer}>
                                                            <img
                                                                src={`${import.meta.env.VITE_PUBLIC_URL}/${item.product.imageUrl}`}
                                                                alt={item.product.name}
                                                                className={s.productImage}
                                                            />
                                                        </div>
                                                        <div className={s.productInfo}>
                                                            <h5 className={s.productName}>{item.product.name}</h5>
                                                            <div className={s.productPricing}>
                                                                <span className={s.price}>{formatCurrency(item.price)}</span>
                                                                <span className={s.quantity}>x {item.quantity}</span>
                                                                <span className={s.subtotal}>{formatCurrency(item.price)}</span>
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
                                                <span>{formatCurrency(calSubTotalProduct(order.orderItems))}</span>
                                            </div>
                                            <div className={s.totalRow}>
                                                <span>{t('orderHistory.shipping', 'Shipping')}:</span>
                                                <span>{formatCurrency(order.shippingFee)}</span>
                                            </div>
                                            {order.discount && order.discount > 0 && (
                                                <div className={s.totalRow}>
                                                    <span>{t('orderHistory.discount', 'Discount')}:</span>
                                                    <span className={s.discount}>-{formatCurrency(order.discount)}</span>
                                                </div>
                                            )}
                                            <div className={`${s.totalRow} ${s.finalTotal}`}>
                                                <span>{t('orderHistory.grandTotal', 'Grand Total')}:</span>
                                                <span>{formatCurrency(calSubTotalProduct(order.orderItems))}</span>
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

function calSubTotalProduct(items: OrderItemType[]) {
    return items.reduce((sum: number, p: OrderItemType) => sum + p.price * p.quantity, 0);
}

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


export default OrderHistory;