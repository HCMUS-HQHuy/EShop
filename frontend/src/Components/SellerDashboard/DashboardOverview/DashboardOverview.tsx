import useScrollOnMount from 'src/Hooks/App/useScrollOnMount.tsx';
import s from './DashboardOverview.module.scss';

const StatCard = ({ title, value, icon }: { title: string, value: string, icon: string }) => (
  <div className={s.card}>
    <div className={s.cardIcon}>{icon}</div>
    <div className={s.cardInfo}>
      <p>{title}</p>
      <span>{value}</span>
    </div>
  </div>
);

const DashboardOverview = () => {
  const recentOrders = [
    { id: '#1234', customer: 'John Doe', date: '2025-08-19', total: '$150.00', status: 'Processing' },
    { id: '#1235', customer: 'Jane Smith', date: '2025-08-19', total: '$75.50', status: 'Shipped' },
    { id: '#1236', customer: 'Peter Jones', date: '2025-08-18', total: '$250.00', status: 'Delivered' },
  ];

  return (
    <div className={s.overview}>      
      <section className={s.summaryCards}>
        <StatCard title="Total Revenue" value="$12,345" icon="💰" />
        <StatCard title="Orders This Month" value="128" icon="📦" />
        <StatCard title="Pending Shipments" value="5" icon="🚚" />
      </section>

      <section className={s.recentOrders}>
        <h2>Recent Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>{order.total}</td>
                <td><span className={`${s.status} ${s[order.status.toLowerCase()]}`}>{order.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default DashboardOverview;