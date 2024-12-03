import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'assets/scss/footer.scss'; // Để thêm CSS tùy chỉnh nếu cần
import { CiMail } from "react-icons/ci";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPinterest } from "react-icons/fa";
import book_img from 'assets/images/book.png';

const Footer = () => {
    return (
        <footer className="footer container mt-5 border_top ">
            <div className="text-light py-4 ">

                <div className="row justify-content-center">
                    <div className="col-md-8 d-flex align-items-center hidden">
                        <CiMail size={32} className="mr-2 mb-3" />
                        <label className="mr-3 mb-3">Đăng kí nhận thông tin</label>

                        <div className="input-group flex-grow-1 mb-10">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email của bạn"
                                aria-label="Email của bạn"
                                aria-describedby="button-addon"
                            />
                            <div className="input-group-append">
                                <button className="btn btn-warning m-10" type="button" id="button-addon">
                                    Gửi
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='empty_space'></div>
                </div>


                {/* Footer content */}
                <div className="row mt-2 text-center">

                    <div className="col-md-4 border_right">
                        <img
                            src={book_img}
                            alt="BookBox Logo"
                            className="mb-3"
                            style={{ width: "150px" }}
                        />
                        <address >
                            Địa chỉ: 273 D. An Dương Vương,<br />
                            Phường 3, Quận 5, Hồ Chí Minh
                        </address>
                        <div className="social-icons">
                            <a href="/"><FaFacebook size={24} /></a>
                            <a href="/"><FaTwitter size={24} /></a>
                            <a href="/"><FaInstagram size={24} /></a>
                            <a href="/"><FaYoutube size={24} /></a>
                            <a href="/"><FaPinterest size={24} /></a>
                        </div>
                    </div>

                    {/* Dịch vụ */}
                    <div className="col-md-4">
                        <h5>Dịch vụ</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2 text-white"><a href="/">Điều khoản sử dụng</a></li>
                            <li className="mb-2 text-white"><a href="/">Chính sách bảo mật thông tin cá nhân</a></li>
                            <li className="mb-2 text-white"><a href="/">Chính sách bảo mật thanh toán</a></li>
                        </ul>
                    </div>

                    <div className="col-md-4">
                        <h5>Hỗ trợ</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2 text-white"><a href="/">Chính sách đổi trả hoàn tiền</a></li>
                            <li className="mb-2 text-white"><a href="/">Chính sách bảo hành</a></li>
                            <li className="mb-2 text-white"><a href="/">Chính sách vận chuyển</a></li>
                        </ul>
                    </div>

                </div>
            </div>
        </footer>
    );
}

export default Footer;
