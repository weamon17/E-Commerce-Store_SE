import React, { useState, useEffect } from "react";
import HeaderCustomer from "../layouts/HeaderCustomer";
import { loadInfoOrders, updateOrder } from "../services/handleAPI";

const cancelReasons = [
  "I no longer want to buy",
  "I ordered the wrong product",
  "The price is too high",
  "Delivery time is too long",
  "Other reasons",
];

const OrderPage = () => {
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [cancelRequestedOrders, setCancelRequestedOrders] = useState([]);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const loadData = async () => {
    try {
      const data = await loadInfoOrders();
      if (data.success) {
        setOrders(data.orders);
        // Lấy danh sách đơn đang REQUEST CANCELLATION
        const requested = data.orders
          .filter((o) => o.status === "REQUEST CANCELLATION")
          .map((o) => o.orderId);
        setCancelRequestedOrders(requested);
        setError(null);
      } else setError(data.message);
    } catch (err) {
      setError("Failed to load orders.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const statuses = [
    "All",
    "Cancelled",
    "Completed",
    "Delivering",
    "Confirmed",
    "WAITING FOR CONFIRMATION",
    "REQUEST CANCELLATION",
  ];

  // Hàm gọi API cập nhật trạng thái order
  const handleUpdateOrderStatus = async (order, newStatus, reason = "") => {
    const updatedOrder = {
      orderId: order.orderId,
      items: order.items,
      total: order.total,
      totalPayment: order.totalPayment,
      status: newStatus,
      reason: newStatus === "REQUEST CANCELLATION" ? reason : "",
    };

    try {
      const res = await updateOrder(updatedOrder);
      if (res.success) {
        setOrders((prevOrders) =>
          prevOrders.map((o) => (o.orderId === order.orderId ? res.product : o))
        );

        if (newStatus.toUpperCase() === "WAITING FOR CONFIRMATION") {
          setCancelRequestedOrders((prev) =>
            prev.filter((id) => id !== order.orderId)
          );
        } else if (newStatus === "REQUEST CANCELLATION") {
          setCancelRequestedOrders((prev) =>
            prev.includes(order.orderId) ? prev : [...prev, order.orderId]
          );
        }

        setCancelOrderId(null);
        setSelectedReason("");
        setError(null);
      } else {
        setError(res.message || "Failed to update order");
      }
    } catch (err) {
      setError("Server error updating order");
      console.error(err);
    }
  };

  const handleSendCancelReason = (order, reason) => {
    if (!reason) return;
    handleUpdateOrderStatus(order, "REQUEST CANCELLATION", reason);
  };

  // Xử lý khi khách hủy yêu cầu hủy đơn (cancel request)
  const handleCancelRequest = (order) => {
    handleUpdateOrderStatus(order, "WAITING FOR CONFIRMATION", "");
  };

  const filteredOrders =
    selectedStatus === "All"
      ? orders
      : orders.filter(
          (order) => order.status.toUpperCase() === selectedStatus.toUpperCase()
        );

  return (
    <>
      <div className="sticky top-0 z-10">
        <HeaderCustomer
          styleCart={"btn-line"}
          styleOrder={"line"}
          stylePro={"btn-line"}
        />
      </div>

      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        {/* Filter Buttons */}
        <div className="mb-4 flex flex-wrap gap-3">
          {statuses.map((status) => {
            const isActive = selectedStatus === status;

            let bgColor = "bg-gray-200 text-gray-700";
            if (isActive) {
              switch (status) {
                case "Cancelled":
                  bgColor = "bg-red-500 text-white";
                  break;
                case "Completed":
                  bgColor = "bg-green-500 text-white";
                  break;
                case "Delivering":
                  bgColor = "bg-purple-500 text-white";
                  break;
                case "Confirmed":
                  bgColor = "bg-blue-500 text-white";
                  break;
                case "Waiting for confirmation":
                case "WAITING FOR CONFIRMATION":
                  bgColor = "bg-yellow-500 text-white";
                  break;
                case "REQUEST CANCELLATION":
                  bgColor = "bg-orange-500 text-white";
                  break;
                case "All":
                  bgColor = "bg-blue-600 text-white";
                  break;
                default:
                  bgColor = "bg-gray-200 text-gray-700";
              }
            }

            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-xl hover:bg-opacity-80 ${bgColor}`}
              >
                {status}
              </button>
            );
          })}
        </div>

        {/* Orders */}
        {filteredOrders.map((order) => {
          const isExpanded = expandedOrderId === order.orderId;
          const total = order.totalPayment || 0;
          const isCancelRequested = cancelRequestedOrders.includes(
            order.orderId
          );

          return (
            <div
              key={order.orderId}
              className="bg-white shadow-md rounded-xl p-6 space-y-6 border"
            >
              <div
                className={`text-sm font-semibold ${
                  order.status === "Cancelled"
                    ? "text-red-500"
                    : order.status === "WAITING FOR CONFIRMATION"
                    ? "text-yellow-600"
                    : order.status === "REQUEST CANCELLATION"
                    ? "text-orange-500"
                    : "text-green-600"
                }`}
              >
                {order.status?.toUpperCase()}
              </div>

              <div className="space-y-4 border-b pb-4">
                {Array.isArray(order.items) &&
                  (isExpanded ? order.items : [order.items[0]]).map((item) => (
                    <div
                      key={item.productId}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full sm:w-28 max-h-32 object-contain rounded-lg bg-white"
                      />
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <h2 className="text-lg font-medium text-gray-800">
                              {item.productName}
                            </h2>
                            <p className="text-sm text-gray-500">
                              Quantity: x{item.buyQuantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="line-through text-sm text-gray-400">
                              ${item.oldprice?.toLocaleString()}
                            </p>
                            <p className="text-red-600 text-base font-semibold">
                              ${item.saleprice?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {order.items.length > 1 && (
                  <button
                    onClick={() => toggleOrderExpand(order.orderId)}
                    className="text-sm text-red-600 hover:underline mt-2"
                  >
                    {isExpanded
                      ? "Hide items"
                      : `Show all (${order.items.length}) items`}
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-sm text-gray-600 font-medium">
                  Total:
                </span>
                <span className="text-xl font-bold text-red-600">
                  ${total.toLocaleString()}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-end items-end sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 mt-4">
                {order.status === "Cancelled" && (
                  <button className="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition w-full sm:w-auto">
                    View Cancellation Details
                  </button>
                )}

                {(order.status === "Waiting for confirmation" ||
                  order.status === "WAITING FOR CONFIRMATION") && (
                  <>
                    {!isCancelRequested && (
                      <>
                        <button
                          onClick={() => {
                            setCancelOrderId(order.orderId);
                            setSelectedReason("");
                          }}
                          className="px-5 py-2 border border-red-600 text-red-600 rounded-xl hover:bg-red-50 transition font-medium w-full sm:w-auto"
                        >
                          Request Cancellation
                        </button>

                        {cancelOrderId === order.orderId && (
                          <div className="w-full mt-4 space-y-2">
                            <select
                              className="w-full p-2 border border-red-600 rounded-xl text-sm"
                              value={selectedReason}
                              onChange={(e) =>
                                setSelectedReason(e.target.value)
                              }
                            >
                              <option value="">Select a reason</option>
                              {cancelReasons.map((reason, idx) => (
                                <option key={idx} value={reason}>
                                  {reason}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() =>
                                handleSendCancelReason(order, selectedReason)
                              }
                              className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium w-full sm:w-auto"
                            >
                              Send
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {/* Hiển thị nút Cancel request khi trạng thái là REQUEST CANCELLATION */}
                {order.status === "REQUEST CANCELLATION" && (
                  <button
                    onClick={() => handleCancelRequest(order)}
                    className="px-5 py-2 border border-yellow-600 text-yellow-600 rounded-xl hover:bg-yellow-50 transition font-medium w-full sm:w-auto"
                  >
                    Cancel request
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-red-600 text-white text-center">
          {error}
        </div>
      )}
    </>
  );
};

export default OrderPage;
