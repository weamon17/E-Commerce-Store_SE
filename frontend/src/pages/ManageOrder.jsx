import { useState, useEffect } from "react";
import { loadInfoOrdersByAdmin, updateOrder } from "../services/handleAPI";
import HeaderAdmin from "../layouts/HeaderAdmin";
import { CheckUser } from "../Function/CheckUser";
import Swal from "sweetalert2"; // Import SweetAlert2

const statusOptions = [
  "Waiting for confirmation",
  "Confirmed",
  "Delivering",
  "Completed",
  "Cancelled",
  "REQUEST CANCELLATION",
];

// Semantic status styles (no change needed, these are good)
const getStatusStyle = (status) => {
  switch (status) {
    case "Cancelled":
      return "bg-red-100 text-red-700 font-bold";
    case "Completed":
      return "bg-green-100 text-green-700 font-bold";
    case "Delivering":
      return "bg-blue-100 text-blue-700 font-bold";
    case "Confirmed":
      return "bg-yellow-100 text-yellow-700 font-bold";
    case "Waiting for confirmation":
      return "bg-gray-100 text-gray-800 font-bold";
    case "REQUEST CANCELLATION":
      return "bg-orange-100 text-orange-700 font-bold";
    default:
      return "bg-gray-100 text-gray-700 font-bold";
  }
};

const ManagerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [statusMap, setStatusMap] = useState({});
  const [cancelReasonMap, setCancelReasonMap] = useState({});
  const [expandedMap, setExpandedMap] = useState({});
  CheckUser("Admin");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await loadInfoOrdersByAdmin();
    if (res.success) {
      setOrders(res.orders);
      const statusInit = {};
      const reasonInit = {};
      const expandInit = {};
      res.orders.forEach((order) => {
        statusInit[order._id] = order.status || "Waiting for confirmation";
        reasonInit[order._id] = order.cancelReason || "";
        expandInit[order._id] = false;
      });
      setStatusMap(statusInit);
      setCancelReasonMap(reasonInit);
      setExpandedMap(expandInit);
    } else {
      Swal.fire("Error", res.message || "Failed to load orders", "error");
    }
    setLoading(false);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setStatusMap((prev) => ({ ...prev, [orderId]: newStatus }));
    if (!["Cancelled", "REQUEST CANCELLATION"].includes(newStatus)) {
      setCancelReasonMap((prev) => ({ ...prev, [orderId]: "" }));
    }
  };

  const handleCancelReasonChange = (orderId, reason) => {
    setCancelReasonMap((prev) => ({ ...prev, [orderId]: reason }));
  };

  const handleUpdateOrder = async (order) => {
    const updatedOrder = {
      orderId: order.orderId || order._id,
      items: order.items,
      total: order.total,
      totalPayment: order.totalPayment,
      status: statusMap[order._id],
      reason: cancelReasonMap[order._id],
      address: order.address,
    };
    const res = await updateOrder(updatedOrder);
    if (res.success) {
      Swal.fire("Success!", "Order updated successfully", "success");
      fetchOrders();
    } else {
      Swal.fire("Error", res.message || "Failed to update order", "error");
    }
  };

  const toggleExpanded = (orderId) => {
    setExpandedMap((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10">
        <HeaderAdmin stylePro="btn-line" />
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Order Management
          </h1>

          {/* Filter */}
          <div>
            <label className="mr-3 font-semibold text-gray-700">
              Filter by Status:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              <option value="All">All</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Grid */}
        {loading ? (
          <p className="text-center text-gray-600">Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-center text-gray-600">No orders found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOrders.map((order) => {
              const isExpanded = expandedMap[order._id];
              const isFinalCancelled = order.status === "Cancelled";
              const itemsToShow = isExpanded
                ? order.items
                : order.items.slice(0, 1);

              return (
                <div
                  key={order._id}
                  className={`bg-white shadow-md rounded-lg p-6 border ${
                    isFinalCancelled
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="grid grid-cols-2 gap-4 items-center mb-4">
                    <p
                      className="text-lg font-semibold text-gray-800 truncate"
                      title={order.orderId || order._id}
                    >
                      Order ID:{" "}
                      <span className="font-mono text-sm text-gray-600">
                        {order.orderId || order._id}
                      </span>
                    </p>

                    <select
                      value={statusMap[order._id]}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      disabled={isFinalCancelled}
                      className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p
                    className={`mb-3 inline-block px-3 py-1 rounded-full text-xs ${getStatusStyle(
                      statusMap[order._id]
                    )}`}
                  >
                    {statusMap[order._id]}
                  </p>

                  <p className="mb-2 text-gray-700">
                    <strong>Address:</strong> {order.address || "No Address"}
                  </p>

                  <div className="mb-2">
                    <strong className="text-gray-700">Products:</strong>
                    <ul className="mt-2 grid gap-3">
                      {itemsToShow.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <img
                            src={item.image || "/default-product.png"}
                            alt={item.productName}
                            className="w-14 h-14 object-cover rounded-md border"
                          />
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.productName}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.buyQuantity}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {order.items.length > 1 && (
                      <button
                        onClick={() => toggleExpanded(order._id)}
                        className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        {isExpanded ? "Show Less" : "Show All Products"}
                      </button>
                    )}
                  </div>

                  <p className="mt-3 text-gray-700">
                    <strong>Total:</strong> ${order.total || 0}
                  </p>
                  <p className="mb-4 text-gray-700">
                    <strong>Total Payment:</strong> ${order.totalPayment || 0}
                  </p>

                  {["Cancelled", "REQUEST CANCELLATION"].includes(
                    statusMap[order._id]
                  ) && (
                    <div className="mb-4">
                      <label className="block font-semibold text-gray-700 mb-1">
                        Cancellation Reason:
                      </label>
                      <input
                        type="text"
                        value={cancelReasonMap[order._id] || ""}
                        onChange={(e) =>
                          handleCancelReasonChange(order._id, e.target.value)
                        }
                        className="border border-gray-300 rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter cancellation reason"
                        disabled={isFinalCancelled}
                      />
                    </div>
                  )}

                  <button
                    onClick={() => handleUpdateOrder(order)}
                    disabled={isFinalCancelled}
                    className={`text-white px-5 py-2 rounded-md transition w-full font-medium ${
                      isFinalCancelled
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    Update Order
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerOrder;