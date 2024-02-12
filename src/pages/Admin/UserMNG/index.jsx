import classNames from 'classnames/bind';
import styles from './UserMNG.module.scss';
import { DataContext } from '../../../Provider';
import Pagination from '../../../components/Pagination';
import Modal from '../../../components/Modal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faSpinner } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment/moment';
import { useContext, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

function UserMNG() {
    const cx = classNames.bind(styles);

    const value = useContext(DataContext);
    const [allUser] = value.allUser;
    const reload = value.reload;

    // Phan trang
    const [numPage, setNumPage] = useState(1); // Trang so x
    const [limitPage, setLimitPage] = useState(5); // So san pham cho 1 trang
    const lastIndex = numPage * limitPage; // san pham cuoi cua 1 trang
    const firstIndex = lastIndex - limitPage; // san pham dau cua 1 trang
    const totalPage = Math.ceil(allUser.length / limitPage); // tong cong x trang
    const record = allUser.slice(firstIndex, lastIndex); // render san pham

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const [dataUserEdit, setDataUserEdit] = useState({
        _id: '',
        username: '',
        isAdmin: false,
        status: true,
    });

    const Edit = (id) => {
        const userEdit = record.find((us) => us._id == id);
        setDataUserEdit({
            _id: userEdit._id,
            username: userEdit.username,
            isAdmin: userEdit.isAdmin,
            status: userEdit.status,
        });
        setShow(true);
    };

    const handleEdit = async (e) => {
        try {
            e.preventDefault();

            setLoading(true);
            const res = await axios.put(`http://localhost:4001/api/user/edit/${dataUserEdit._id}`, {
                isAdmin: dataUserEdit.isAdmin,
                status: dataUserEdit.status,
            });
            setLoading(false);

            if (res.data.status === 'SUCCESS') {
                swal({
                    icon: 'success',
                    title: 'Cập nhật thành công',
                });
                reload();
                setShow(false)
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
    // const handleRoleChange = (e, _id) => {
    //     const ne = record.map((user) => (user._id == _id ? { ...user, isAdmin: e.target.value } : user));
    //     reload();
    // };

    const handleChangeLimit = (e) => {
        setLimitPage(e.target.value);
        setNumPage(1);
    };

    return (
        <>
            <div>
                <div>
                    <h2>Tất cả tài khoản</h2>
                </div>

                <div className={cx('option', 'row sm-gutter')}>
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
                            <th className={cx('col l-2 m-4 c-6')}>Tên tài khoản</th>
                            <th className={cx('col l-3 m-4 c-6')}>Loại tài khoản</th>
                            <th className={cx('col l-2 m-4 c-6')}>Trạng thái</th>
                            <th className={cx('col l-3 m-4 c-6')}>Chỉnh sửa mới</th>
                            <th className={cx('col l-1 m-4 c-6')}>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {record?.map((user, index) => {
                            return (
                                <tr key={user._id} className={cx('trbody', 'row sm-gutter')}>
                                    <td className="col l-1 m-4 c-6">{`#${index+1}`}</td>

                                    <td className="col l-2 m-4 c-6">
                                        <h4 className={cx('item-name')}>{user.username}</h4>
                                    </td>

                                    <td className="col l-3 m-4 c-6">
                                        <span>{user.isAdmin == true ? 'Quản trị' : 'Người dùng'}</span>
                                    </td>
                                    <td className="col l-2 m-4 c-6">
                                        <div className={cx('item-name')}>{user.status == true ? 'Đang hoạt động' : 'Chặn'}</div>
                                    </td>

                                    <td className="col l-3 m-4 c-6">{moment(user.updatedAt).format('DD-MM-YYYY')}</td>

                                    <td className="col l-1 m-4 c-6">
                                        <span className={cx('action')}>
                                            <button className={cx('edit')} onClick={() => Edit(user._id)}>
                                                <FontAwesomeIcon className={cx('edit-icon')} icon={faPenToSquare} />
                                            </button>
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <Pagination numPage={[numPage, setNumPage]} totalPage={totalPage} limitPage={limitPage} />

                <Modal show={show} onClose={() => setShow(false)}>
                    <div className={cx('content')}>
                        <div className={cx('content-value')}>
                            <div className={cx('edit-value')}>
                                <span className={cx('value-title')}>Tên tài khoản: </span>
                                <span>{dataUserEdit.username}</span>
                            </div>
                            <div className={cx('edit-value')}>
                                <span className={cx('value-title')}>Loại tài khoản: </span>
                                <label className={cx('first-child')}>
                                    <input
                                        type="radio"
                                        value={dataUserEdit.isAdmin}
                                        checked={dataUserEdit.isAdmin == true}
                                        onChange={() => setDataUserEdit({ ...dataUserEdit, isAdmin: true })}
                                    />
                                    Quản trị
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value={!dataUserEdit.isAdmin}
                                        checked={dataUserEdit.isAdmin == false}
                                        onChange={() => setDataUserEdit({ ...dataUserEdit, isAdmin: false })}
                                    />
                                    Người dùng
                                </label>
                            </div>
                            <div className={cx('edit-value')}>
                                <span className={cx('value-title')}>Trạng thái: </span>
                                <label className={cx('first-child')}>
                                    <input
                                        type="radio"
                                        value={dataUserEdit.status}
                                        checked={dataUserEdit.status == true}
                                        onChange={() => setDataUserEdit({ ...dataUserEdit, status: true })}
                                    />
                                    Hoạt động
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value={!dataUserEdit.status}
                                        checked={dataUserEdit.status == false}
                                        onChange={() => setDataUserEdit({ ...dataUserEdit, status: false })}
                                    />
                                    Chặn
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
                                    setShow(false);
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

export default UserMNG;
