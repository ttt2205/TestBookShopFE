import React, { useEffect, useState } from "react";
import { BsCart3 } from "react-icons/bs";
import {
  ProductViewThumbnail,
  ProductViewPolicy,
} from "./product_view_essential_media";
import { getImagesForThumbnail } from "../../../services/detailProductService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function ProductViewEsstenialMedia({
  productID,
  count,
  detailProduct,
  getDiscountValueLatest,
  address,
}) {
  const [images, setImages] = useState([]);
  const [imageCurrent, setImageCurrent] = useState("");
  const [imageMain, setImageMain] = useState("");
  // begin thêm bởi tiệp để lấy detail product mỗi khi param thay đổi
  useEffect(() => {
    const fetchImageForThumbnailData = async () => {
      try {
        const ImageRespone = await getImagesForThumbnail(productID);
        const dataImages = chunksArray(ImageRespone.data.images, 4);
  
        for (let i = 0; i < ImageRespone.data.images.length; i++) {
          if (ImageRespone.data.images[i].is_main === 1) {
            setImageCurrent(ImageRespone.data.images[i].url);
            setImageMain(ImageRespone.data.images[i].url);
            break;
          }
        }
  
        setImages(dataImages);
      } catch (error) {
        console.log("Fetching data thumbnail error = ", error);
      }
    };
    fetchImageForThumbnailData();
  }, [productID]);
  //end
  useEffect(() => {
    const fetchImageForThumbnailData = async () => {
      try {
        const ImageRespone = await getImagesForThumbnail(productID);
        const dataImages = chunksArray(ImageRespone.data.images, 4);

        for (let i = 0; i < ImageRespone.data.images.length; i++) {
          if (ImageRespone.data.images[i].is_main === 1) {
            setImageCurrent(ImageRespone.data.images[i].url);
            setImageMain(ImageRespone.data.images[i].url);
            break;
          }
        }

        setImages(dataImages);
      } catch (error) {
        console.log("Fetching data thumbnail error = ", error);
      }
    };
    fetchImageForThumbnailData();
  }, []);

  // Phan chia thumbnailImages thanh 4 phan trong 1 nhom
  const chunksArray = (arr, size) => {
    let newArr = [];
    let length = arr.length;
    for (let i = 0; i < length; i += size) {
      newArr.push(arr.slice(i, i + size));
    }
    return newArr;
  };

  const handleOnclickThumbnail = (imageClicked) => {
    setImageCurrent(imageClicked);
  };

  // Hàm xử lý khi nhấn vào nút thêm giỏ hàng
  const handleOnclickButtonAddToCard = () => {
    if (checkStockQuantity()) handleAddItemInCart();
  };

  // Thêm sản phẩm đã chọn vào giỏ hàng
  const handleAddItemInCart = () => {
    const bestDiscount = getDiscountValueLatest(detailProduct.discounts);
    const infoProductCart = {
      productID: productID,
      salePrice: detailProduct.sale_price,
      discountId: bestDiscount.discountId,
      discountValue: bestDiscount.value,
      quantity: count,
      address: address,
      stockQuantity: detailProduct.stock_quantity,
      imageMain: imageMain,
      title: detailProduct.title,
      total:
        (detailProduct.sale_price * (100 - bestDiscount.value) * count) / 100,
    };

    // Lấy giỏ hàng từ localStorage (nếu chưa có thì tạo mảng rỗng)
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng hay chưa
    const existingProduct = cart.find((item) => item.productID === productID);

    if (existingProduct) {
      // Nếu sản phẩm đã có, tăng số lượng
      existingProduct.quantity += infoProductCart.quantity;
    } else {
      // Nếu sản phẩm chưa có, thêm sản phẩm mới vào giỏ hàng
      cart.push(infoProductCart);
    }

    // Lưu giỏ hàng mới vào localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    // Lưu địa chỉ client chọn hiện tại
    localStorage.setItem("addressIsChose", address);
    toast.success("Đã thêm vào giỏ hàng !", {
      autoClose: 800,
      pauseOnHover: false,
    });
  };

  // Kiểm tra số lượng tồn kho
  const checkStockQuantity = () => {
    console.log(">>> start checkStockQuantity");
    let checkQuantityIsChosen = 0;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find((item) => item.productID === productID);

    if (existingProduct) {
      checkQuantityIsChosen = count + existingProduct.quantity;
      console.log(">>> existingProduct", checkQuantityIsChosen);
      if (checkQuantityIsChosen > existingProduct.stockQuantity) {
        alert(`Hiện tại không đủ hàng cho số lượng ${checkQuantityIsChosen}`);
        return false;
      }
      return true;
    }

    checkQuantityIsChosen = count;
    console.log(">>> existingProduct is not existing", checkQuantityIsChosen);
    if (checkQuantityIsChosen > detailProduct.stock_quantity) {
      alert(`Hiện tại không đủ hàng cho số lượng ${checkQuantityIsChosen}`);
      return false;
    }
    return true;
  };

  return (
    <>
      <div className="product-essential-content-media-parent">
        <div className="product-essential-media">
          <div className="product-view-media-addtocard">
            <div className="product-view-image">
              <div className="product-view-image-product">
                <img src={imageCurrent} alt="Image not found" />
              </div>

              <div className="product-view-thumbnail-parent">
                <ProductViewThumbnail
                  images={images}
                  handleOnclickThumbnail={handleOnclickThumbnail}
                ></ProductViewThumbnail>
              </div>
            </div>
            <div className="product-view-add-box">
              <button
                id="btn-add-to-card"
                className="btn-add-box"
                type="button"
                onClick={handleOnclickButtonAddToCard}
              >
                <BsCart3 size={20}></BsCart3>
                <span>Thêm vào giỏ hàng</span>
              </button>
              <Link
                to="/cart"
                id="btn-buy"
                className="btn-add-box d-flex justify-content-center align-items-center text-decoration-none"
              >
                Mua ngay
              </Link>
            </div>
          </div>

          <div className="product-view-policy">
            <ProductViewPolicy></ProductViewPolicy>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductViewEsstenialMedia;
