import { useParams } from 'react-router-dom';
import { useContext } from 'react';

import classNames from 'classnames/bind';
import styles from './News.module.scss';
import { DataContext } from '../../Provider';

function NewsDetail() {
    const { id } = useParams();
    const cx = classNames.bind(styles);

    const value = useContext(DataContext);
    const [allNews] = value.allNews;

    const newsDetail = allNews.find((news) => news._id === id);
    return (
        <>
            <div className={cx('newsDetail-wrap')}>
                <h3 className={cx('newsDetail-title')}>{newsDetail?.title}</h3>
                <div className={cx('newsDetail-content')} dangerouslySetInnerHTML={{ __html: newsDetail?.content }} />
            </div>
        </>
    );
}

export default NewsDetail;
