import classNames from 'classnames/bind';
import { useContext } from 'react';
import moment from 'moment/moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

import Button from '../../components/Button';
import routesConfig from '../../config/routes';
import Images from '../../assets/Images/Images';

import Product from '../../components/Product';
import { DataContext } from '../../Provider';

import styles from './Home.module.scss';
import { Link } from 'react-router-dom';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function Home() {
    const cx = classNames.bind(styles);

    const value = useContext(DataContext);
    const [pro] = value.products;
    const [allNews] = value.allNews;

    // console.log(daysAgo);
    // const [loading] = value.loading;

    const products = [...pro].reverse().slice(0, 10); //Đảo ngược phần tử trong mảng
    // const pr = pro.filter((prod) => moment().diff(prod.updatedAt, 'days') < 15 )
    const news = [...allNews].reverse().slice(0, 5); //Đảo ngược phần tử trong mảng

    return (
        <>
            {/* san pham yeu thich */}
            <div className={cx('product-favourite')}>
                <h1 className={cx('product-favourite__title')}>Sản phẩm mới nhất</h1>

                {!!products && (
                    <div className={cx('product-item', 'row sm-gutter')}>
                        {products.map((pr) => (
                            <Product key={pr._id} data={pr} newPro={true} />
                        ))}
                    </div>
                )}

                <div className={cx('product-favourite__link')}>
                    <Button to={routesConfig.product} className={cx('btn')}>
                        Xem tất cả sản phẩm
                    </Button>
                </div>
            </div>

            <div className={cx('banner')}>
                <Button
                    className={cx('banner_image')}
                    to={routesConfig.product}
                    style={{
                        backgroundImage: `url(https://androidcommunity.com/wp-content/uploads/2015/12/Samsung-Galaxy-A8-3.jpg)`,
                    }}
                ></Button>

                <Button
                    className={cx('banner_image')}
                    to={routesConfig.product}
                    style={{
                        backgroundImage: `url(https://img.timviec.com.vn/2020/04/smartphone-la-gi-2.jpg)`,
                    }}
                ></Button>

                <Button
                    className={cx('banner_image')}
                    to={routesConfig.product}
                    style={{
                        backgroundImage: `url(https://images.tokopedia.net/img/cache/700/attachment/2019/11/26/157473236254416/157473236254416_d41c38e5-9e8c-45d5-b339-8193301c281c.png)`,
                    }}
                ></Button>
            </div>

            <div className={cx('news')}>
                <div className={cx('news-head')}>
                    <h1 className={cx('product-favourite__title')}>Bài viết mới nhất</h1>
                    <Link style={{ padding: '15px', color: 'var(--primary)' }} to={routesConfig.news}>
                        Xem tất cả &gt;
                    </Link>
                </div>

                {!!news && (
                    // <div>
                    //     {news.map((ne) => (
                    //         <Link className={cx('news-item')} to={`/news/${ne._id}`} key={ne._id}>
                    //             <div className={cx('content')}>
                    //                 <div>
                    //                     <img
                    //                         className={cx('img-news-home')}
                    //                         src={`http://localhost:4001/api/news/image/${ne.image}` || Images.logo}
                    //                         alt="Ta Van Quyet"
                    //                     />
                    //                 </div>
                    //                 <div className={cx('news-title')}>
                    //                     <h3>{ne.title}</h3>
                    //                 </div>
                    //             </div>

                    //             <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '7px', alignItems: 'center' }}>
                    //                 <FontAwesomeIcon style={{ color: '#ccc', marginRight: '2px' }} className={cx('time-news')} icon={faClock} />
                    //                 {moment(ne.updatedAt).format('DD - MM - YYYY')}
                    //             </div>
                    //         </Link>
                    //     ))}
                    // </div>

                    <div className={cx('row sm-gutter')}>
                        {news.map((ne) => (
                            <Link className={cx('news-item', 'col l-2 m-4 c-6')} to={`/news/${ne._id}`} key={ne._id}>
                                <div className={cx('content')}>
                                    <div>
                                        <img
                                            className={cx('img-news-home')}
                                            src={`http://localhost:4001/api/news/image/${ne.image}` || Images.logo}
                                            alt="Ta Van Quyet"
                                        />
                                    </div>
                                    <div className={cx('news-title')}>
                                        <h3>{ne.title}</h3>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '7px', alignItems: 'center' }}>
                                    <FontAwesomeIcon style={{ color: '#ccc', marginRight: '2px' }} className={cx('time-news')} icon={faClock} />
                                    {moment(ne.updatedAt).format('DD - MM - YYYY')}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default Home;
