import Chart from "react-apexcharts";

// Dữ liệu tồn kho ví dụ
// const stockData = [
//   {
//     book_id: 6,
//     receipt_id: 11,
//     quantity: 4,
//     price: 120000,
//     createdAt: "2024-10-31T05:50:55.000Z",
//   },
//   {
//     book_id: 6,
//     receipt_id: 2,
//     quantity: 1,
//     price: 0,
//     createdAt: "2024-10-31T04:03:02.000Z",
//   },
// ];

const InventoryChart = ({ stockData, totalStock }) => {
  // Tạo dữ liệu cho biểu đồ
  const categories = stockData.map((entry) => {
    let date = new Date(entry.createdAt);
    //tra ve gio,phut,ngay, thang, nam
    return `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`; // Format ngày giờ
  });
  const quantities = stockData.map((entry) => entry.stock_quantity);
  const prices = stockData.map((entry) => entry.price);

  // Cấu hình biểu đồ ApexCharts với các màu sắc và tooltip tùy chỉnh
  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: true,
      },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        colors: {
          ranges: [
            { from: 0, to: 2, color: "#FF4560" },
            { from: 3, to: 5, color: "#00E396" },
          ],
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val} items`, // Hiển thị số lượng với từ "items"
      style: {
        colors: ["#000"],
      },
    },
    xaxis: {
      categories: categories,
      title: {
        text: "Ngày nhập kho",
      },
    },
    yaxis: {
      title: {
        text: "Số lượng tồn kho",
      },
    },
    tooltip: {
      y: {
        formatter: (val, { dataPointIndex }) => {
          const price = prices[dataPointIndex]; // Lấy giá trị price tương ứng
          return `${val} items - Giá: ${price.toLocaleString()} VND`;
        },
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    colors: ["#008FFB"], // Màu sắc cho các cột
    fill: {
      opacity: 0.9,
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.3,
        gradientToColors: ["#ABE5A1"], // Chuyển sắc từ xanh lam sang xanh lá nhạt
        inverseColors: true,
        opacityFrom: 0.9,
        opacityTo: 0.7,
      },
    },
  };

  const chartSeries = [
    {
      name: "Số lượng",
      data: quantities,
    },
  ];

  return (
    <div>
      <h2>Tồn kho {totalStock} sản phẩm </h2>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default InventoryChart;
