import React, { forwardRef } from "react";
import { AiOutlineBell } from "react-icons/ai";

// Sử dụng forwardRef để truyền ref xuống component con
const ModalNotice = forwardRef(
  ({ header, content, btnAction, handleAction }, ref) => {
    const closeModal = () => {
      if (ref.current) {
        // Kiểm tra xem phần tử có lớp "d-none" hay chưa
        if (ref.current.classList.contains("d-none")) {
          ref.current.classList.remove("d-none");
        } else {
          ref.current.classList.add("d-none");
        }
      }
    };

    return (
      <div className="modal-notice-container d-none" ref={ref}>
        <div className="modal-notice-content" style={{ position: "relative" }}>
          <div className="notice-header row pt-1 mb-2">
            <div
              className="col-10 d-flex align-items-center text-center"
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              <AiOutlineBell />
              &nbsp;&nbsp;<strong>{header}</strong>&nbsp;
            </div>
            <div className="col-2 d-flex align-items-center justify-content-end">
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeModal}
              ></button>
            </div>
          </div>
          <div
            className="notice-content d-flex align-items-center justify-content-start"
            style={{
              minHeight: "10vh",
              height: "auto",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              fontSize: "1.2rem",
            }}
          >
            {content}
          </div>
          <div
            className="btn-modal modal-footer w-100"
            style={{
              height: "5vh",
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAction}
            >
              {btnAction}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default ModalNotice;
