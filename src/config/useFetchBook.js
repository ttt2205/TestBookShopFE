import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useFetchBooks = (initialPage = 1, limit = 3) => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBooks = useCallback(async (page) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/book?page=${page}&limit=${limit}`);
      setBooks(response.data.books);
      setTotalPages(response.data.total_page);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }, [limit]);

  useEffect(() => {
    fetchBooks(currentPage);
  }, [fetchBooks, currentPage]);

  return { books, currentPage, totalPages, setCurrentPage };
};
