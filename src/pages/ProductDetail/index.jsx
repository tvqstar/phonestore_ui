import { useParams } from 'react-router-dom';
import { useContext, useState } from 'react';

import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import swal from 'sweetalert';
import axios from 'axios';

import Button from '../../components/Button';
import { DataContext } from '../../Provider';
import routesConfig from '../../config/routes';

import styles from './ProductDetail.module.scss';

const cx = classNames.bind(styles);

function ProductDetail() {
    const { slug } = useParams();

    console.log(slug);

    const value = useContext(DataContext);
    const [products] = value.products;
    const [user] = value.user;
    const reload = value.reload;

    const [qtity, setQtity] = useState(1);
    const [max, setMax] = useState(1);
    const [checked, setChecked] = useState('');

    const checkedColor = (id, inStock) => {
        setChecked(`${id}`);
        setMax(inStock);
        setQtity(inStock/inStock);
    };

    const decrease = () => {
        if (qtity <= 1) {
            swal({
                icon: 'error',
                title: 'Không thể giảm nữa :(',
            });
        } else {
            setQtity((prev) => prev - 1);
        }
    };
    const increase = () => {
        if (qtity < max) {
            setQtity((prev) => prev + 1);
        } else {
            swal({
                icon: 'error',
                title: `Tối đa ${max}`,
            });
        }
    };

    const addCart = (data) => {
        const id = user._id;

        if (checked === '') {
            swal({
                icon: 'error',
                title: 'Chọn màu sắc trước khi thêm',
            });
            return;
        }
        const items = {
            productId: data._id,
            product_name: data.name,
            color: checked,
            quantity: qtity,
            price: data.price,
            description: data.description,
            image: data.image,
        };

        axios
            .post('http://localhost:4001/api/cart/add', {
                id,
                items,
            })
            .then((res) => {
                reload();
                if (res.data.status === 'SUCCESS') {
                    swal({
                        icon: 'success',
                        title: 'Thêm thành công',
                    });
                } else {
                    swal({
                        icon: 'error',
                        title: `${res.data.msg}`,
                    });
                }
                return res.data;
            });
    };

    const detailProducts = products.filter((product) => {
        return product.slug === slug;
    });

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    return (
        <>
            {detailProducts.map((detailProduct) => (
                <div className={cx('product', 'row sm-gutter')} key={detailProduct._id}>
                    <div className="col l-5 m-5 c-5">
                        <div className={cx('product-images')}>
                            <div
                                className={cx('image')}
                                style={{
                                    backgroundImage: `url(http://localhost:4001/api/product/image/${detailProduct.image})`,
                                }}
                            ></div>

                            {/* <div className={cx('images-small')}>
                                <img className={cx('images-small-item')} src={detailProduct.image} alt="product" />
                                <img className={cx('images-small-item')} src={detailProduct.image} alt="product" />
                                <img className={cx('images-small-item')} src={detailProduct.image} alt="product" />
                            </div> */}
                        </div>
                    </div>

                    <div className="col l-7 m-7 c-7">
                        <div className={cx('product-title')}>
                            <div className={cx('wrap')}>
                                <h2>{detailProduct.name}</h2>
                            </div>

                            <div className={cx('wrap', 'sparate')}>
                                <h3 className={cx('price')}>{VND.format(detailProduct.price)}</h3>
                            </div>

                            <div className={cx('wrap', 'sparate')}>
                                <h3 className={cx('color')}>Màu sắc</h3>
                                {detailProduct.colors.map((color) => (
                                    <Button
                                        className={cx(`${color.colorName == checked ? 'checked' : ''}`)}
                                        outline
                                        key={color._id}
                                        onClick={() => checkedColor(color.colorName, color.inStock)}
                                    >
                                        {color.colorName}
                                    </Button>
                                ))}
                            </div>

                            <div className={cx('wrap', 'sparate')}>
                                <h4 className={cx('quantity')}>Số lượng</h4>

                                <div className={cx('select-quantity')}>
                                    <button className={cx('prev')} onClick={() => decrease()}>
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                    <span className={cx('value')}>{qtity}</span>
                                    <button className={cx('next')} onClick={() => increase()}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </div>
                                <div className={cx('max-qty')}>Số lượng tối đa {max}</div>

                                <Button className={cx(`${user.isAdmin == false ? '' : 'disable'}`)} primary onClick={() => addCart(detailProduct)}>
                                    Thêm vào giỏ
                                </Button>
                                <Button to={routesConfig.home} outline>
                                    Trở về
                                </Button>
                            </div>

                            <div className={cx('desc-wrap', 'sparate')}>
                                <h3 className={cx('desc')}>Mô tả sản phẩm</h3>

                                <h4 className={cx('desc-title')}>{detailProduct.name}</h4>

                                <p className={cx('desc-content')}>{detailProduct.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default ProductDetail;
