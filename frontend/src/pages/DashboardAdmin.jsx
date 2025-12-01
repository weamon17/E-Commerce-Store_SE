import { useEffect, useState } from "react";
import HdAdmin from "../layouts/HeaderAdmin";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CheckUser } from "../Function/CheckUser";
import { loadInfoOrdersByAdmin } from "../services/handleAPI";

// Hàm lấy ngày hiện tại theo định dạng YYYY-MM-DD
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); 
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function DashboardAdmin() {
  const [orders, setOrders] = useState([]);
  
  // --- THAY ĐỔI Ở ĐÂY: Dùng hàm getCurrentDate() để lấy ngày hôm nay ---
  const [filterFrom, setFilterFrom] = useState(getCurrentDate());
  const [filterTo, setFilterTo] = useState(getCurrentDate());
  // --------------------------------------------------------------------

  const [filteredData, setFilteredData] = useState([]);

  // State cho các chỉ số KPI
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProductsSold, setTotalProductsSold] = useState(0);
  const [topProduct, setTopProduct] = useState(null);

  CheckUser("Admin");

  // Load data đơn hàng khi component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await loadInfoOrdersByAdmin();
        if (result.success && result.orders) {
          setOrders(result.orders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error loading orders:", error);
      }
    };
    fetchOrders();
  }, []);

  // Xử lý dữ liệu
  useEffect(() => {
    if (!filterFrom || !filterTo) {
      setFilteredData([]);
      setTotalProductsSold(0);
      setTopProduct(null);
      setTotalRevenue(0);
      return;
    }

    const fromDate = new Date(filterFrom);
    const toDate = new Date(filterTo);

    // Set toDate tới cuối ngày (23:59:59)
    toDate.setHours(23, 59, 59, 999);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      console.error("Invalid date range");
      setFilteredData([]);
      setTotalProductsSold(0);
      setTopProduct(null);
      setTotalRevenue(0);
      return;
    }

    const filteredOrders = orders.filter((order) => {
      if (order.status !== "Completed") return false;
      
      const createdAt = new Date(order.createAt);
      if (isNaN(createdAt.getTime())) return false;

      return createdAt >= fromDate && createdAt <= toDate;
    });

    const revenueByDateMap = {};
    let totalQuantity = 0;
    const productQuantityMap = {};

    filteredOrders.forEach((order) => {
      const dateKey = new Date(order.createAt).toISOString().slice(0, 10);
      if (!revenueByDateMap[dateKey]) {
        revenueByDateMap[dateKey] = 0;
      }
      revenueByDateMap[dateKey] += order.total;

      if (Array.isArray(order.items)) {
        order.items.forEach((item) => {
          totalQuantity += item.buyQuantity;

          if (!productQuantityMap[item.productName]) {
            productQuantityMap[item.productName] = 0;
          }
          productQuantityMap[item.productName] += item.buyQuantity;
        });
      }
    });

    const revenueByDateArray = Object.entries(revenueByDateMap).map(
      ([date, revenue]) => ({ date, revenue })
    );

    revenueByDateArray.sort((a, b) => new Date(a.date) - new Date(b.date));

    const totalRevenueSum = revenueByDateArray.reduce(
      (acc, curr) => acc + curr.revenue,
      0
    );

    setFilteredData(revenueByDateArray);
    setTotalProductsSold(totalQuantity);
    setTotalRevenue(totalRevenueSum);

    const topProductEntry = Object.entries(productQuantityMap).sort(
      (a, b) => b[1] - a[1]
    )[0];

    if (topProductEntry) {
      setTopProduct({ name: topProductEntry[0], quantity: topProductEntry[1] });
    } else {
      setTopProduct(null);
    }
  }, [orders, filterFrom, filterTo]);

  const StatCard = ({ title, value, subtitle }) => (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      {subtitle && (
        <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
      )}
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-30 bg-white shadow-sm">
        <HdAdmin stylePro="btn-line" />
      </div>
      <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 text-center">
          Revenue Dashboard
        </h1>

        {/* Filter chọn khoảng thời gian */}
        <div className="mb-8 flex flex-col sm:flex-row justify-center gap-6 max-w-lg mx-auto">
          <div className="w-full sm:w-auto">
            <label
              htmlFor="fromDate"
              className="block mb-1 font-semibold text-sm sm:text-base text-gray-700"
            >
              From Date:
            </label>
            <input
              id="fromDate"
              type="date"
              value={filterFrom}
              max={filterTo}
              onChange={(e) => setFilterFrom(e.target.value)}
              className="border border-gray-300 p-2 rounded-md w-full sm:w-48 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="w-full sm:w-auto">
            <label
              htmlFor="toDate"
              className="block mb-1 font-semibold text-sm sm:text-base text-gray-700"
            >
              To Date:
            </label>
            <input
              id="toDate"
              type="date"
              value={filterTo}
              min={filterFrom}
              onChange={(e) => setFilterTo(e.target.value)}
              className="border border-gray-300 p-2 rounded-md w-full sm:w-48 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Bố cục lưới cho các thẻ Stat Card KPI */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Total Revenue"
            value={`${totalRevenue.toLocaleString('vi-VN')} VND`}
            subtitle="Từ đơn hàng hoàn thành"
          />
          <StatCard
            title="Total Products Sold"
            value={totalProductsSold}
            subtitle="In selected range"
          />
          {topProduct ? (
            <StatCard
              title="Top Selling Product"
              value={topProduct.name}
              subtitle={`${topProduct.quantity} sold`}
            />
          ) : (
            <StatCard
              title="Top Selling Product"
              value="N/A"
              subtitle="No product sales data"
            />
          )}
        </section>

        {/* Biểu đồ doanh thu */}
        <section className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 max-w-full overflow-x-auto">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 text-center sm:text-left">
            Revenue by Date (Completed Orders)
          </h2>
          {filteredData.length === 0 ? (
            <p className="text-center text-gray-600 h-80 flex items-center justify-center">
              No data in selected date range.
            </p>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={350}
              minWidth={320}
              minHeight={300}
            >
              <BarChart
                data={filteredData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" tickFormatter={(str) => str.slice(5)} />
                <YAxis
                  tickFormatter={(value) =>
                    `${(value / 1000000).toLocaleString('vi-VN')} tr`
                  }
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) =>
                    `${value.toLocaleString('vi-VN')} VND`
                  }
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="#3B82F6"
                  name="Doanh thu (VND)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>
      </main>
    </>
  );
}