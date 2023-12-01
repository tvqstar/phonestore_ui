import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import moment from 'moment';
// import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

// import Button from '../Button';
import styles from './Product.module.scss';
// import routesConfig from '~/config/routes';

function Product({ data }) {
    const cx = classNames.bind(styles);

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return (
        <div className="col l-2-4 m-4 c-6">
            <div className={cx('product-item')}>
                <Link className={cx('product-link')} to={`/${data.slug}`}>
                    <div
                        className={cx('imgPro')}
                        style={{
                            backgroundImage: `url(http://localhost:4001/api/product/image/${data.image})`,
                        }}
                    ></div>

                    <h4 className={cx('product-name')}>{data.name}</h4>

                    <div className={cx('price')}>
                        <span className={cx('inStock')}>{`${data.colors.length} màu sắc`}</span>
                        <span className={cx('price-current')}>{`${VND.format(data.price)}`}</span>
                    </div>

                    {moment().diff(data.updatedAt, 'days') < 7 && (
                        <div className={cx('product-favourite')}>
                            <FontAwesomeIcon className={cx('icon_favourite')} icon={faCheck} />
                            <span>Mới nhất</span>
                        </div>
                    )}
                </Link>
            </div>
        </div>
    );
}

export default Product;
