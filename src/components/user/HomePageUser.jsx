import banner1 from "assets/images/banner1.png";
import banner2 from "assets/images/banner2.png";
import banner3 from "assets/images/banner3.png";
import banner4 from "assets/images/banner4.png";
import boardgameImg from "assets/images/boardgame.png";
import sgkImg from "assets/images/sgk.png";
import vanhocImg from "assets/images/vanhoc.png";
import thieunhiImg from "assets/images/thieunhi.png";
import ngoaivanImg from "assets/images/ngoaivan.png";
import banner6 from "assets/images/book26_v1.jpg";
import banner7 from "assets/images/book26_v2.jpg";
import "assets/scss/homePageUser.scss";
import { Carousel } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import "assets/scss/homePageUser.scss";
import RenderContent from "context/RenderContent";
import { useFetchBooks } from "config/useFetchBook";
import ScrollToTopButton from "components/ScrollToTopButton";
export default function HomePage() {
  const navigate = useNavigate();
  const { books } = useFetchBooks(1, 8);
  console.log(books);
  const handleNavigate = () => {
    navigate("/shopping-trends");
  };
  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${categoryName}`);
  };

  return (
    <main className="flex-fill container">
      <Carousel className=" mb-4 ">
        <Carousel.Item interval={1500}>
          <img src={banner1} alt="banner1" className="main-banner img-fluid" />
        </Carousel.Item>
        <Carousel.Item interval={1500}>
          <img src={banner6} alt="banner6" className="main-banner img-fluid" />
        </Carousel.Item>
        <Carousel.Item interval={1500}>
          <img src={banner7} alt="banner7" className="main-banner img-fluid" />
        </Carousel.Item>
      </Carousel>
      <div className="container d-flex ">
        <img src={banner2} alt="banner2" className="small-banner img-fluid" />
        <img src={banner3} alt="banner3" className="small-banner img-fluid" />
        <img src={banner4} alt="banner4" className="small-banner img-fluid" />
      </div>
      <div className="container mt-4">
        <h3>Danh mục sản phẩm</h3>
        <div className="row text-center product-category">
          <div className="col" onClick={() => handleCategoryClick("Adventure")}>
            <img src={boardgameImg} alt="Adventure" className="img-fluid" style={{ cursor: "pointer" }} />
            <p>Adventure</p>
          </div>
          <div
            className="col"
            onClick={() => handleCategoryClick("Primary School")}
          >
            <img src={sgkImg} alt="Primary School" className="img-fluid" style={{ cursor: "pointer" }} />
            <p>Primary School</p>
          </div>
          <div className="col" onClick={() => handleCategoryClick("Secondary School")}>
            <img src={vanhocImg} alt="Secondary School" className="img-fluid" style={{ cursor: "pointer" }} />
            <p>Secondary School</p>
          </div>
          <div className="col" onClick={() => handleCategoryClick("High School")}>
            <img src={thieunhiImg} alt="High School" className="img-fluid" style={{ cursor: "pointer" }} />
            <p>High School</p>
          </div>
          <div className="col" onClick={() => handleCategoryClick("Fiction")}>
            <img src={ngoaivanImg} alt="Fiction" className="img-fluid" style={{ cursor: "pointer" }} />
            <p>Fiction</p>
          </div>
        </div>
      </div>
      <div className="container mt-4">
        <h3 className="section-title">Xu hướng mua sắm</h3>

        <div className="row text-center d-flex">
          <RenderContent books={books} />
        </div>
        <div className="text-center mt-4">
          <button className="btn btn-danger" onClick={handleNavigate}>
            Xem thêm
          </button>
        </div>
      </div>
      <div className="container-fluid mt-4">
        <div className="border-footer"></div>
        
      </div>
    </main>
    
  );
}
