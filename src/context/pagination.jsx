import React from "react";
import { Pagination } from "react-bootstrap";
import "assets/scss/pagination.scss";

const PaginationComponent = ({ totalPages, currentPage, handlePageChange }) => {
    return (
        <>
            {totalPages > 1 && (
                <Pagination>
                    {currentPage > 1 && (
                        <Pagination.First onClick={() => handlePageChange(currentPage - 1)} />
                    )}
                    {Array.from({ length: totalPages }, (_, i) => (
                        <Pagination.Item
                            key={i + 1}
                            active={i + 1 === currentPage}
                            onClick={() => handlePageChange(i + 1)}
                        >
                            {i + 1}
                        </Pagination.Item>
                    ))}
                    {currentPage < totalPages && (
                        <Pagination.Last onClick={() => handlePageChange(currentPage + 1)} />
                    )}
                </Pagination>
            )}
        </>
    );
};

export default PaginationComponent;
