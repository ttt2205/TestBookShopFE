import React, { useState } from "react";
import Chart from "react-apexcharts";

// Dữ liệu mẫu
const receipts = [
  {
    receipt_id: 1,
    createdAt: "2024-10-31T05:50:55.000Z",
    details: [
      { book_id: 6, quantity: 4 },
      { book_id: 7, quantity: 1 },
    ],
  },
  {
    receipt_id: 2,
    createdAt: "2024-10-31T04:03:02.000Z",
    details: [{ book_id: 6, quantity: 1 }],
  },
  {
    receipt_id: 3,
    createdAt: "2024-10-31T02:03:02.000Z",
    details: [{ book_id: 7, quantity: 2 }],
  },
  {
    receipt_id: 4,
    createdAt: "2024-10-31T01:03:02.000Z",
    details: [{ book_id: 8, quantity: 3 }],
  },
  {
    receipt_id: 5,
    createdAt: "2024-10-31T00:03:02.000Z",
    details: [{ book_id: 9, quantity: 4 }],
  },
  {
    receipt_id: 6,
    createdAt: "2024-10-30T23:03:02.000Z",
    details: [{ book_id: 10, quantity: 5 }],
  },
  {
    receipt_id: 7,
    createdAt: "2024-10-30T22:03:02.000Z",
    details: [{ book_id: 11, quantity: 6 }],
  },
  {
    receipt_id: 8,
    createdAt: "2024-10-30T21:03:02.000Z",
    details: [{ book_id: 12, quantity: 7 }],
  },
  {
    receipt_id: 9,
    createdAt: "2024-10-30T20:03:02.000Z",
    details: [{ book_id: 13, quantity: 8 }],
  },
  {
    receipt_id: 10,
    createdAt: "2024-10-30T19:03:02.000Z",
    details: [{ book_id: 14, quantity: 9 }],
  },
  {
    receipt_id: 11,
    createdAt: "2024-10-30T18:03:02.000Z",
    details: [{ book_id: 15, quantity: 10 }],
  },
];

const PieChart = () => {
  const [startDate, setStartDate] = useState("2024-10-31T00:00:00.000Z");
  const [endDate, setEndDate] = useState("2024-10-31T06:00:00.000Z");

  // Hàm lọc dữ liệu theo khoảng thời gian và tính toán tổng số lượng cho mỗi sản phẩm
  const getProductQuantities = () => {
    const filteredReceipts = receipts.filter(
      (receipt) =>
        receipt.createdAt >= startDate && receipt.createdAt <= endDate
    );

    const productQuantities = {};
    filteredReceipts.forEach((receipt) => {
      receipt.details.forEach((detail) => {
        if (productQuantities[detail.book_id]) {
          productQuantities[detail.book_id] += detail.quantity;
        } else {
          productQuantities[detail.book_id] = detail.quantity;
        }
      });
    });
    return productQuantities;
  };

  // Tính toán tỉ lệ và gộp những sản phẩm có tỉ lệ dưới 5% thành một mục chung
  const productQuantities = getProductQuantities();
  const totalQuantity = Object.values(productQuantities).reduce(
    (sum, quantity) => sum + quantity,
    0
  );
  console.log("total quantity: ", totalQuantity);

  const sortedProducts = Object.entries(productQuantities)
    .map(([book_id, quantity]) => ({
      book_id,
      quantity,
      percentage: (quantity / totalQuantity) * 100,
    }))
    .sort((a, b) => b.quantity - a.quantity);

  const majorProducts = sortedProducts.slice(0, 5);
  const otherProducts = sortedProducts.slice(5);
  console.log("major products: ", majorProducts);
  console.log("other products: ", otherProducts);

  const topProducts = majorProducts;
  const otherQuantity = otherProducts.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  if (otherQuantity > 0) {
    topProducts.push({
      book_id: "Other",
      quantity: otherQuantity,
      percentage: (otherQuantity / totalQuantity) * 100,
    });
  }

  // Dữ liệu cho biểu đồ
  const series = topProducts.map((product) => product.quantity);
  const labels = topProducts.map((product) =>
    product.book_id === "Other" ? "Other" : `Book ID: ${product.book_id}`
  );

  // Cấu hình biểu đồ ApexCharts
  const chartOptions = {
    chart: {
      type: "pie",
      width: 380,
    },
    labels: labels,
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(2)}%`,
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} sản phẩm`,
      },
    },
    colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0", "#546E7A"],
  };

  return (
    <div>
      <h2>Tỷ lệ sản phẩm được mua trong khoảng thời gian</h2>
      <div>
        <label>Start Date:</label>
        <input
          type="datetime-local"
          value={startDate.slice(0, 16)}
          onChange={(e) => setStartDate(new Date(e.target.value).toISOString())}
        />
        <label>End Date:</label>
        <input
          type="datetime-local"
          value={endDate.slice(0, 16)}
          onChange={(e) => setEndDate(new Date(e.target.value).toISOString())}
        />
      </div>
      <Chart options={chartOptions} series={series} type="pie" width="380" />
    </div>
  );
};

export default PieChart;
