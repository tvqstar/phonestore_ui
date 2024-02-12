import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import { useNavigate } from 'react-router-dom';

import { DataContext } from '../../Provider';
import routesConfig from '../../config/routes';
import styles from './Cart.module.scss';
import Button from '../../components/Button';
import swal from 'sweetalert';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function CheckOut() {
    const cx = classNames.bind(styles);

    const navigate = useNavigate();

    const value = useContext(DataContext);
    const [cart] = value.cart;
    const [user] = value.user;
    // const [products] = value.products;
    const reload = value.reload;
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    const [order, setOrder] = useState({
        name: '',
        phone: '',
        address: '',
    });

    const [error, setError] = useState('');

    useEffect(() => {
        const getTotal = () => {
            const res = cart?.items?.reduce((prev, item) => {
                return prev + item.price * item.quantity;
            }, 0);
            setTotal(res);
        };
        getTotal();
    }, [cart]);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const addOrder = async (e) => {
        try {
            e.preventDefault();
            setError('');
            if (loading) {
                return;
            }

            const phoneNumberRegex = /^(?:\+84|0)(?:\d){9}$/;
            if (order.name.trim() === '' || order.phone.trim() === '' || order.address.trim() === '') {
                setError('Trường dữ liệu không được để trống');
                return;
            } else if (!phoneNumberRegex.test(order.phone)) {
                setError('Vui lòng nhập đúng số điện thoại');
                return;
            }

            setLoading(true);
            await delay(2000);

            const res = await axios.post('http://localhost:4001/api/order/add', {
                user: user._id,
                name: order.name,
                phone: order.phone,
                address: order.address,
                items: cart.items,
                totalPrice: total,
            });
            setLoading(false);

            if (res.data.status === 'SUCCESS') {
                setOrder({ name: '', phone: '', address: '' });
                swal({
                    icon: 'success',
                    title: 'Đặt hàng thành công',
                });
                navigate('/');
                reload();
                return;
            }
            swal({
                icon: 'error',
                title: 'Kiểm tra lại thông tin',
            });
            reload();
            return;
        } catch (error) {
            setError(error.message);
            return;
        }
    };

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return (
        <div className="row sm-gutter">
            <div className="col l-6 m-7 c-7 ">
                <div className={cx('wrap')}>
                    <h2 className={cx('header-info')}>THÔNG TIN THANH TOÁN</h2>
                    <div className={cx('info')}>
                        {/* <div id="recaptcha-container"></div> */}
                        <label className={cx('input-title')}>Tên người nhận</label>
                        <input
                            className={cx('input')}
                            type="text"
                            value={order.name}
                            onChange={(e) => setOrder({ ...order, name: e.target.value })}
                        />

                        <label className={cx('input-title')}>Số điện thoại</label>
                        <input
                            className={cx('input')}
                            type="text"
                            value={order.phone}
                            onChange={(e) => setOrder({ ...order, phone: e.target.value })}
                        />
                        <div id="recaptcha-container"></div>

                        <label className={cx('input-title')}>Địa chỉ</label>
                        <textarea
                            className={cx('address-input')}
                            type="text"
                            value={order.address}
                            onChange={(e) => setOrder({ ...order, address: e.target.value })}
                        />
                    </div>

                    {error && <p style={{ color: 'red', marginLeft: '5px' }}>{error}</p>}

                    <div className={cx('btn-cart_checkout')}>
                        <Button primary onClick={(e) => addOrder(e)}>
                            {!loading && <p>Xác nhận</p>}
                            {!!loading && <FontAwesomeIcon className={cx('loading-icon')} icon={faSpinner} />}
                        </Button>

                        <Button outline to={routesConfig.cart}>
                            Hủy
                        </Button>
                    </div>
                </div>
            </div>

            <div className="col l-6 m-5 c-5 ">
                <div className={cx('checkout')}>
                    {cart?.items?.map((product) => (
                        <div className={cx('list-item_checkout')} key={product._id}>
                            <div className={cx('cart-row', 'row sm-gutter')}>
                                {/* san pham trong ham map */}
                                <div className={cx('cart-item', 'col l-2 m-4 c-6')}>
                                    <div
                                        className={cx('item-img')}
                                        style={{
                                            backgroundImage: `url(http://localhost:4001/api/product/image/${product.image})`,
                                        }}
                                    ></div>
                                </div>

                                <div className="col l-7 m-4 c-6">
                                    <div className={cx('item-title')}>
                                        <h3 className={cx('item-name-check-out')}>{product.product_name}</h3>
                                    </div>
                                    <p>{product.color}</p>
                                    <p>x{product.quantity}</p>
                                </div>

                                <div className="col l-3 m-4 c-6">
                                    <div className={cx('price')}>{`${VND.format(product.price)}`}</div>
                                </div>
                            </div>

                            {/* san pham trong ham map */}
                        </div>
                    ))}

                    <div className={cx('total-price-checkout')}>{`Tổng tiền: ${VND.format(total)}`}</div>
                </div>
            </div>
        </div>
    );
}

export default CheckOut;
