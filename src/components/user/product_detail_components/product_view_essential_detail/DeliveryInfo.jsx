import React, { useState, useCallback, useEffect } from "react";
import { TbTruckDelivery } from "react-icons/tb";
import ChooseQuantity from "./ChooseQuantity";

function DeliveryInfo({ count, handleQuantityChange, handleChangeAddress }) {
  const [currentCityCoordinateIsChosen, setCurrentCityCoordinateIsChosen] =
    useState({ city: "Hà Nội", lat: 21.0285, lng: 105.8048 });
  const [temptCity, setTemptCity] = useState(currentCityCoordinateIsChosen);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState(0);
  // Tọa độ của các thành phố ở Việt Nam
  const cityCoordinates = [
    { city: "Hà Nội", lat: 21.0285, lng: 105.8048 },
    { city: "Hồ Chí Minh", lat: 10.8231, lng: 106.6297 },
    { city: "Đà Nẵng", lat: 16.0471, lng: 108.2068 },
    { city: "Hải Phòng", lat: 20.8443, lng: 106.6883 },
    { city: "Cần Thơ", lat: 10.0237, lng: 105.7467 },
    { city: "Nha Trang", lat: 12.2388, lng: 109.1967 },
    { city: "Huế", lat: 16.4637, lng: 107.5858 },
    { city: "Quảng Ninh", lat: 21.0469, lng: 107.1473 },
    { city: "Vũng Tàu", lat: 10.3438, lng: 107.0835 },
    { city: "Bình Dương", lat: 10.9639, lng: 106.5975 },
    { city: "Long Xuyên", lat: 10.3882, lng: 105.4372 },
    { city: "Gia Lai", lat: 13.9935, lng: 108.4544 },
    { city: "Kon Tum", lat: 14.3653, lng: 108.0315 },
    { city: "Phan Thiết", lat: 10.9333, lng: 108.0961 },
    { city: "Sapa", lat: 22.3142, lng: 103.8447 },
  ];

  useEffect(() => {
    // Thay đổi address
    handleChangeAddress(currentCityCoordinateIsChosen.city);
    // Hàm tính khoảng cách từ điểm hiện tại tới điểm được chọn
    function calculateDistance(lat1, lng1, lat2, lng2) {
      const R = 6371; // Bán kính Trái Đất (km)
      const toRad = (value) => (value * Math.PI) / 180;

      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c;
    }

    // Hàm ước tính thời gian giao hàng
    function estimateDeliveryTime(distance, speed = 40) {
      return (distance / speed) * 60; // Trả về phút
    }

    // Hàm ước tính ngày giao hàng
    function estimateDeliveryDate(minutes = 0) {
      const currentDate = new Date();
      currentDate.setMinutes(currentDate.getMinutes() + minutes); // cộng thêm thời gian ước tính
      // Format time
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const time = [
        daysOfWeek[currentDate.getDay()],
        currentDate.getDate().toString(),
        (currentDate.getMonth() + 1).toString(),
        currentDate.getFullYear().toString(),
      ];
      console.log(">>> currentDate", currentDate);
      console.log(">>> date", currentDate.getDate().toString());
      console.log(">>> month", (currentDate.getMonth() + 1).toString());
      const formatDeliveryTime = time.join(" - ");
      setEstimatedDeliveryTime(formatDeliveryTime);
    }

    // Hàm của trình duyệt dùng để tính tọa độ của điểm hiện tại
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Lấy vĩ độ và kinh độ của vị trí của mình hiện tại
        const currentLat = position.coords.latitude; // vĩ độ
        const currentLng = position.coords.longitude; // kinh độ

        // Lấy tọa độ thành phố được chọn
        const cityLat = currentCityCoordinateIsChosen.lat;
        const cityLng = currentCityCoordinateIsChosen.lng;

        // Tính khoảng cách
        const distance = calculateDistance(
          currentLat,
          currentLng,
          cityLat,
          cityLng
        );
        console.log(`Distance: ${distance.toFixed(2)} km`);

        // Tính thời gian giao hàng
        const deliveryTime = estimateDeliveryTime(distance, 50);
        console.log(
          `Estimated delivery time: ${deliveryTime.toFixed(2)} minutes`
        );
        estimateDeliveryDate(deliveryTime.toFixed(2));
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.error("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            console.error("The request to get user location timed out.");
            break;
          default:
            console.error("An unknown error occurred.");
            break;
        }
      }
    );
  }, [currentCityCoordinateIsChosen]);

  const handleOnChangeCity = (e) => {
    setTemptCity(cityCoordinates[e.target.value]);
  };

  const handleCity = () => {
    setCurrentCityCoordinateIsChosen(temptCity);
  };

  return (
    <div className="delivery-infor-content">
      <div className="deliver-title">
        <strong>Thông tin vận chuyển</strong>
      </div>
      <div className="delivery-address">
        <div className="address">
          <p>
            Delivery to: <strong>{currentCityCoordinateIsChosen.city}</strong>
          </p>
        </div>
        <div className="change-address">
          <div
            className="btn-change-address"
            data-bs-toggle="modal"
            data-bs-target="#changeCityModal"
          >
            change
          </div>
        </div>
        {/* Modal change city */}
        <div
          class="modal fade"
          id="changeCityModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                  Change city to delivery
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div class="input-group mb-3">
                  <select
                    className="form-select"
                    id="inputGroupSelect02"
                    onChange={(e) => handleOnChangeCity(e)}
                  >
                    {cityCoordinates.map((element, index) =>
                      element.city === currentCityCoordinateIsChosen.city ? (
                        <option key={index} value={index} selected>
                          {element.city}
                        </option>
                      ) : (
                        <option key={index} value={index}>
                          {element.city}
                        </option>
                      )
                    )}
                  </select>
                  <label class="input-group-text" for="inputGroupSelect02">
                    Options
                  </label>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={handleCity}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="expect_delivery_detail" className="expect-delivery-detail">
        <div className="icon-delivery">
          <TbTruckDelivery></TbTruckDelivery>
        </div>
        <div className="expect-time-delivery">
          <div className="name-delivery">
            <strong>Standard Delivery</strong>
          </div>
          <div className="time-delivery">
            <span>
              Expect delivery: <strong>{estimatedDeliveryTime}</strong>
            </span>
          </div>
        </div>
      </div>
      <div id="quantity" className="quantity-to-buy">
        <div className="titile-quantity">
          <h4>Quantity:</h4>
        </div>
        <div className="btn-chose-quantity">
          <ChooseQuantity count={count} handleQuantity={handleQuantityChange} />
        </div>
      </div>
    </div>
  );
}

export default DeliveryInfo;
