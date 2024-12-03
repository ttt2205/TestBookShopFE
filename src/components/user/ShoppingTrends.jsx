import React, { useState } from "react";
import PaginationComponent from "context/pagination";
import RenderContent from "context/RenderContent";
import { FaArrowTrendUp } from "react-icons/fa6";
import { Container, Row, Col, Breadcrumb, Button } from "react-bootstrap";
import { useFetchBooks } from "config/useFetchBook";

const ShoppingTrends = () => {
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { books } = useFetchBooks(1, 1000);

  // Handle genre change
  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setCurrentPage(1); // reset về trang đầu
  };

  // Filter books by selected genre
  const filteredBooks =
    selectedGenre === "all"
      ? books
      : books.filter((book) => book.genre.name === selectedGenre);

  // Pagination 
  const booksPerPage = 12;
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const displayedBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      {/* Breadcrumb */}
      <Row>
        <Col>
          <Breadcrumb className="custom-breadcrumb">
            <Breadcrumb.Item href="/">TRANG CHỦ</Breadcrumb.Item>
            <Breadcrumb.Item active>XU HƯỚNG MUA SẮM</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      {/* Header */}
      <Row className="container">
        <Col className="d-flex align-items-center trend-header">
          <FaArrowTrendUp size={30} />
          <h4 className="m-1 fw-b p-2">XU HƯỚNG MUA SẮM</h4>
        </Col>
      </Row>

      {/*  Buttons */}
      <Row className="mt-3">
        <Col>
          <div>
            <Button className="m-2" onClick={() => handleGenreChange("all")}>Tất cả</Button>
            <Button className="m-2" onClick={() => handleGenreChange("Fiction")}>Fiction</Button>
            <Button className="m-2" onClick={() => handleGenreChange("Adventure")}>Adventure</Button>
            <Button className="m-2" onClick={() => handleGenreChange("High School")}>
              High School
            </Button>
          </div>
        </Col>
      </Row>

      {/* Render Content */}
      <Row className="mt-4">
        <RenderContent books={displayedBooks} />
      </Row>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </Container>
  );
};

export default ShoppingTrends;
