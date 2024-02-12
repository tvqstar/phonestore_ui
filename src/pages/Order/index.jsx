import classNames from 'classnames/bind';
import { useContext, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

import Button from '../../components/Button';
import { DataContext } from '../../Provider';

import { Tab, Tabs, Box, Typography } from '@mui/material';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

import styles from './Order.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function Order() {
    const cx = classNames.bind(styles);

    const value = useContext(DataContext);
    const [order] = value.order;
    const reload = value.reload;

    const [values, setValues] = useState(0);
    const [status, setStatus] = useState('');

    const handleChange = (event, newValue) => {
        if (newValue == 1) {
            setStatus('Chờ xác nhận');
        } else if (newValue == 2) {
            setStatus('Đang giao');
        } else if (newValue == 3) {
            setStatus('Đã giao');
        } else if (newValue == 4) {
            setStatus('Đã hủy');
        }
        setValues(newValue);
    };

    const [loading, setLoading] = useState(false);

    const order1 = [...order].filter((ord) => ord.status == status);

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
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                    <Tabs
                        value={values}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                        sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                    >
                        <Tab sx={{ flex: 1, fontSize: '1.3rem' }} label="Tất cả" {...a11yProps(0)} />
                        <Tab sx={{ flex: 1, fontSize: '1.3rem' }} label="Chờ xác nhận" {...a11yProps(1)} />
                        <Tab sx={{ flex: 1, fontSize: '1.3rem' }} label="Đang giao" {...a11yProps(2)} />
                        <Tab sx={{ flex: 1, fontSize: '1.3rem' }} label="Đã giao" {...a11yProps(3)} />
                        <Tab sx={{ flex: 1, fontSize: '1.3rem' }} label="Đã hủy" {...a11yProps(4)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={values} index={0}>
                    <div className={cx('list-order')}>
                        {[...order].reverse().map((od) => (
                            <div style={{ padding: '10px' }} key={od._id} className={cx('list-items')}>
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
                                                    {/* <p className={cx('item-desc')}>{product.description}</p> */}
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

                                {od.status == 'Chờ xác nhận' && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '5px' }}>
                                        <Button outline onClick={(e) => handleCancle(e, od._id)}>
                                            {!loading && <p>Hủy</p>}
                                            {!!loading && <FontAwesomeIcon className={cx('loading-icon')} icon={faSpinner} />}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={values} index={1}>
                    <div className={cx('list-order')}>
                        {[...order1].reverse().map((od) => (
                            <div style={{ padding: '10px' }} key={od._id} className={cx('list-items')}>
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
                                                    {/* <p className={cx('item-desc')}>{product.description}</p> */}
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

                                {od.status == 'Chờ xác nhận' && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '5px' }}>
                                        <Button outline onClick={(e) => handleCancle(e, od._id)}>
                                            Hủy
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={values} index={2}>
                    <div className={cx('list-order')}>
                        {[...order1].reverse().map((od) => (
                            <div style={{ padding: '10px' }} key={od._id} className={cx('list-items')}>
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
                                                    {/* <p className={cx('item-desc')}>{product.description}</p> */}
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

                                {od.status == 'Chờ xác nhận' && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '5px' }}>
                                        <Button outline onClick={(e) => handleCancle(e, od._id)}>
                                            Hủy
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={values} index={3}>
                    <div className={cx('list-order')}>
                        {[...order1].reverse().map((od) => (
                            <div style={{ padding: '10px' }} key={od._id} className={cx('list-items')}>
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
                                                    {/* <p className={cx('item-desc')}>{product.description}</p> */}
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

                                {od.status == 'Chờ xác nhận' && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '5px' }}>
                                        <Button outline onClick={(e) => handleCancle(e, od._id)}>
                                            Hủy
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={values} index={4}>
                    <div className={cx('list-order')}>
                        {[...order1].reverse().map((od) => (
                            <div style={{ padding: '10px' }} key={od._id} className={cx('list-items')}>
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
                                                    {/* <p className={cx('item-desc')}>{product.description}</p> */}
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

                                {od.status == 'Chờ xác nhận' && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '5px' }}>
                                        <Button outline onClick={(e) => handleCancle(e, od._id)}>
                                            Hủy
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CustomTabPanel>
            </Box>
        </>
    );
}

export default Order;
