import axios from "axios";
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

// const apiResponse = [
//   {
//     date: "2024-01-01",
//     count: 10,
//   },
//   {
//     date: "2024-01-02",
//     count: 20,
//   },
//   {
//     date: "2024-01-03",
//     count: 13,
//   },
//   {
//     date: "2024-02-02",
//     count: 2,
//   },
//   {
//     date: "2024-03-03",
//     count: 13,
//   },
// ];

const LineChart = () => {
  let yearOptions = [];
  let currentYear = new Date().getFullYear();
  //5 nam truoc den nam hien tai
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
      {
        name: "Số lượt truy cập",
        data: [0, 1, 2, 3, 4], // Dữ liệu số lượt truy cập
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 350,
        fontFamily: "inherit",
      },
      xaxis: {
        categories: ["khong", "mot", "hai", "ba", "bon"], // Trục thời gian
        title: {
          text: "Ngày/Tháng",
        },
      },
      yaxis: {
        title: {
          text: "Số lượt truy cập",
        },
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Thống kê số lượt truy cập",
        align: "center",
      },
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
          `http://localhost:8080/api/thongke/accession?fromDate=${fromDate}&toDate=${toDate}`
        );
        setApiResponse(response.data.dataSet);
      } catch (error) {
        console.error(error);
        return;
      }
    })();
  }, [selectedMonth, selectedYear, type]);

  useEffect(() => {
    let year = parseInt(selectedYear);
    let month = parseInt(selectedMonth);
    if (type === "month") {
      thongTheoNgayTrongThang(year, month);
    } else if (type === "year") {
      thongKeTheoThangTrongNam(year);
    } else {
      thongKeTheoCacNam();
    }
  }, [apiResponse]);

  const thongTheoNgayTrongThang = (year, month) => {
    //tao apiData cho chart
    let counts = [];
    //so ngay cua thang
    let daysInMonth = new Date(year, month, 0).getDate();
    for (let i = 0; i < daysInMonth; i++) {
      let date = new Date(year, month - 1, i + 1);
      let count = 0;
      //tim so luot truy cap cua ngay i
      let found = apiResponse.find((item) => {
        let itemDate = new Date(item.date);
        return itemDate.getDate() === date.getDate();
      });
      if (found) {
        count = found.count;
      }
      counts.push(count);
    }

    //update chart data
    setChartData((prevState) => ({
      ...prevState,
      series: [
        {
          ...prevState.series[0],
          data: counts,
        },
      ],
      options: {
        ...prevState.options,
        xaxis: {
          ...prevState.options.xaxis,
          categories: Array.from({ length: counts.length }, (_, i) => {
            return "Ngày " + (i + 1);
          }),
          title: {
            text: "Ngày",
          },
        },
        title: {
          ...prevState.options.title,
          text:
            "Thống kê số lượt truy cập tháng " +
            selectedMonth +
            "/" +
            selectedYear,
        },
      },
    }));
  };

  const thongKeTheoThangTrongNam = (year) => {
    let counts = [];
    for (let i = 0; i < 12; i++) {
      let count = apiResponse
        .filter((item) => {
          let itemDate = new Date(item.date);
          return itemDate.getMonth() === i;
        })
        .reduce((sum, item) => sum + item.count, 0);

      counts.push(count);
    }

    setChartData((prevState) => ({
      ...prevState,
      series: [
        {
          ...prevState.series[0],
          data: counts,
        },
      ],
      options: {
        ...prevState.options,
        xaxis: {
          ...prevState.options.xaxis,
          categories: Array.from({ length: 12 }, (_, i) => {
            return "Tháng " + (i + 1);
          }),
          title: {
            text: "Tháng",
          },
        },
        title: {
          ...prevState.options.title,
          text: "Thống kê số lượt truy cập năm " + year,
        },
      },
    }));
  };

  const thongKeTheoCacNam = () => {
    let counts = [];
    for (let i = 0; i < yearOptions.length; i++) {
      let year = yearOptions[i];
      let count = apiResponse
        .filter((item) => {
          let itemDate = new Date(item.date);
          return itemDate.getFullYear() === year;
        })
        .reduce((sum, item) => sum + item.count, 0);

      counts.push(count);
    }

    setChartData((prevState) => ({
      ...prevState,
      series: [
        {
          ...prevState.series[0],
          data: counts,
        },
      ],
      options: {
        ...prevState.options,
        xaxis: {
          ...prevState.options.xaxis,
          categories: yearOptions.map((year) => year.toString()).sort(),
          title: {
            text: "Năm",
          },
        },
        title: {
          ...prevState.options.title,
          text: "Thống kê số lượt truy cập theo năm",
        },
      },
    }));
  };

  return (
    <div>
      <h1>Thống kê số lượt truy cập</h1>
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
              {Array.from({ length: 12 }, (_, i) => {
                const month = (i + 1).toString().padStart(2, "0");
                return (
                  <option value={month} key={month}>
                    Tháng {month}
                  </option>
                );
              })}
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

export default LineChart;
