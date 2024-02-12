import { useContext, useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import { DataContext } from '../../Provider';
import routesConfig from '../../config/routes';
import styles from './Cart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/Button';
import swal from 'sweetalert';
import axios from 'axios';

// import OTPInput from 'otp-input-react';
// import { auth } from '../../config/firebase';
// import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

function Cart() {
    const cx = classNames.bind(styles);

    const value = useContext(DataContext);
    const [cart] = value.cart;
    const [user] = value.user;
    const [products] = value.products;
    const reload = value.reload;
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const getTotal = () => {
            const res = cart?.items?.reduce((prev, item) => {
                return prev + item.price * item.quantity;
            }, 0);
            setTotal(res);
        };
        getTotal();
    }, [cart]);

    const decrease = (product) => {
        const id = user._id;

        if (product.quantity <= 1) {
            swal({
                icon: 'error',
                title: 'Chọn từ 1 sản phẩm',
            });
            return;
        }
        // const co = product.quantity - 1
        axios
            .post('https://phone-tv49.onrender.com/api/cart/edit', {
                id,
                qty: product.quantity - 1,
                product_Id: product._id,
            })
            .then((res) => {
                if (res.data.status === 'SUCCESS') {
                    reload();
                } else {
                    swal({
                        icon: 'error',
                        title: 'Có lỗi xảy ra',
                    });
                }
                return;
            });
    };
    const increase = (product) => {
        const id = user._id;
        const pro = products.find((prod) => prod._id == product.productId);
        const checkColor = pro.colors.find((color) => color.colorName == product.color);

        if (product.quantity >= checkColor.inStock) {
            swal({
                icon: 'error',
                title: `Chọn tối đa ${checkColor.inStock} sản phẩm`,
            });
            return;
        }

        axios
            .post('https://phone-tv49.onrender.com/api/cart/edit', {
                id,
                qty: product.quantity + 1,
                product_Id: product._id,
            })
            .then((res) => {
                if (res.data.status === 'SUCCESS') {
                    reload();
                } else {
                    swal({
                        icon: 'error',
                        title: 'Có lỗi xảy ra',
                    });
                }
                return;
            });
    };

    const changeQuantityInput = (e, product) => {
        e.preventDefault();

        const qtyDebounce = e.target.value;

        const id = user._id;
        const pro = products.find((prod) => prod._id == product.productId);
        const checkColor = pro.colors.find((color) => color.colorName == product.color);

        if (qtyDebounce > checkColor.inStock) {
            swal({
                icon: 'error',
                title: `Tối đa ${checkColor.inStock}`,
            });
            return;
        }

        if (qtyDebounce < 1) {
            swal({
                icon: 'error',
                title: 'Không thể giảm nữa :(',
            });
            return;
        }

        axios
            .post('https://phone-tv49.onrender.com/api/cart/edit', {
                id,
                qty: qtyDebounce,
                product_Id: product._id,
            })
            .then((res) => {
                if (res.data.status === 'SUCCESS') {
                    reload();
                } else {
                    swal({
                        icon: 'error',
                        title: 'Có lỗi xảy ra',
                    });
                }
                return;
            });
    };

    const removeProduct = (product) => {
        swal({
            title: 'Cảnh báo!',
            text: 'Bạn có thật sự muốn xóa!',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                const id = user._id;
                axios
                    .post('https://phone-tv49.onrender.com/api/cart/delete', {
                        id,
                        product_Id: product._id,
                    })
                    .then((res) => {
                        if (res.data.status === 'SUCCESS') {
                            reload();
                        } else {
                            swal({
                                icon: 'error',
                                title: 'Có lỗi xảy ra',
                            });
                        }
                        return;
                    });
            }
        });
    };

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    if (!cart?.items?.length) return <h2 style={{ minHeight: '400px', textAlign: 'center', fontSize: '3rem', marginTop: '15px' }}>Giỏ hàng trống</h2>;
    return (
        <>
            <h3 className={cx('heading-cart')}>Giỏ hàng</h3>

            <div className={cx('list-cart')}>
                {cart?.items?.map((product) => (
                    <div key={product._id}>
                        <div className={cx('cart-row', 'row sm-gutter')}>
                            {/* san pham trong ham map */}
                            <div className={cx('cart-item', 'col l-2 m-4 c-6')}>
                                <div
                                    className={cx('item-img')}
                                    style={{
                                        backgroundImage: `url(https://phone-tv49.onrender.com/api/product/image/${product.image})`,
                                    }}
                                ></div>
                            </div>

                            <div className="col l-4 m-4 c-6">
                                <div className={cx('item-title')}>
                                    <h3 className={cx('item-name')}>{product.product_name}</h3>
                                    <p className={cx('item-desc')}>{product.description}</p>
                                </div>
                            </div>

                            <div className="col l-2 m-4 c-6">
                                <div className={cx('item-title')}>
                                    <h3 className={cx('item-name')}>Màu sắc</h3>
                                    <p className={cx('item-desc')}>{product.color}</p>
                                </div>
                            </div>

                            <div className="col l-2 m-4 c-6">
                                <button className={cx('prev')} onClick={() => decrease(product)}>
                                    <FontAwesomeIcon icon={faMinus} />
                                </button>

                                {/* <span className={cx('value')}>{product.quantity}</span> */}
                                <input
                                    className={cx('value')}
                                    type="number"
                                    value={product.quantity}
                                    onChange={(e) => changeQuantityInput(e, product)}
                                />

                                <button
                                    className={cx('next')}
                                    onClick={() => {
                                        increase(product);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>

                            <div className="col l-1 m-4 c-6">
                                <span className={cx('price')}>{`${VND.format(product.price)}`}</span>
                            </div>

                            <div className="col l-1 m-4 c-6">
                                <button className={cx('delete')} onClick={() => removeProduct(product)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </div>

                        {/* san pham trong ham map */}
                    </div>
                ))}
            </div>

            <div className={cx('total-price')}>{`Tổng tiền: ${VND.format(total)}`}</div>

            <div className={cx('btn-cart')}>
                <Button to={routesConfig.checkout} primary>
                    Đặt hàng
                </Button>
                <Button to={routesConfig.home} outline>
                    Trở về
                </Button>
            </div>
        </>
    );
}

export default Cart;
