import { useContext, useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import { DataContext } from '../../Provider';
import Modal from '../../components/Modal';
import routesConfig from '../../config/routes';
import styles from './Cart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/Button';
import swal from 'sweetalert';
import axios from 'axios';

function Cart() {
    const cx = classNames.bind(styles);

    const [show, setShow] = useState(false);

    const value = useContext(DataContext);
    const [cart] = value.cart;
    const [user] = value.user;
    const [products] = value.products;
    const reload = value.reload;
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

    const decrease = (product) => {
        const id = user._id;

        if (product.quantity <= 1) {
            swal({
                icon: 'error',
                title: 'Không thể giảm nữa :(',
            });
            return;
        }
        // const co = product.quantity - 1
        axios
            .post('http://localhost:4001/api/cart/edit', {
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
                title: `Tối đa ${checkColor.inStock}`,
            });
            return;
        }

        axios
            .post('http://localhost:4001/api/cart/edit', {
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
                    .post('http://localhost:4001/api/cart/delete', {
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

    const addOrder = async (e) => {
        try {
            e.preventDefault();

            const phoneNumberRegex = /^(?:\+84|0)(?:\d){9}$/;
            if (order.name.trim() === '' || order.phone.trim() === '' || order.address.trim() === '') {
                setError('Trường dữ liệu không được để trống');
                return;
            } else if (!phoneNumberRegex.test(order.phone)) {
                setError('Vui lòng nhập đúng số điện thoại');
                return;
            }
            setError('');

            const res = await axios.post('http://localhost:4001/api/order/add', {
                user: user._id,
                name: order.name,
                phone: order.phone,
                address: order.address,
                items: cart.items,
                totalPrice: total,
            });
            if (res.data.status === 'SUCCESS') {
                setOrder({ name: '', phone: '', address: '' });
                swal({
                    icon: 'success',
                    title: 'Thêm thành công',
                });
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
        }
    };

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    if (cart?.items?.length == 0)
        return <h2 style={{ minHeight: '400px', textAlign: 'center', fontSize: '3rem', marginTop: '15px' }}>Giỏ hàng trống</h2>;

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
                                        backgroundImage: `url(http://localhost:4001/api/product/image/${product.image})`,
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

                                <span className={cx('value')}>{product.quantity}</span>

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
                <Button primary onClick={() => setShow(true)}>
                    Đặt hàng
                </Button>
                <Button to={routesConfig.home} outline>
                    Trở về
                </Button>
            </div>

            <Modal show={show} onClose={() => setShow(false)}>
                <div className={cx('wrap')}>
                    <h2 className={cx('header-info')}>THÔNG TIN THANH TOÁN</h2>
                    <div className={cx('info')}>
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

                        <label className={cx('input-title')}>Địa chỉ</label>
                        <textarea
                            className={cx('address-input')}
                            type="text"
                            value={order.address}
                            onChange={(e) => setOrder({ ...order, address: e.target.value })}
                        />
                    </div>

                    {error && <p style={{color: 'red', marginLeft: '5px'}}>{error}</p>}

                    <label className={cx('total-price')}>Tổng thanh toán: {VND.format(total) || 0}</label>

                    <div className={cx('btn-cart')}>
                        <Button primary onClick={(e) => addOrder(e)}>
                            Xác nhận
                        </Button>
                        <Button outline onClick={() => setShow(false)}>
                            Hủy
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default Cart;
