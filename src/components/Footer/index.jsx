import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Footer.module.scss';
import { faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <div className={cx('wrapper')}>
            <div className="grid wide">
                <div className="row sm-gutter">
                    <div className={cx('yourself', 'col l-3 m-6 c-6')}>
                        <h1 className={cx('title')}>GIỚI THIỆU</h1>
                        <p className={cx('sub-title')}>
                            Phone Store là cửa hàng điện thoại lớn với các mẫu điện thoại nổi tiếng trên thị trường, với nhiều năm hoạt động kinh
                            doanh điện thoại thông minh chúng tôi cam kết đem đến sản phẩm tốt nhất cho khách hàng.
                        </p>
                    </div>

                    <div className={cx('time', 'col l-3 m-6 c-6')}>
                        <h1 className={cx('title')}>Giờ mở cửa</h1>
                        <p className={cx('sub-title')}>Từ 9:00 - 20:00 tất cả các ngày trong tuần.</p>
                    </div>

                    <div className={cx('link-footer', 'col l-3 m-6 c-6')}>
                        <h1 className={cx('title')}>Chính sách bán hàng</h1>
                        <div className={cx('link')}>Cam kết 100% hàng chính hãng</div>
                        <div className={cx('link')}>Miễn phí giao hàng</div>
                        <div className={cx('link')}>Hoàn tiền 111% nếu hàng giả</div>
                        <div className={cx('link')}>Đổi trả trong 7 ngày</div>
                    </div>

                    <div className={cx('address', 'col l-3 m-6 c-6')}>
                        <h1 className={cx('title')}>THÔNG TIN LIÊN HỆ</h1>
                        <div className={cx('sub-title', 'sub-title-icon')}>
                            <FontAwesomeIcon className={cx('icon')} icon={faLocationDot} />
                            <div>
                                <span>195 Đ. Xuân Phương, Vân Canh, Nam Từ Liêm, Hà Nội.</span>
                            </div>
                        </div>

                        <div className={cx('sub-title', 'sub-title-icon')}>
                            <FontAwesomeIcon className={cx('icon')} icon={faPhone} />
                            <div>
                                <span>0986 076 797</span>
                            </div>
                        </div>

                        {/* <div className={cx('sub-title', 'sub-title-icon')}>
                            <FontAwesomeIcon className={cx('icon')} icon={faEnvelope} />
                            <div>
                                <span>phonestore@gmail.com</span>
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* <div className="row sm-gutter">
                    <div className="col l-12 m-12 c-12">
                        <div className={cx('content-end')}>
                            <span>
                                © 2023 Visitors. All rights reserved | by
                                <a href="https://www.facebook.com/tvq22/">Tạ Văn Quyết</a>
                            </span>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default Footer;
