import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment/moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

import classNames from 'classnames/bind';
import styles from './News.module.scss';
import Pagination from '../../components/Pagination';
import { DataContext } from '../../Provider';
import Images from '../../assets/Images/Images';

function News() {
    const cx = classNames.bind(styles);

    const value = useContext(DataContext);
    const [allNews] = value.allNews;

    const [numPage, setNumPage] = useState(1); // Trang so x
    const [limitPage, setLimitPage] = useState(5); // So san pham cho 1 trang
    const lastIndex = numPage * limitPage; // san pham cuoi cua 1 trang
    const firstIndex = lastIndex - limitPage; // san pham dau cua 1 trang
    const totalPage = Math.ceil(allNews.length / limitPage); // tong cong x trang
    const record = allNews.slice(firstIndex, lastIndex); // render san pham

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
                <select className={cx('option-page')} onChange={(e) => handleChangeLimit(e)}>
                    <option value={limitPage}>Lựa chọn số bản ghi</option>
                    <option value={5}>5</option>
                    <option value={7}>7</option>
                    <option value={10}>10</option>
                </select>
            </div>

            <div className={cx('container')}>
                {record.map((news) => (
                    <Link to={`/news/${news._id}`} key={news._id}>
                        <div className={cx('content')}>
                            <div className={cx('wrap-content')}>
                                <div>
                                    <img
                                        className={cx('img-news-home')}
                                        src={`https://phone-tv49.onrender.com/api/news/image/${news.image}` || Images.logo}
                                        alt="Ta Van Quyet"
                                    />
                                </div>
                                <div className={cx('news-title')}>
                                    <h3>{news.title}</h3>
                                </div>
                                {/* <div className={cx('news-content')} dangerouslySetInnerHTML={{ __html: news.content }}></div> */}
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <FontAwesomeIcon className={cx('time-news')} icon={faClock} />
                            {moment(news.updatedAt).format('DD-MM-YYYY')}
                        </div>
                    </Link>
                ))}
            </div>
            <Pagination numPage={[numPage, setNumPage]} totalPage={totalPage} limitPage={limitPage} />
        </div>
    );
}

export default News;
