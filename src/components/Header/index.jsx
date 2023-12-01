import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faCircleInfo, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import Tippy from '@tippyjs/react';

import styles from './Header.module.scss';
import Search from '../Search';
import routesConfig from '../../config/routes';
import Button from '../Button';
// import { DataContext } from '~/Provider';
import { useEffect, useState, useContext } from 'react';
import { DataContext } from '../../Provider';
import Images from '../../assets/Images/Images';

const cx = classNames.bind(styles);

function Header() {
    const value = useContext(DataContext);
    const [cart] = value.cart;
    const [user] = value.user;

    const [currentUser, setCurrentUser] = useState(false);
    const getCurrentUser = () => {
        return JSON.parse(localStorage.getItem('user'));
    };

    useEffect(() => {
        const user = getCurrentUser();

        if (user) {
            setCurrentUser(true);
        }
    }, []);

    // const value = useContext(DataContext);
    // const [cart] = value.cart;

    const logout = () => {
        localStorage.removeItem('user');
        window.location.replace('/');
        window.location.reload(true);
    };

    return (
        <header className={cx('wrapper')}>
            <div className={cx('content')}>
                <div className={cx('header_left')}>
                    <Link to={routesConfig.home}>
                        <img className={cx('logo')} src={Images.logo} alt="Ta Van Quyet" />
                        {/* Phone Store */}
                    </Link>

                    <Button text to={routesConfig.news}>
                        Tin tức
                    </Button>
                    <Button text to={routesConfig.product}>
                        Sản phẩm
                    </Button>
                </div>

                <Search />

                <div className={cx('header_right')}>
                    {currentUser ? (
                        <>
                            <Tippy delay={[0, 50]} content="Giỏ hàng" placement="bottom">
                                <Link className={cx('cart')} to={routesConfig.cart}>
                                    <FontAwesomeIcon className={cx('cart-icon')} icon={faCartShopping} />
                                    <span className={cx('cart-quantity')}>{cart?.items?.length || 0}</span>
                                </Link>
                            </Tippy>

                            <HeadlessTippy
                                interactive
                                placement="bottom-start"
                                delay={[0, 500]}
                                render={(attrs) => (
                                    <div className={cx('user-detail')} tabIndex="-1" {...attrs}>
                                        {/* <Link className={cx('user-link')} to={routesConfig.profile}>
                                            <FontAwesomeIcon className={cx('user-link-icon')} icon={faCircleInfo} />
                                            Thông tin tài khoản
                                        </Link> */}

                                        <Link className={cx('user-link')} to={routesConfig.order}>
                                            <FontAwesomeIcon className={cx('user-link-icon')} icon={faCircleInfo} />
                                            Đơn hàng
                                        </Link>

                                        <Link onClick={logout} className={cx('user-link')} to={'/'}>
                                            <FontAwesomeIcon className={cx('user-link-icon')} icon={faRightFromBracket} />
                                            Đăng xuất
                                        </Link>
                                    </div>
                                )}
                            >
                                <div className={cx('user')}>
                                    <div className={cx('userIcon-wrapper')}>
                                        <FontAwesomeIcon className={cx('user-icon')} icon={faUser} />
                                    </div>
                                    <div style={{ marginLeft: '3px' }}>
                                        <p>{user.username}</p>
                                    </div>
                                    {/* <p className={cx('user-name')}>UserName</p> */}
                                </div>
                            </HeadlessTippy>
                        </>
                    ) : (
                        <>
                            {/* <Tippy delay={[0, 50]} content="Giỏ hàng" placement="bottom">
                                <Link className={cx('cart')} to={routesConfig.cart}>
                                    <FontAwesomeIcon className={cx('cart-icon')} icon={faCartShopping} />
                                    <span className={cx('cart-quantity')}>{cart?.items?.length}</span>
                                </Link>
                            </Tippy> */}

                            <Button to={routesConfig.register} outline>
                                Đăng ký
                            </Button>
                            <Button to={routesConfig.login} primary>
                                Đăng nhập
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
