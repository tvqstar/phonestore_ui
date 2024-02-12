import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment/moment';
import swal from 'sweetalert';
import axios from 'axios';

import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import classNames from 'classnames/bind';
import styles from './NewsMNG.module.scss';
import { DataContext } from '../../../Provider';
import Pagination from '../../../components/Pagination';
import adminRoutes from '../../../config/adminRoutes';
import Images from '../../../assets/Images/Images';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

function NewsMNG() {
    const cx = classNames.bind(styles);

    const value = useContext(DataContext);
    const [allNews] = value.allNews;
    const reload = value.reload;

    const [numPage, setNumPage] = useState(1); // Trang so x
    const [limitPage, setLimitPage] = useState(5); // So san pham cho 1 trang
    const lastIndex = numPage * limitPage; // san pham cuoi cua 1 trang
    const firstIndex = lastIndex - limitPage; // san pham dau cua 1 trang
    const totalPage = Math.ceil(allNews.length / limitPage); // tong cong x trang
    const record = allNews.slice(firstIndex, lastIndex); // render san pham

    const handleDelete = (e, id) => {
        e.preventDefault();
        swal({
            title: 'Cảnh báo!',
            text: 'Bạn có thật sự muốn xóa!',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                axios.delete(`https://phone-tv49.onrender.com/api/news/delete/${id}`);
                reload();
            }
        });
    };

    const handleChangeLimit = (e) => {
        setLimitPage(e.target.value);
        setNumPage(1);
    };

    return (
        <div>
            <div>
                <h2>Tất cả bài viết</h2>
            </div>

            <div className={cx('option', 'row sm-gutter')}>
                <Link to={adminRoutes.addNews} className={cx('btn', 'btn-add-product')}>
                    Thêm bài viết
                </Link>

                <select className={cx('option-page')} onChange={(e) => handleChangeLimit(e)}>
                    <option value={limitPage}>Lựa chọn số bản ghi</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={30}>30</option>
                </select>
            </div>

            <div className={cx('container')}>
                {record.map((news) => (
                    <div key={news._id}>
                        <div className={cx('content')}>
                            <div className={cx('wrap-content')}>
                                <div>
                                    <img
                                        className={cx('img-news')}
                                        src={`https://phone-tv49.onrender.com/api/news/image/${news.image}` || Images.logo}
                                        alt="Ta Van Quyet"
                                    />
                                </div>
                                <div className={cx('news-title')} style={{ marginLeft: '10px' }}>
                                    <h3>{news.title}</h3>
                                </div>
                                {/* <div className={cx('news-content')} dangerouslySetInnerHTML={{ __html: news.content }}></div> */}
                            </div>

                            <div>
                                <span className={cx('action')}>
                                    <Tippy delay={[0, 100]} content="Thay đổi" placement="top">
                                        <Link to={`/edit-news/${news._id}`} className={cx('check')}>
                                            <FontAwesomeIcon className={cx('edit-icon')} icon={faPenToSquare} />
                                        </Link>
                                    </Tippy>

                                    <Tippy delay={[0, 100]} content="Xóa" placement="top">
                                        <button className={cx('delete')} onClick={(e) => handleDelete(e, news._id)}>
                                            <FontAwesomeIcon className={cx('delete-icon')} icon={faTrash} />
                                        </button>
                                    </Tippy>
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{moment(news.updatedAt).format('DD-MM-YYYY')}</div>
                    </div>
                ))}
            </div>
            <Pagination numPage={[numPage, setNumPage]} totalPage={totalPage} limitPage={limitPage} />
        </div>
    );
}

export default NewsMNG;
