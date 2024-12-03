import React, { useState, useEffect } from "react";
import "assets/scss/ScrollToTopButton.scss";
import topUpImg from "assets/images/chill_guy.webp";

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Xử lý sự kiện cuộn để hiển thị hoặc ẩn nút
    const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        setIsVisible(scrollTop > 50);
    };

    // Cuộn lên đầu trang khi nhấn nút
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div>
            {isVisible && (
                <div
                    className="scroll-to-top show"
                    onClick={scrollToTop}
                    aria-label="Scroll to top"
                >
                    <img
                        src={topUpImg}
                        alt="Scroll to top"
                        className="scroll-to-top-img"
                    />
                </div>
            )}
        </div>
    );
};

export default ScrollToTopButton;
