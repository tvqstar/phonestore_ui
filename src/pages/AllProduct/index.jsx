import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Product from '../../components/Product';
import Pagination from '../../components/Pagination';
import classNames from 'classnames/bind';
import styles from './AllProduct.module.scss';
import { Box, Slider } from '@mui/material';

import Button from '../../components/Button';
import { DataContext } from '../../Provider';

function AllProduct() {
    const value = useContext(DataContext);
    const [pro, setPro] = value.products;
    const [sortPro, setSortPro] = useState([]);
    const [showSortPro, setShowSortPro] = useState(false);

    const max = Math.max(
        ...pro.map((pr) => {
            return pr.price;
        }),
    );

    const min = Math.min(
        ...pro.map((pr) => {
            return pr.price;
        }),
    );

    const [priceabout, setPriceabout] = useState([min, max]);

    const handleChange = (event, newValue) => {
        setPriceabout(newValue);
    };

    const valuetext = (value) => {
        return `${VND.format(value)}`;
    };
    // const [pro, setPro] = useState([]);
    // useEffect(() => {
    //     axios
    //         .get(`http://localhost:4001/api/product/get-product`)
    //         .then((res) => {
    //             setPro(res.data);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }, []);
    const cx = classNames.bind(styles);

    const [numPage, setNumPage] = useState(1); // Trang so x
    const [limitPage, setLimitPage] = useState(10); // So san pham cho 1 trang
    const lastIndex = numPage * limitPage; // san pham cuoi cua 1 trang
    const firstIndex = lastIndex - limitPage; // san pham dau cua 1 trang
    const totalPage = Math.ceil(pro.length / limitPage); // tong cong x trang
    const record = pro.slice(firstIndex, lastIndex); // render san pham

    const handleChangeLimit = (e) => {
        setLimitPage(e.target.value);
        setNumPage(1);
    };

    const sortValue = async () => {
        try {
            const min = priceabout[0] == 'Infinity' ? 0 : priceabout[0];
            const max = priceabout[1] == '-Infinity' ? 0 : priceabout[1];

            const filProd = pro.filter((pr) => pr.price >= min && pr.price <= max);
            setSortPro(filProd);
            setShowSortPro(true);
            return;
        } catch (error) {
            return;
        }
    };

    const switchProd = async (e) => {
        const val = e.target.value;
        switch (val) {
            case '0': {
                setShowSortPro(false);
                setPro([...pro]);
                break;
            }
            case '1': {
                setShowSortPro(false);
                const sort = pro.sort((a, b) => a.price - b.price);
                setPro([...sort]);
                break;
            }
            case '2': {
                setShowSortPro(false);
                const sort = pro.sort((a, b) => b.price - a.price);
                setPro([...sort]);
                break;
            }
            default: {
                setShowSortPro(false);
                setPro([...pro]);
                break;
            }
        }
    };

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    return (
        <div>
            <div className={cx('option', 'row sm-gutter')}>
                <select className={cx('option-page')} onChange={(e) => handleChangeLimit(e)}>
                    <option value={limitPage}>Lựa chọn số bản ghi</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={30}>30</option>
                </select>

                <select className={cx('option-page')} onChange={(e) => switchProd(e)}>
                    <option value={0}>Sắp xếp</option>
                    <option value={1}>Giá từ thấp tới cao</option>
                    <option value={2}>Giá từ cao tới thấp</option>
                </select>
            </div>

            <div className={cx('sort-wrapper')}>
                <div>
                    <p>Tìm kiếm theo khoảng giá</p>
                </div>
                <div className={cx('sort')}>
                    <Box sx={{ width: 200, display: 'block', margin: '0 15px' }}>
                        <Slider
                            getAriaLabel={() => 'Temperature range'}
                            value={priceabout}
                            onChange={handleChange}
                            valueLabelDisplay="auto"
                            getAriaValueText={valuetext}
                            min={min}
                            max={max}
                        />
                    </Box>

                    <p>Giá từ</p>
                    <p className={cx('sort-input')}>{priceabout[0] == 'Infinity' ? 0 : priceabout[0]}</p>

                    <p>Đến</p>
                    <p className={cx('sort-input')}>{priceabout[1] == '-Infinity' ? 0 : priceabout[1]}</p>

                    <Button outline className={cx('sort-button')} onClick={() => sortValue()}>
                        Lọc
                    </Button>
                </div>
            </div>
            <div className="row sm-gutter">
                {!showSortPro && record.map((pr) => <Product key={pr._id} data={pr} />)}

                {!!showSortPro && sortPro?.map((pr) => <Product key={pr._id} data={pr} />)}
            </div>
            <Pagination numPage={[numPage, setNumPage]} totalPage={totalPage} limitPage={limitPage} />
        </div>
    );
}

export default AllProduct;
