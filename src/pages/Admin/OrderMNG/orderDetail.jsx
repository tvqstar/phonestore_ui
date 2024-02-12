import { useParams } from 'react-router-dom';
import { useContext, useRef } from 'react';
import moment from 'moment/moment';
import Button from '../../../components/Button';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { DataContext } from '../../../Provider';

import classNames from 'classnames/bind';
import styles from './OrderMNG.module.scss';

function OrderDetail() {
    const cx = classNames.bind(styles);
    const value = useContext(DataContext);
    const [allOrder] = value.allOrder;
    const { id } = useParams();
    const pdfRef = useRef();

    // const vieww = allOrder.find((od) => od._id == id);
    // setDataItems(vieww);

    const orderDetail = allOrder.find((ord) => {
        return ord._id === id;
    });

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const handleExport = () => {
        const input = pdfRef.current;
        html2canvas(input, { useCORS: true }).then((canvas) => {
            let img = new Image();
            img.src = canvas.toDataURL('image/png');
            // const imgData = canvas.toDataURL('image/png');
            img.onload = () => {
                const pdf = new jsPDF('p', 'mm', 'a4', true);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                const imgX = (pdfWidth - imgWidth * ratio) / 2;
                const imgY = 30;
                pdf.addImage(img, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
                pdf.save(`${orderDetail._id}_${moment(Date.now()).format('DD_MM_YYYY')}.pdf`);
            };
        });
    };

    return (
        <>
            <div ref={pdfRef}>
                <div className={cx('customer')}>
                    <div className={cx('shop_address')}>
                        <h3>Người gửi:</h3>
                        <div className={cx('customer_title')}>
                            <p>Họ tên: Minh Cương Mobile</p>
                        </div>
                        <div className={cx('customer_title')}>
                            <p>Địa chỉ: 195 Đ. Xuân Phương, Vân Canh, Nam Từ Liêm, Hà Nội</p>
                        </div>
                        <div className={cx('customer_title')}>
                            <p>{`MÃ ĐƠN HÀNG: ${orderDetail._id}_${moment(Date.now()).format('DD_MM_YYYY')}`}</p>
                        </div>
                    </div>

                    <div className={cx('customer_address')}>
                        <h3>Người nhận:</h3>
                        <div className={cx('customer_title')}>
                            <p>Tài khoản:</p>
                            <span>{orderDetail?.user?.username}</span>
                        </div>
                        <div className={cx('customer_title')}>
                            <p>Họ tên:</p>
                            <span>{orderDetail?.name}</span>
                        </div>
                        <div className={cx('customer_title')}>
                            <p>Số điện thoại:</p>
                            <span>0{orderDetail?.phone}</span>
                        </div>
                        <div className={cx('customer_title')}>
                            <p>Địa chỉ:</p>
                            <span>{orderDetail?.address}</span>
                        </div>
                        <div className={cx('customer_title')}>
                            <p>Ngày đặt:</p>
                            <div>{moment(orderDetail?.createdAt).format('DD-MM-YYYY')}</div>
                        </div>
                    </div>
                </div>
                <div style={{ padding: '0 15px' }}>
                    <table className={cx('wrapper')}>
                        <thead>
                            <tr className={cx('trhead', 'row sm-gutter')}>
                                <th className={cx('col l-2 m-4 c-6')}>Ảnh sản phẩm</th>
                                <th className={cx('col l-4 m-4 c-6')}>Tên sản phẩm</th>
                                <th className={cx('col l-2 m-4 c-6')}>Màu sắc</th>
                                <th className={cx('col l-2 m-4 c-6')}>Số lượng</th>
                                <th className={cx('col l-2 m-4 c-6')}>Giá tiền</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orderDetail?.items.map((item) => {
                                return (
                                    <tr key={item._id} className={cx('trbody', 'row sm-gutter')}>
                                        <td className="col l-2 m-4 c-6">
                                            <img
                                                className={cx('image-order-detail')}
                                                alt="Ảnh sản phẩm"
                                                src={`https://phone-tv49.onrender.com/api/product/image/${item.image}`}
                                            />
                                        </td>

                                        <td className="col l-4 m-4 c-6">
                                            <h4>{item.product_name}</h4>
                                        </td>

                                        <td className="col l-2 m-4 c-6">
                                            <h4>{`${item.color}`}</h4>
                                        </td>

                                        <td className="col l-2 m-4 c-6">
                                            <h4>{item.quantity}</h4>
                                        </td>
                                        <td className="col l-2 m-4 c-6">
                                            <h4>{VND.format(item.price)}</h4>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div style={{ textAlign: 'end', margin: '15px' }}>
                    <h3>Tổng tiền</h3>
                    <p style={{ marginTop: '4px' }}>{VND.format(orderDetail?.totalPrice)}</p>
                </div>
            </div>
            <div style={{ textAlign: 'end' }}>
                <Button primary onClick={handleExport}>
                    In hóa đơn
                </Button>
            </div>
        </>
    );
}

export default OrderDetail;
