import classNames from 'classnames/bind';
import styles from './OrderMNG.module.scss';
import { DataContext } from '../../../Provider';
import Pagination from '../../../components/Pagination';
import Modal from '../../../components/Modal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenToSquare, faSpinner } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment/moment';
import { useContext, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Link } from 'react-router-dom';

function OrderMNG() {
    const cx = classNames.bind(styles);

    const value = useContext(DataContext);
    const [allOrder] = value.allOrder;
    const reload = value.reload;

    // Phan trang
    const [numPage, setNumPage] = useState(1); // Trang so x
    const [limitPage, setLimitPage] = useState(10); // So san pham cho 1 trang
    const lastIndex = numPage * limitPage; // san pham cuoi cua 1 trang
    const firstIndex = lastIndex - limitPage; // san pham dau cua 1 trang
    const totalPage = Math.ceil(allOrder.length / limitPage); // tong cong x trang
    const record = [...allOrder].reverse().slice(firstIndex, lastIndex); // render san pham

    const [showEdit, setShowEdit] = useState(false);
    const [showItems, setShowItems] = useState(false);
    const [loading, setLoading] = useState(false);

    const [dataOrderEdit, setDataOrderEdit] = useState({
        _id: '',
        status: '',
    });

    const [dataItems, setDataItems] = useState([]);

    const Edit = (id) => {
        const orderEdit = record.find((od) => od._id == id);
        setDataOrderEdit({
            _id: orderEdit._id,
            status: orderEdit.status,
        });
        setShowEdit(true);
    };

    const handleEdit = async (e) => {
        try {
            e.preventDefault();

            setLoading(true);
            const res = await axios.put(`https://phone-tv49.onrender.com/api/order/edit/${dataOrderEdit._id}`, {
                status: dataOrderEdit.status,
            });
            setLoading(false);

            if (res.data.status === 'SUCCESS') {
                swal({
                    icon: 'success',
                    title: 'Cập nhật thành công',
                });
                reload();
                setShowEdit(false);
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

    // const viewItems = (id) => {
    //     const view = record.find((od) => od._id == id);
    //     setDataItems([...view.items]);
    //     setShowItems(true);
    // };

    const handleChangeLimit = (e) => {
        setLimitPage(e.target.value);
        setNumPage(1);
    };

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    return (
        <>
            <div>
                <div>
                    <h2>Tất cả đơn hàng</h2>
                </div>

                <div className={cx('option', 'row sm-gutter')}>
                    <select className={cx('option-page')} onChange={(e) => handleChangeLimit(e)}>
                        <option value={limitPage}>Lựa chọn số bản ghi</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                    </select>
                </div>

                <table className={cx('wrapper')}>
                    <thead>
                        <tr className={cx('trhead', 'row sm-gutter')}>
                            <th className={cx('col l-2 m-4 c-6')}>Tên</th>
                            <th className={cx('col l-3 m-4 c-6')}>Địa chỉ</th>
                            <th className={cx('col l-2 m-4 c-6')}>Số điện thoại</th>
                            <th className={cx('col l-2 m-4 c-6')}>Trạng thái</th>
                            <th className={cx('col l-1 m-4 c-6')}>Tổng tiền</th>
                            <th className={cx('col l-1 m-4 c-6')}>Ngày đặt</th>
                            <th className={cx('col l-1 m-4 c-6')}>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {record?.map((orderItem) => {
                            return (
                                <tr key={orderItem._id} className={cx('trbody', 'row sm-gutter')}>
                                    <td className="col l-2 m-4 c-6">
                                        <h4>{orderItem.name}</h4>
                                    </td>

                                    <td className="col l-3 m-4 c-6">
                                        <h4>{orderItem.address}</h4>
                                    </td>

                                    <td className="col l-2 m-4 c-6">
                                        <h4>{`0${orderItem.phone}`}</h4>
                                    </td>

                                    <td className="col l-2 m-4 c-6">
                                        <h4>{orderItem.status}</h4>
                                    </td>

                                    <td className="col l-1 m-4 c-6">
                                        <h4>{VND.format(orderItem.totalPrice)}</h4>
                                    </td>

                                    <td className="col l-1 m-4 c-6">{moment(orderItem.createdAt).format('DD-MM-YYYY')}</td>

                                    <td className="col l-1 m-4 c-6">
                                        <span className={cx('action')}>
                                            <Tippy delay={[0, 100]} content="Xem chi tiết" placement="left">
                                                {/* <Link to={`/${orderItem._id}`} className={cx('watch')} onClick={() => viewItems(orderItem._id)}> */}
                                                <Link to={`/admin/order/${orderItem._id}`} className={cx('watch')}>
                                                    <FontAwesomeIcon icon={faEye} />
                                                </Link>
                                            </Tippy>

                                            <Tippy delay={[0, 100]} content="Thay đổi" placement="top">
                                                <button
                                                    onClick={() => Edit(orderItem._id)}
                                                    className={cx(
                                                        'check',
                                                        `${orderItem.status == 'Đã hủy' || orderItem.status == 'Đã giao' ? 'disable' : ''}`,
                                                    )}
                                                >
                                                    <FontAwesomeIcon className={cx('edit-icon')} icon={faPenToSquare} />
                                                </button>
                                            </Tippy>
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <Pagination numPage={[numPage, setNumPage]} totalPage={totalPage} limitPage={limitPage} />

                <Modal show={showItems} onClose={() => setShowItems(false)}>
                    <div className={cx('content')}>
                        <div className={cx('close-btn')}>
                            <button className={cx('close-items')} onClick={() => setShowItems(false)}>
                                X
                            </button>
                        </div>
                        {dataItems?.map((product) => (
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

                                    <div className="col l-1 m-4 c-6">
                                        <div className={cx('item-title')}>
                                            <h3 className={cx('item-name')}>Màu</h3>
                                            <p className={cx('item-desc')}>{product.color}</p>
                                        </div>
                                    </div>

                                    <div className="col l-3 m-4 c-6">
                                        <div className={cx('item-title')}>
                                            <h3 className={cx('item-name')}>Số lượng</h3>
                                            <p className={cx('item-desc')}>{product.quantity}</p>
                                        </div>
                                    </div>

                                    <div className="col l-2 m-4 c-6">
                                        <div className={cx('item-title')}>
                                            <h3 className={cx('item-name')}>Giá</h3>
                                            <p className={cx('item-desc')}>{VND.format(product.price)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* san pham trong ham map */}
                            </div>
                        ))}
                    </div>
                </Modal>

                <Modal show={showEdit} onClose={() => setShowEdit(false)}>
                    <div className={cx('content')}>
                        <div className={cx('content-value')}>
                            {/* <div className={cx('edit-value')}>
                                <span className={cx('value-title')}>Tên tài khoản: </span>
                                <span>{dataUserEdit.username}</span>
                            </div> */}

                            <div className={cx('edit-value')}>
                                <span className={cx('value-title')}>Trạng thái: </span>
                                <label className={cx('first-child')}>
                                    <input
                                        type="radio"
                                        value={dataOrderEdit.status}
                                        checked={dataOrderEdit.status == 'Chờ xác nhận'}
                                        onChange={() => setDataOrderEdit({ ...dataOrderEdit, status: 'Chờ xác nhận' })}
                                    />
                                    Chờ xác nhận
                                </label>
                                <label className={cx('first-child')}>
                                    <input
                                        type="radio"
                                        value={!dataOrderEdit.status}
                                        checked={dataOrderEdit.status == 'Đang giao'}
                                        onChange={() => setDataOrderEdit({ ...dataOrderEdit, status: 'Đang giao' })}
                                    />
                                    Đang giao
                                </label>

                                <label className={cx('first-child')}>
                                    <input
                                        type="radio"
                                        value={!dataOrderEdit.status}
                                        checked={dataOrderEdit.status == 'Đã giao'}
                                        onChange={() => setDataOrderEdit({ ...dataOrderEdit, status: 'Đã giao' })}
                                    />
                                    Đã giao
                                </label>
                            </div>
                        </div>

                        <div className={cx('footer-btn')}>
                            <button className={cx('btn', 'btn-save')} onClick={(e) => handleEdit(e)}>
                                {!loading && <p>Cập nhật</p>}
                                {!!loading && <FontAwesomeIcon className={cx('loading-icon')} icon={faSpinner} />}
                            </button>
                            <button
                                className={cx('btn', 'btn-cancel')}
                                onClick={() => {
                                    setShowEdit(false);
                                }}
                            >
                                Hủy bỏ
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
}

export default OrderMNG;
