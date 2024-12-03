import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const fakeResponse = [
  { book_id: 1, book_name: "Sách 1", quantity: 10 },
  { book_id: 2, book_name: "Sách 2", quantity: 20 },
  { book_id: 3, book_name: "Sách 3", quantity: 30 },
  { book_id: 4, book_name: "Sách 4", quantity: 20 },
  { book_id: 5, book_name: "Sách 5", quantity: 40 },
  { book_id: 6, book_name: "Sách 6", quantity: 50 },
  { book_id: 7, book_name: "Sách 7", quantity: 60 },
  { book_id: 8, book_name: "Sách 8", quantity: 10 },
  { book_id: 9, book_name: "Sách 9", quantity: 6 },
  { book_id: 10, book_name: "Sách 10", quantity: 12 },
];

const PieChart = () => {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [series, setSeries] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "pie",
      width: 380,
    },
    labels: [],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(2)}%`,
    },
    tooltip: {
      y: {
        formatter: (value) => `${value}`,
      },
    },
    colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0", "#546E7A"],
  });

  useEffect(() => {
    (async () => {
      try {
        let response = await axios
          .get("http://localhost:8080/api/thongke/sale-trending", {
            params: {
              fromDate: startDate,
              toDate: endDate,
            },
          })
          .then((res) => res.data.data);
        let top5 = response.slice(0, 5);
        let other = {
          book_id: "other",
          book_name: "Khác",
          quantity: response
            .slice(5)
            .reduce((acc, cur) => acc + cur.quantity, 0),
        };
        let arr = [...top5];
        if (response.length > 5) {
          arr.push(other);
        }
        setSeries(arr.map((item) => item.quantity));
        setChartOptions({
          ...chartOptions,
          labels: arr.map((item) => item.book_name),
        });
      } catch (error) {
        console.error(error);
      }
    })();
  }, [startDate, endDate]);

  return (
    <div>
      <h2>Tỷ lệ sản phẩm được mua trong khoảng thời gian</h2>
      <div className="row">
        <div className="col-3 d-inline-flex align-items-baseline">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              setStartDate(new Date(e.target.value).toISOString().split("T")[0])
            }
          />
        </div>
        <div className="col-3 d-inline-flex align-items-baseline">
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) =>
              setEndDate(new Date(e.target.value).toISOString().split("T")[0])
            }
          />
        </div>
      </div>
      {series.length > 0 ? (
        <Chart
          options={chartOptions}
          series={series}
          type="pie"
          width={500}
          height={320}
        />
      ) : (
        <div>Không có thông tin</div>
      )}
    </div>
  );
};

export default PieChart;
