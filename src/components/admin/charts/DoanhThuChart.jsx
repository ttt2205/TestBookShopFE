import axios from "axios";
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

let fakeResponse = [
  {
    date: "2024-01-01",
    revenue: 1000000,
    profit: 500000,
  },
  {
    date: "2024-01-02",
    revenue: 2000000,
    profit: 1000000,
  },
  {
    date: "2024-01-03",
    revenue: 1300000,
    profit: 600000,
  },
  {
    date: "2024-02-02",
    revenue: 200000,
    profit: 100000,
  },
  {
    date: "2024-03-03",
    revenue: 1300000,
    profit: 600000,
  },
];

const DoanhThuChart = () => {
  let yearOptions = [];
  let currentYear = new Date().getFullYear();
  for (let i = 0; i < 5; i++) {
    yearOptions.push(currentYear - 4 + i);
  }

  let currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [apiResponse, setApiResponse] = useState([]);
  const [type, setType] = useState("month");

  const [chartData, setChartData] = useState({
    series: [
      { name: "Doanh thu", data: [] },
      { name: "Lợi nhuận", data: [] },
    ],
    options: {
      chart: { type: "line", height: 350, fontFamily: "inherit" },
      xaxis: { categories: [], title: { text: "Thời gian" } },
      yaxis: { title: { text: "Số tiền (VNĐ)" } },
      tooltip: { shared: true, intersect: false },
      title: { text: "Thống kê doanh thu và lợi nhuận", align: "center" },
    },
  });

  useEffect(() => {
    let year = parseInt(selectedYear);
    let month = parseInt(selectedMonth);
    let startDate, endDate;
    if (type === "month") {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 1);
    } else if (type === "pastYears") {
      startDate = new Date(year - 4, 0, 1);
      endDate = new Date(year + 1, 0, 1);
    } else {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year + 1, 0, 1);
    }

    let fromDate = startDate.toISOString().split("T")[0];
    let toDate = endDate.toISOString().split("T")[0];
    (async () => {
      try {
        let response = await axios.get(
          `http://localhost:8080/api/thongke/revenue?fromDate=${fromDate}&toDate=${toDate}`
        );
        let data = response.data.data || [];
        console.log(data);
        // let data = fakeResponse.filter((item) => {
        //   let itemDate = new Date(item.date);
        //   return itemDate >= startDate && itemDate < endDate;
        // });
        setApiResponse(data);
      } catch (error) {
        console.error(error);
        return;
      }
    })();
  }, [selectedMonth, selectedYear, type]);

  useEffect(() => {
    if (type === "month") {
      thongTheoNgayTrongThang(apiResponse);
    } else if (type === "year") {
      thongKeTheoThangTrongNam(apiResponse);
    } else {
      thongKeTheoCacNam(apiResponse);
    }
  }, [apiResponse]);

  const thongTheoNgayTrongThang = (data) => {
    let daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    let revenues = Array(daysInMonth).fill(0);
    let profits = Array(daysInMonth).fill(0);

    data.forEach((item) => {
      let date = new Date(item.date);
      let day = date.getDate() - 1;
      revenues[day] = item.revenue;
      profits[day] = item.profit;
    });

    updateChart(
      revenues,
      profits,
      Array.from({ length: revenues.length }, (_, i) => `Ngày ${i + 1}`)
    );
  };

  const thongKeTheoThangTrongNam = (data) => {
    let revenues = Array(12).fill(0);
    let profits = Array(12).fill(0);

    data.forEach((item) => {
      let date = new Date(item.date);
      let month = date.getMonth();
      revenues[month] += item.revenue;
      profits[month] += item.profit;
    });

    updateChart(
      revenues,
      profits,
      Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`)
    );
  };

  const thongKeTheoCacNam = (data) => {
    let revenues = Array(yearOptions.length).fill(0);
    let profits = Array(yearOptions.length).fill(0);

    data.forEach((item) => {
      let date = new Date(item.date);
      let yearIndex = yearOptions.indexOf(date.getFullYear());
      if (yearIndex !== -1) {
        revenues[yearIndex] += item.revenue;
        profits[yearIndex] += item.profit;
      }
    });

    updateChart(
      revenues,
      profits,
      yearOptions.map((year) => year.toString())
    );
  };

  const updateChart = (revenues, profits, categories) => {
    console.log({ revenues, profits, categories });
    setChartData((prevState) => ({
      ...prevState,
      series: [
        { name: "Doanh thu", data: revenues },
        { name: "Lợi nhuận", data: profits },
      ],
      options: {
        ...prevState.options,
        xaxis: { ...prevState.options.xaxis, categories },
      },
    }));
  };

  return (
    <div>
      <h1>Thống kê doanh thu và lợi nhuận</h1>
      <div className="row mb-3">
        <div className="col-3">
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="month">Theo ngày trong tháng</option>
            <option value="year">Theo tháng trong năm</option>
            <option value="pastYears">Theo các năm</option>
          </select>
        </div>
        {type === "month" && (
          <div className="col-3">
            <select
              className="form-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option value={i + 1} key={i}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
          </div>
        )}
        {(type === "month" || type === "year") && (
          <div className="col-3">
            <select
              className="form-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {yearOptions.map((year) => (
                <option value={year} key={year}>
                  Năm {year}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <Chart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={450}
      />
    </div>
  );
};

export default DoanhThuChart;
