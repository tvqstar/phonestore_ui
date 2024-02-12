import classNames from 'classnames/bind';
import styles from './CategoryMNG.module.scss';
import { DataContext } from '../../../Provider';
import Pagination from '../../../components/Pagination';
import Modal from '../../../components/Modal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment/moment';
import { useContext, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

function CategoryMNG() {
    const cx = classNames.bind(styles);

    const value = useContext(DataContext);
    const [category] = value.category;
    const reload = value.reload;

    // Phan trang
    const [numPage, setNumPage] = useState(1); // Trang so x
    const [limitPage, setLimitPage] = useState(5); // So san pham cho 1 trang
    const lastIndex = numPage * limitPage; // san pham cuoi cua 1 trang
    const firstIndex = lastIndex - limitPage; // san pham dau cua 1 trang
    const totalPage = Math.ceil(category.length / limitPage); // tong cong x trang
    const record = category.slice(firstIndex, lastIndex); // render san pham

    const [showEdit, setShowEdit] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [err, setErr] = useState('');

    const [dataCate, setDataCate] = useState({
        _id: '',
        status: '',
    });

    const handleAdd = async (e) => {
        e.preventDefault();

        if (!name) {
            setErr('Điền tên danh mục');
            return;
        }

        setLoading(true);
        const res = await axios.post(`https://phone-tv49.onrender.com/api/product/add-category`, { name });
        setLoading(false);

        if (res.data.status === 'SUCCESS') {
            swal({
                icon: 'success',
                title: 'Thêm thành công',
            });
            setName('');
            setErr('');
            setShowAdd(false);
            reload();
            return;
        } else {
            setErr(res.data);
            return;
        }
    };

    const Edit = (id) => {
        const cateEdit = record.find((ct) => ct._id == id);
        setDataCate({
            _id: cateEdit._id,
            name: cateEdit.name,
        });
        setShowEdit(true);
    };

    const handleEdit = async (e) => {
        try {
            e.preventDefault();

            setLoading(true);
            const res = await axios.put(`https://phone-tv49.onrender.com/api/product/edit-category/${dataCate._id}`, {
                name: dataCate.name,
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

    const handleDelete = (e, id) => {
        e.preventDefault();
        swal({
            title: 'Cảnh báo!',
            text: 'Bạn có thật sự muốn xóa!',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                setLoading(true);
                axios.delete(`https://phone-tv49.onrender.com/api/product/delete-category/${id}`);
                setLoading(false);
                reload();
            }
        });
    };

    const handleChangeLimit = (e) => {
        setLimitPage(e.target.value);
        setNumPage(1);
    };

    return (
        <>
            <div>
                <div>
                    <h2>Tất cả danh mục</h2>
                </div>

                <div className={cx('option', 'row sm-gutter')}>
                    {!showAdd ? (
                        <button className={cx('btn', 'btn-add-product')} onClick={() => setShowAdd(true)}>
                            Thêm danh mục
                        </button>
                    ) : (
                        <div></div>
                    )}
                    <select className={cx('option-page')} onChange={(e) => handleChangeLimit(e)}>
                        <option value={limitPage}>Lựa chọn số bản ghi</option>
                        <option value={5}>5</option>
                        <option value={7}>7</option>
                        <option value={10}>10</option>
                    </select>
                </div>

                {!!showAdd && (
                    <>
                        <div>
                            <label className={cx('input-title')}>Tên danh mục</label>
                            <input className={cx('input')} type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className={cx('btn-group')}>
                            <button className={cx('btn', 'btn-add-product')} onClick={(e) => handleAdd(e)}>
                                Thêm
                            </button>
                            <button className={cx('btn', 'btn-cancel')} onClick={() => setShowAdd(false)}>
                                Hủy
                            </button>
                        </div>

                        {err && <span>{err}</span>}
                    </>
                )}

                <table className={cx('wrapper')}>
                    <thead>
                        <tr className={cx('trhead', 'row sm-gutter')}>
                            <th className={cx('col l-1 m-4 c-6')}>STT</th>
                            <th className={cx('col l-3 m-4 c-6')}>Tên</th>
                            <th className={cx('col l-3 m-4 c-6')}>Cập nhật mới</th>
                            <th className={cx('col l-5 m-4 c-6')}>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {record?.map((cate, index) => {
                            return (
                                <tr key={cate._id} className={cx('trbody', 'row sm-gutter')}>
                                    <td className="col l-1 m-4 c-6">
                                        <h4>{`#${index + 1}`}</h4>
                                    </td>

                                    <td className="col l-3 m-4 c-6">
                                        <h4>{cate.name}</h4>
                                    </td>

                                    <td className="col l-3 m-4 c-6">{moment(cate.updatedAt).format('DD-MM-YYYY')}</td>

                                    <td className="col l-5 m-4 c-6">
                                        <span className={cx('action')}>
                                            <Tippy delay={[0, 100]} content="Thay đổi" placement="top">
                                                <button className={cx('check')} onClick={() => Edit(cate._id)}>
                                                    <FontAwesomeIcon className={cx('edit-icon')} icon={faPenToSquare} />
                                                </button>
                                            </Tippy>

                                            <Tippy delay={[0, 100]} content="Xóa" placement="top">
                                                <button className={cx('delete')} onClick={(e) => handleDelete(e, cate._id)}>
                                                    <FontAwesomeIcon className={cx('delete-icon')} icon={faTrash} />
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

                <Modal show={showEdit} onClose={() => setShowEdit(false)}>
                    <div className={cx('content')}>
                        <div className={cx('content-value')}>
                            <h3 style={{ margin: '5px' }}>Tên danh mục mới</h3>
                            <input
                                className={cx('input')}
                                type="text"
                                value={dataCate.name}
                                onChange={(e) => setDataCate({ ...dataCate, name: e.target.value })}
                            />
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

export default CategoryMNG;
