import { useEffect, useState } from "react";
import "../../assets/scss/carousel.scss";

export default function ImageCarousel({ product, setDeletedImages, errors }) {
  const [activeIndex, setActiveIndex] = useState(0);
  let initialImages = product
    ? [product.image, ...product.alt_images].filter((img) => img !== null)
    : [];
  const [images, setImages] = useState(initialImages);
  const [mainIndex, setMainIndex] = useState(
    images.findIndex((img) => img.is_main === 1)
  );
  const [fileList, setFileList] = useState([]);
  // const [dataTransfer, setDataTransfer] = useState(new DataTransfer());

  const handleRemoveImage = (event) => {
    const index = parseInt(
      event.currentTarget.getAttribute("data-custom-index")
    );
    let length = images.length + fileList.length;
    if (index < images.length) {
      const newImages = images.filter((img, i) => i !== index);
      setDeletedImages((prevImages) => [...prevImages, images[index]]);
      setImages(newImages);
      if (index === mainIndex) {
        setMainIndex(-1);
      }
    } else {
      const newFileList = fileList.filter(
        (file, i) => i !== index - images.length
      );
      setFileList(newFileList);
    }
    length = length - 1;
    // Cập nhật activeIndex nếu ảnh bị xoá là ảnh hiện tại
    if (index === activeIndex) {
      setActiveIndex((prevIndex) => (prevIndex === length ? 0 : prevIndex));
    } else if (index < activeIndex) {
      setActiveIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleIndicatorClick = (event) => {
    const index = parseInt(
      event.currentTarget.getAttribute("data-bs-slide-to")
    );
    setActiveIndex(index);
  };

  const handleImageInput = (event) => {
    const files = event.target.files;
    const tempFileList = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let url = URL.createObjectURL(file);
      tempFileList.push({ file, url });
    }
    setFileList(tempFileList);
  };

  const renderIndicators = () => {
    const newImages = fileList.map((item) => ({
      url: item.url,
      status: "new",
    }));
    let contentImages = [...images, ...newImages];
    return contentImages.map((image, index) => (
      <div className="position-relative" key={index}>
        <button
          type="button"
          data-bs-target="#carouselImage"
          data-bs-slide-to={index}
          className={index === activeIndex ? "active" : ""}
          aria-current={index === activeIndex ? "true" : "false"}
          aria-label={`Slide ${index}`}
          style={{
            width: "40px",
            height: "40px",
            backgroundImage: image ? `url('${image.url}')` : "unset",
            backgroundSize: "cover",
            border: "none",
            marginLeft: "5px",
            marginRight: "5px",
          }}
          onClick={handleIndicatorClick}
        ></button>
        <div
          className="exit-btn"
          title="Remove"
          data-custom-index={index}
          onClick={handleRemoveImage}
        >
          <i className="fa-solid fa-xmark"></i>
        </div>
        {image.status === "new" && (
          <div className="status-indicator">
            <span className="badge bg-primary">New</span>
          </div>
        )}
        {index === mainIndex && (
          <div className="status-indicator">
            <span className="badge bg-success">Main</span>
          </div>
        )}
      </div>
    ));
  };

  const renderInner = () => {
    const newImages = fileList.map((item) => ({ url: item.url }));
    let contentImages = [...images, ...newImages];
    return contentImages.map((image, index) => (
      <div
        key={index}
        className={`carousel-item ${index === activeIndex ? "active" : ""}`}
        style={{
          backgroundImage: image ? `url('${image.url}')` : "unset",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "400px",
        }}
      ></div>
    ));
  };

  useEffect(() => {
    const input = document.getElementById("imageInput");
    // Tạo đối tượng DataTransfer để quản lý fileList
    const dataTransfer = new DataTransfer();

    // Thêm từng file vào DataTransfer
    fileList.forEach((item) => {
      dataTransfer.items.add(item.file);
    });

    // Gán lại file list cho input
    input.files = dataTransfer.files;
  }, [fileList]);

  const handleChangeMain = () => {
    if (activeIndex < images.length) {
      setMainIndex(activeIndex);
    }
  };

  return (
    <>
      <input
        id="imageInput"
        type="file"
        name="new_images"
        multiple
        className="form-control"
        onChange={handleImageInput}
      />
      {errors && errors.images && (
        <p style={{ color: "red" }}>{errors.images}</p>
      )}
      <input
        type="hidden"
        name="main_image_id"
        value={
          images.length > 0 && mainIndex >= 0
            ? images[mainIndex].bookImage_id
            : ""
        }
        disabled={images.length === 0}
      />
      <div
        id="carouselImage"
        className="carousel slide carousel-fade mt-3 w-100"
        data-bs-ride="false"
      >
        <div className="carousel-indicators">{renderIndicators()}</div>
        <div className="carousel-inner">{renderInner()}</div>
      </div>
      <button
        type="button"
        className={`btn btn-primary mt-3 ${
          activeIndex < images.length ? "" : "disabled"
        }`}
        onClick={handleChangeMain}
      >
        Mark as main
      </button>
    </>
  );
}
