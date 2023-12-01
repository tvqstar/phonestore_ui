import classNames from 'classnames/bind';
import styles from './AdminLayout.module.scss';

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import adminRoutes from '../../config/adminRoutes';

function DefaultLayout({ children }) {
    const cx = classNames.bind(styles);
    const navigate = useNavigate();

    const us = localStorage.getItem('user');
    const admin = JSON.parse(us);
    

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload(true);
    };
    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('grid wide')}>
                    <div className={cx('row sm-gutter', 'container')}>
                        <div className="col l-3 m-0 c-0">
                            <div className={cx('wrapper-sidebar')}>
                                <div className={cx('content-top')}>
                                    <Link className={cx('admin-dashboard')} to={adminRoutes.home}>
                                        {admin.username}
                                        <FontAwesomeIcon className={cx('icon-admin')} icon={faKey} />
                                    </Link>

                                    <button onClick={handleLogout} className={cx('logout')}>
                                        {/* <button className={cx('logout')}> */}
                                        <FontAwesomeIcon icon={faRightFromBracket} />
                                    </button>
                                </div>

                                <div className={cx('content')}>
                                    <NavLink className={(nav) => cx('link', { active: nav.isActive })} to={adminRoutes.product}>
                                        Quản lý sản phẩm
                                    </NavLink>
                                    <NavLink className={(nav) => cx('link', { active: nav.isActive })} to={adminRoutes.user}>
                                        Quản lý người dùng
                                    </NavLink>
                                    <NavLink className={(nav) => cx('link', { active: nav.isActive })} to={adminRoutes.order}>
                                        Quản lý đơn hàng
                                    </NavLink>
                                    <NavLink className={(nav) => cx('link', { active: nav.isActive })} to={adminRoutes.category}>
                                        Quản lý danh mục sản phẩm
                                    </NavLink>
                                    <NavLink className={(nav) => cx('link', { active: nav.isActive })} to={adminRoutes.news}>
                                        Quản lý tin tức
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                        <div className="col l-9 m-12 c-12">
                            <div className={cx('content')}>{children}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DefaultLayout;
