import { useContext, useEffect, useState } from 'react';
import moment from 'moment/moment';
import { DataContext } from '../../../Provider';

import classNames from 'classnames/bind';
import styles from './AdminHome.module.scss';

import DashBoardAdmin from '../../../components/DashboardAdmin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faNewspaper, faUser } from '@fortawesome/free-solid-svg-icons';

import adminRoutes from '../../../config/adminRoutes';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';

function AdminHome() {
    const cx = classNames.bind(styles);
    const value = useContext(DataContext);
    const [allNews] = value.allNews;
    const [allOrder] = value.allOrder;
    const [allUser] = value.allUser;
    const [products] = value.products;

    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(30);

    // moment().diff(data.updatedAt, 'days') < 15

    const sales = allOrder.filter((ord) => moment().diff(ord.updatedAt, 'days') < count && ord.status == 'Đã giao');

    useEffect(() => {
        const getTotal = () => {
            const res = sales?.reduce((prev, item) => {
                return prev + item.totalPrice;
            }, 0);
            setTotal(res);
        };
        getTotal();
    }, [sales]);

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return (
        <>
            <div>
                <h2>Tổng quan</h2>

                <div className={cx('row sm-gutter')}>
                    <DashBoardAdmin
                        quantity={allOrder.length}
                        title="Đơn hàng"
                        link={adminRoutes.order}
                        color="#00b4d8"
                        icon={<FontAwesomeIcon icon={faCartShopping} />}
                    />
                    <DashBoardAdmin
                        quantity={products.length}
                        title="Sản phẩm"
                        link={adminRoutes.product}
                        color="#f4a261"
                        icon={<FontAwesomeIcon icon={faProductHunt} />}
                    />
                    <DashBoardAdmin
                        quantity={allNews.length}
                        title="Bài viết"
                        link={adminRoutes.news}
                        color="#ce4257"
                        icon={<FontAwesomeIcon icon={faNewspaper} />}
                    />
                    <DashBoardAdmin
                        quantity={allUser.length}
                        title="Người dùng"
                        link={adminRoutes.user}
                        color="#2a9d8f"
                        icon={<FontAwesomeIcon icon={faUser} />}
                    />
                </div>
            </div>

            <div className={cx('sales')}>
                <div className={cx('sales-header')}>
                    <h1>{`${count < 100 ? `Số đơn trong ${count} ngày qua` : `Tất cả đơn hàng`}`}</h1>
                    {/* <h1>Số đơn trong {count} ngày qua</h1> */}

                    <select className={cx('option-page')} onChange={(e) => setCount(e.target.value)}>
                        <option value={count}>Lựa chọn thời gian</option>
                        <option value={7}>7 ngày qua</option>
                        <option value={30}>30 ngày qua</option>
                        <option value={90}>90 ngày qua</option>
                        <option value={90000000}>Tất cả</option>
                    </select>
                </div>

                <div>
                    <span style={{ fontSize: '2.2rem' }}>{sales?.length || 0} đơn hàng đã giao</span>
                </div>

                <div className={cx('sales-total')}>
                    <span>
                        Tổng thu: <span style={{ color: 'red' }}>{VND.format(total)}</span>
                    </span>
                </div>
            </div>
        </>
    );
}

export default AdminHome;
