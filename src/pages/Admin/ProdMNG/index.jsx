import classNames from 'classnames/bind';
import styles from './ProdMNG.module.scss';
import Modal from '../../../components/Modal';
import { DataContext } from '../../../Provider';
import Pagination from '../../../components/Pagination';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment/moment';
import { useContext, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

function Product() {
    const cx = classNames.bind(styles);
    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({
        name: '',
        slug: '',
        price: '',
        description: '',
        image: null,
        category: '',
    });

    const [colors, setColors] = useState([]);

    const [color, setColor] = useState({
        colorName: '',
        inStock: '',
    });

    // bat dau du lieu danh cho edit
    const [dataEdit, setDataEdit] = useState({
        _id: '',
        name: '',
        slug: '',
        price: '',
        description: '',
        image: null,
        category: '',
    });

    const [colorsEdit, setColorsEdit] = useState([]);

    const [colorEdit, setColorEdit] = useState({
        colorName: '',
        inStock: '',
    });

    const addColorEdit = () => {
        if (!colorEdit.colorName || !colorEdit.inStock) {
            setErr('Không để trống màu sắc');
            return;
        }
        const checkCol = colorsEdit.length >= 1 && colorsEdit.filter((col) => col.colorName === colorEdit.colorName);

        if (checkCol.length > 0) {
            setErr(`Màu ${color.colorName} đã tồn tại`);
            setColorEdit({
                colorName: '',
                inStock: '',
            });
            return;
        }
        if (colorEdit.inStock <= 0) {
            setErr('Chọn số lượng lớn hơn 1');
            return;
        }
        colorsEdit.push(colorEdit);
        setColorEdit({
            colorName: '',
            inStock: '',
        });
        setErr('');
    };

    // ket thuc du lieu danh cho edit

    const addColor = () => {
        if (!color.colorName || !color.inStock) {
            setErr('Không để trống màu sắc');
            return;
        }
        const checkCol = colors.length >= 1 && colors.filter((col) => col.colorName === color.colorName);

        if (checkCol.length > 0) {
            console.log(checkCol);
            setErr(`Màu ${color.colorName} đã tồn tại`);
            setColor({
                colorName: '',
                inStock: '',
            });
            return;
        }
        if (color.inStock <= 0) {
            setErr('Chọn số lượng lớn hơn 1');
            return;
        }
        colors.push(color);
        setColor({
            colorName: '',
            inStock: '',
        });
        setErr('');
    };

    const clearColor = (index) => {
        const newColors = [...colors];
        newColors.splice(index, 1);
        setColors(newColors);
    };

    const clearColorEdit = (index) => {
        const newColorsEdit = [...colorsEdit];
        // console.log(newColorsEdit);
        newColorsEdit.splice(index, 1);
        setColorsEdit(newColorsEdit);
    };

    // useEffect(() => {

    // }, [colors]);

    const value = useContext(DataContext);
    const [category] = value.category;
    const [products] = value.products;
    const reload = value.reload;

    // Phan trang
    const [numPage, setNumPage] = useState(1); // Trang so x
    const [limitPage, setLimitPage] = useState(5); // So san pham cho 1 trang
    const lastIndex = numPage * limitPage; // san pham cuoi cua 1 trang
    const firstIndex = lastIndex - limitPage; // san pham dau cua 1 trang
    const totalPage = Math.ceil(products.length / limitPage); // tong cong x trang
    const record = [...products].reverse().slice(firstIndex, lastIndex); // render san pham

    const handleAddProduct = async (e) => {
        try {
            e.preventDefault();

            setErr('');
            let formData = new FormData();

            formData.append('image', data.image);
            formData.append('name', data.name);
            formData.append('slug', data.slug);
            formData.append('price', data.price);
            formData.append('description', data.description);
            formData.append('category', data.category);

            if (!data.name || !data.price || !data.description || !data.slug || !data.category || !data.image) {
                setErr('Trường dữ liệu không được để trống');
                return;
            } else if (parseInt(data.price) <= 0) {
                setErr('Vui lòng nhập giá tiền lớn hơn 0');
                return;
            }
            if (colors.length < 1) {
                setErr('Thêm màu sắc');
                return;
            }

            colors.forEach((col, index) => {
                formData.append(`colors[${index}][colorName]`, col.colorName);
                formData.append(`colors[${index}][inStock]`, col.inStock);
            });

            setLoading(true);
            const res = await axios.post(`https://phone-tv49.onrender.com/api/product/add-product`, formData);
            setLoading(false);

            if (res.data.status === 'SUCCESS') {
                swal({
                    icon: 'success',
                    title: 'Thêm thành công',
                });
                setColor({
                    colorName: '',
                    inStock: '',
                });
                setData({
                    name: '',
                    slug: '',
                    price: '',
                    description: '',
                    image: null,
                    category: '',
                });
                setColors([]);
                setShow(false);
                reload();
                return;
            }
            // swal({
            //     icon: 'error',
            //     title: 'Xảy ra lỗi!',
            // });
            return;
        } catch (error) {
            console.log(error);
            return;
        }
    };

    // Chi edit so luong
    const handleOnlyEditQty = async (e, proID, col) => {
        e.preventDefault();

        const qty = e.target.value;

        const pro = products.find((prod) => prod._id == proID);
        const checkColor = pro.colors.find((color) => color._id == col._id);

        console.log('pro', pro);
        console.log('checkColor', checkColor);
        console.log('products', products);

        if (qty > 1000) {
            swal({
                icon: 'error',
                title: `Nên đặt số lượng tối đa 1000`,
            });
            return;
        }

        if (qty < 0) {
            swal({
                icon: 'error',
                title: 'Không để số lượng âm',
            });
            return;
        }

        axios
            .post('https://phone-tv49.onrender.com/api/product/edit-qty', {
                proId: proID,
                qty: qty,
                colorId: col._id,
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

    //  Edit san pham
    const Edit = (id) => {
        const prodedit = products.find((prod) => prod._id == id);
        setDataEdit({
            _id: prodedit._id,
            name: prodedit.name,
            slug: prodedit.slug,
            price: prodedit.price,
            description: prodedit.description,
            image: null,
            category: prodedit.category._id,
        });
        setColorsEdit(prodedit?.colors);
        setShowEdit(true);
    };

    const handleEdit = async (e) => {
        try {
            e.preventDefault();
            if (!dataEdit.name || !dataEdit.price || !dataEdit.description || !dataEdit.slug || !dataEdit.category) {
                setErr('Trường dữ liệu không được để trống');
                return;
            }
            if (colorsEdit.length < 1) {
                setErr('Thêm màu sắc');
                return;
            }

            let formData = new FormData();

            formData.append('image', dataEdit?.image);
            formData.append('name', dataEdit.name);
            formData.append('slug', dataEdit.slug);
            formData.append('price', dataEdit.price);
            formData.append('description', dataEdit.description);
            formData.append('category', dataEdit.category);

            colorsEdit.forEach((col, index) => {
                formData.append(`colors[${index}][colorName]`, col.colorName);
                formData.append(`colors[${index}][inStock]`, col.inStock);
            });

            setLoading(true);
            const res = await axios.post(`https://phone-tv49.onrender.com/api/product/edit/${dataEdit._id}`, formData);
            setLoading(false);

            if (res.data.status === 'SUCCESS') {
                swal({
                    icon: 'success',
                    title: 'Cập nhật thành công',
                });
                setColorEdit({
                    colorName: '',
                    inStock: '',
                });
                setDataEdit({
                    _id: '',
                    name: '',
                    slug: '',
                    price: '',
                    description: '',
                    image: null,
                    category: '',
                });
                setColorsEdit([]);
                setShowEdit(false);
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

    // Xoa san pham
    const handleDelete = (id) => {
        swal({
            title: 'Cảnh báo!',
            text: 'Bạn có thật sự muốn xóa!',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                axios.delete(`https://phone-tv49.onrender.com/api/product/delete/${id}`);
                reload();
            }
        });
    };

    // phan trang
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
                    <h2>Tất cả sản phẩm</h2>
                </div>

                <div className={cx('option', 'row sm-gutter')}>
                    <button className={cx('btn', 'btn-add-product')} onClick={() => setShow(true)}>
                        Thêm sản phẩm
                    </button>

                    <select className={cx('option-page')} onChange={(e) => handleChangeLimit(e)}>
                        <option value={limitPage}>Lựa chọn số bản ghi</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={30}>30</option>
                    </select>
                </div>

                <table className={cx('wrapper')}>
                    <thead>
                        <tr className={cx('trhead', 'row sm-gutter')}>
                            <th className={cx('col l-1 m-4 c-6')}>STT</th>
                            <th className={cx('col l-1 m-4 c-6')}>Hình ảnh</th>
                            <th className={cx('col l-5 m-4 c-6')}>Tên sản phẩm</th>
                            <th className={cx('col l-1 m-4 c-6')}>Giá tiền</th>
                            <th className={cx('col l-2 m-4 c-6')}>Màu sắc</th>
                            <th className={cx('col l-1 m-4 c-6')}>Ngày tạo</th>
                            <th className={cx('col l-1 m-4 c-6')}>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {record.map((prod, index) => {
                            return (
                                <tr key={prod._id} className={cx('trbody', 'row sm-gutter')}>
                                    <td className="col l-1 m-4 c-6">{`#${index + 1}`}</td>
                                    <td className={cx('col l-1 m-4 c-6')}>
                                        <div
                                            className={cx('item-img')}
                                            style={{
                                                backgroundImage: `url(https://phone-tv49.onrender.com/api/product/image/${prod.image})`,
                                            }}
                                        ></div>
                                    </td>

                                    <td className="col l-5 m-4 c-6">
                                        <div className={cx('item-title')}>
                                            <h3 className={cx('item-name')}>{prod.name}</h3>
                                            <p className={cx('item-desc')}>{prod.description}</p>
                                        </div>
                                    </td>

                                    <td className="col l-1 m-4 c-6">{VND.format(prod.price)}</td>
                                    <td className="col l-2 m-4 c-6">
                                        <div className={cx('color-list')}>
                                            {prod.colors.map((color) => (
                                                <div className={cx('color-item')} key={color._id}>
                                                    <div className={cx('item')}>
                                                        <label>Màu: </label>
                                                        <p className={cx('')}>{color.colorName}</p>
                                                    </div>
                                                    <p> - </p>
                                                    <div className={cx('item')}>
                                                        <label>Còn: </label>
                                                        {/* <p className={cx('')}>{color.inStock}</p> */}
                                                        <input
                                                            className={cx('qty-input')}
                                                            type="text"
                                                            value={color.inStock}
                                                            onChange={(e) => handleOnlyEditQty(e, prod._id, color)}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="col l-1 m-4 c-6">{moment(prod.createdAt).format('DD-MM-YYYY')}</td>

                                    <td className="col l-1 m-4 c-6">
                                        <span className={cx('action')}>
                                            <button className={cx('edit')} onClick={() => Edit(prod._id)}>
                                                <FontAwesomeIcon className={cx('edit-icon')} icon={faPenToSquare} />
                                            </button>
                                            <button className={cx('delete')} onClick={() => handleDelete(prod._id)}>
                                                <FontAwesomeIcon className={cx('delete-icon')} icon={faTrash} />
                                            </button>
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <Pagination numPage={[numPage, setNumPage]} totalPage={totalPage} limitPage={limitPage} />
            </div>

            <Modal show={show} onClose={() => setShow(false)}>
                <div className={cx('content')}>
                    <div className={cx('add-product-title')}>Thêm sản phẩm mới</div>
                    <div className={cx('add-product-form')}>
                        <div className={cx('product-form')}>
                            <label className={cx('input-title')}>Tên sản phẩm</label>
                            <input
                                className={cx('input')}
                                type="text"
                                value={data.name}
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                            />

                            <label className={cx('input-title')}>Giá tiền</label>
                            <input
                                className={cx('input')}
                                type="text"
                                value={data.price}
                                onChange={(e) => setData({ ...data, price: e.target.value })}
                            />

                            <label className={cx('input-title')}>Danh mục</label>
                            <select className={cx('input')} value={data.category} onChange={(e) => setData({ ...data, category: e.target.value })}>
                                <option value="Lựa chọn danh mục">-Lựa chọn danh mục-</option>
                                {category.map((cate, index) => (
                                    <option value={cate._id} key={index}>
                                        {cate.name}
                                    </option>
                                ))}
                                {/* <option value="B">B</option>
                                <option value="-">Other</option> */}
                            </select>
                        </div>

                        <div className={cx('product-form')}>
                            <label className={cx('input-title')}>Slug</label>
                            <input
                                className={cx('input')}
                                type="text"
                                value={data.slug}
                                onChange={(e) => setData({ ...data, slug: e.target.value })}
                            />

                            <label className={cx('input-title')}>Chọn ảnh</label>
                            <input
                                className={cx('input')}
                                type="file"
                                name="filename"
                                // value={data.description}
                                onChange={(e) => setData({ ...data, image: e.target.files[0] })}
                            />
                        </div>
                    </div>

                    <div className={cx('add-color')}>
                        <div>
                            <label className={cx('input-title')}>Màu sắc</label>
                            <input
                                className={cx('input')}
                                type="text"
                                value={color.colorName}
                                onChange={(e) => setColor({ ...color, colorName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className={cx('input-title')}>Số lượng</label>
                            <input
                                className={cx('input')}
                                type="number"
                                value={color.inStock}
                                onChange={(e) => setColor({ ...color, inStock: e.target.value })}
                            />
                        </div>

                        <button className={cx('btn', 'btn-save')} onClick={() => addColor()}>
                            Thêm màu
                        </button>
                    </div>

                    {colors.length >= 1 && (
                        <div className={cx('description')}>
                            <label className={cx('input-title')}>Màu đã thêm:</label>
                            {colors.map((col, index) => (
                                <div key={index} className={cx('color-checked')}>
                                    <div className={cx('color-checked-item')}>
                                        <label>- Màu: </label>
                                        <p> {col.colorName}</p>
                                    </div>
                                    <p> - </p>
                                    <div className={cx('color-checked-item')}>
                                        <label>Số lượng: </label>
                                        <p> {col.inStock}</p>
                                    </div>

                                    <button className={cx('clear-color')} onClick={() => clearColor(index)}>
                                        Xóa
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={cx('description')}>
                        <label className={cx('input-title')}>Mô tả</label>
                        {/* <textarea className={cx('description-input')}>Hekko</textarea> */}
                        <textarea
                            className={cx('description-input')}
                            value={data.description}
                            onChange={(e) => setData({ ...data, description: e.target.value })}
                        />
                    </div>

                    {err && <div style={{ color: 'red', marginLeft: '15px' }}>{err}</div>}

                    <div className={cx('footer-btn')}>
                        <button className={cx('btn', 'btn-save')} onClick={(e) => handleAddProduct(e)}>
                            {!loading && <p>Thêm</p>}
                            {!!loading && <FontAwesomeIcon className={cx('loading-icon')} icon={faSpinner} />}
                        </button>
                        <button
                            className={cx('btn', 'btn-cancel')}
                            onClick={() => {
                                setShow(false);
                            }}
                        >
                            Hủy bỏ
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal show={showEdit} onClose={() => setShowEdit(false)}>
                <div className={cx('content')}>
                    <div className={cx('add-product-title')}>Sửa sản phẩm</div>
                    <div className={cx('add-product-form')}>
                        <div className={cx('product-form')}>
                            <label className={cx('input-title')}>Tên sản phẩm</label>
                            <input
                                className={cx('input')}
                                type="text"
                                value={dataEdit.name}
                                onChange={(e) => setDataEdit({ ...dataEdit, name: e.target.value })}
                            />

                            <label className={cx('input-title')}>Giá tiền</label>
                            <input
                                className={cx('input')}
                                type="text"
                                value={dataEdit.price}
                                onChange={(e) => setDataEdit({ ...dataEdit, price: e.target.value })}
                            />

                            <label className={cx('input-title')}>Danh mục</label>
                            <select
                                className={cx('input')}
                                value={dataEdit.category}
                                onChange={(e) => setDataEdit({ ...dataEdit, category: e.target.value })}
                            >
                                <option value="Lựa chọn danh mục">-Lựa chọn danh mục-</option>
                                {category.map((cate, index) => (
                                    <option value={cate._id} key={index}>
                                        {cate.name}
                                    </option>
                                ))}
                                {/* <option value="B">B</option>
                                <option value="-">Other</option> */}
                            </select>
                        </div>

                        <div className={cx('product-form')}>
                            <label className={cx('input-title')}>Slug</label>
                            <input
                                className={cx('input')}
                                type="text"
                                value={dataEdit.slug}
                                onChange={(e) => setDataEdit({ ...dataEdit, slug: e.target.value })}
                            />

                            <label className={cx('input-title')}>Chọn ảnh</label>
                            <input
                                className={cx('input')}
                                type="file"
                                name="filename"
                                // value={data.description}
                                onChange={(e) => setDataEdit({ ...dataEdit, image: e.target.files[0] })}
                            />
                        </div>
                    </div>

                    <div className={cx('add-color')}>
                        <div>
                            <label className={cx('input-title')}>Màu sắc</label>
                            <input
                                className={cx('input')}
                                type="text"
                                value={colorEdit.colorName}
                                onChange={(e) => setColorEdit({ ...colorEdit, colorName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className={cx('input-title')}>Số lượng</label>
                            <input
                                className={cx('input')}
                                type="number"
                                value={colorEdit.inStock}
                                onChange={(e) => setColorEdit({ ...colorEdit, inStock: e.target.value })}
                            />
                        </div>

                        <button className={cx('btn', 'btn-save')} onClick={() => addColorEdit()}>
                            Thêm màu
                        </button>
                    </div>

                    {colorsEdit.length >= 1 && (
                        <div className={cx('description')}>
                            <label className={cx('input-title')}>Màu đã thêm:</label>
                            {colorsEdit.map((col, index) => (
                                <div key={index} className={cx('color-checked')}>
                                    <div className={cx('color-checked-item')}>
                                        <label>- Màu: </label>
                                        <p> {col.colorName}</p>
                                    </div>
                                    <p> - </p>
                                    <div className={cx('color-checked-item')}>
                                        <label>Số lượng: </label>
                                        <p> {col.inStock}</p>
                                    </div>

                                    <button className={cx('clear-color')} onClick={() => clearColorEdit(index)}>
                                        Xóa
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={cx('description')}>
                        <label className={cx('input-title')}>Mô tả</label>
                        {/* <textarea className={cx('description-input')}>Hekko</textarea> */}
                        <textarea
                            className={cx('description-input')}
                            value={dataEdit.description}
                            onChange={(e) => setDataEdit({ ...dataEdit, description: e.target.value })}
                        />
                    </div>

                    {err && <div style={{ color: 'red', marginLeft: '15px' }}>{err}</div>}

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
        </>
    );
}

export default Product;
