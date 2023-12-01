import classNames from 'classnames/bind';
import { useContext, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

import Button from '../../components/Button';
import { DataContext } from '../../Provider';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

import styles from './Order.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function Order() {
    const cx = classNames.bind(styles);

    const value = useContext(DataContext);
    const [order] = value.order;
    const reload = value.reload;

    const [loading, setLoading] = useState(false);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const handleCancle = async (e, id) => {
        try {
            e.preventDefault();

            setLoading(true);
            await delay(2000);
            const res = await axios.put(`http://localhost:4001/api/order/edit/${id}`, {
                status: 'Đã hủy',
            });
            setLoading(false);

            if (res.data.status === 'SUCCESS') {
                swal({
                    icon: 'success',
                    title: 'Đã hủy',
                });
                reload();
                return;
            } else {
                swal({
                    icon: 'error',
                    title: res.data,
                });
            }
            return;
        } catch (error) {
            console.log(error);
            return;
        }
    };

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return (
        <>
            <h3 className={cx('heading-cart')}>Đơn hàng</h3>

            <div className={cx('list-order')}>
                {order.map((od) => (
                    <div key={od._id} className={cx('list-items')}>
                        {od?.items?.map((product) => (
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
                                        <div className={cx('item-title')}>
                                            <h3 className={cx('item-name')}>Số lượng</h3>
                                            <p className={cx('item-desc')}>{product.quantity}</p>
                                        </div>
                                    </div>

                                    <div className="col l-2 m-4 c-6">
                                        <div className={cx('item-title')}>
                                            <h3 className={cx('item-name')}>Giá tiền</h3>
                                            <p className={cx('item-desc')}>{VND.format(product.price)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* san pham trong ham map */}
                            </div>
                        ))}
                        <div className={cx('sub')}>
                            <div>
                                <span className={cx('status')}>{`${od.status}`}</span>
                            </div>
                            <div>
                                <label className={cx('price')}>Thành tiền: </label>
                                <span className={cx('price')}>{`${VND.format(od.totalPrice)}`}</span>
                            </div>
                        </div>

                        {od.status !== 'Đã hủy' && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
                                <Button outline onClick={(e) => handleCancle(e, od._id)}>
                                    Hủy
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}

export default Order;
