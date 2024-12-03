export default function Pagination({ page, setPage, total_page }) {
  const maxPages = 5; // Số trang tối đa hiển thị
  const pages = Array.from({ length: total_page }, (_, i) => i + 1);

  const changeToPage = (page) => {
    setPage(page);
  };

  const handlePrev = () => {
    let prevPage = page > 1 ? page - 1 : 1;
    setPage(prevPage);
  };

  const handleNext = () => {
    let nextPage = page < total_page ? page + 1 : total_page;
    setPage(nextPage);
  };

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <div className="page-link" onClick={handlePrev} aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </div>
        </li>
        {pages.map((value) => (
          <li
            className={`page-item ${value === page ? "active" : ""}`}
            key={value}
            onClick={() => changeToPage(value)}
          >
            <div className="page-link">{value}</div>
          </li>
        ))}
        <li className={`page-item ${page === total_page ? "disabled" : ""}`}>
          <div className="page-link" onClick={handleNext} aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </div>
        </li>
      </ul>
    </nav>
  );
}
