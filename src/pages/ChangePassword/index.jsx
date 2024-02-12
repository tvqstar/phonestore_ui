import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import swal from 'sweetalert';

import { useNavigate } from 'react-router-dom';

import routesConfig from '../../config/routes';
import { DataContext } from '../../Provider';

import classNames from 'classnames/bind';
import styles from './ChangePassword.module.scss';

function ChangePassword() {
    const cx = classNames.bind(styles);

    const value = useContext(DataContext);
    const [user] = value.user;
    const reload = value.reload;

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        // watch,
        getValues,
    } = useForm();

    const [message, setMessage] = useState('');

    const [newPwdShow, setNewPwdShow] = useState(false);
    const [pwdShow, setPwdShow] = useState(false);
    const [rePwdShow, setRePwdShow] = useState(false);

    const toggleNewPassword = () => {
        setNewPwdShow(newPwdShow ? false : true);
    };

    const togglePassword = () => {
        setPwdShow(pwdShow ? false : true);
    };

    const toggleRePassword = () => {
        setRePwdShow(rePwdShow ? false : true);
    };

    const onSubmit = (data) => {
        setMessage('');
        const oldPw = data.oldPw;
        const newPw = data.newPw;
        axios
            .post('https://phone-tv49.onrender.com/api/user/changePW', {
                userId: user._id,
                oldPw,
                newPw,
            })
            .then((res) => {
                if (res.data.msg === 'SUCCESS') {
                    swal({
                        title: 'Thành công!',
                        text: 'Về trang chủ ngay',
                        icon: 'success',
                        buttons: true,
                        // dangerMode: true,
                    }).then((ok) => {
                        if (ok) {
                            localStorage.removeItem('user');
                            reload();
                            navigate('/');
                        }
                    });
                    return;
                } else if (res.data.status === 'ERR') {
                    swal({
                        icon: 'error',
                        title: `${res.data.msg}`,
                    });
                    return;
                } else {
                    swal({
                        icon: 'error',
                        title: 'CÓ LỖI',
                    });
                    return;
                }
            });
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <h2 className={cx('title')}>Thay đổi mật khẩu</h2>

                {/* Đăng ký thành công */}
                {!!message && <h3 style={{ color: 'red' }}>{message}</h3>}

                <form className={cx('form-input')} onSubmit={handleSubmit(onSubmit)}>
                    <div className={cx('input-item')}>
                        <FontAwesomeIcon icon={faLock} />
                        <input
                            type={newPwdShow ? 'text' : 'password'}
                            placeholder="Nhập mật khẩu cũ..."
                            spellCheck={false}
                            {...register('oldPw', {
                                required: 'Trường này không được để trống',
                                // pattern: {
                                //     value: /^[A-Z0-9._%+-]+@[[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                //     message: 'Vui lòng nhập đúng email',
                                // },
                            })}
                        />
                        <span onClick={toggleNewPassword} style={{ userSelect: 'none' }}>
                            {newPwdShow && <FontAwesomeIcon className={cx('showPwdIcon')} icon={faEye} />}

                            {!newPwdShow && <FontAwesomeIcon className={cx('showPwdIcon')} icon={faEyeSlash} />}
                        </span>
                    </div>

                    {errors.oldPw?.message && <span className={cx('show-err')}>{errors.oldPw?.message}</span>}

                    <div className={cx('input-item')}>
                        <FontAwesomeIcon icon={faLock} />
                        <input
                            type={pwdShow ? 'text' : 'password'}
                            placeholder="Nhập mật khẩu mới..."
                            spellCheck={false}
                            {...register('newPw', {
                                required: 'Trường này không được để trống',
                                // minLength: {
                                //     value: 6,
                                //     message: 'Tối thiểu 6 kí tự',
                                // },
                                pattern: {
                                    value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[A-Z][a-zA-Z0-9!@#$%^&*]{7,20}$/,
                                    message: 'Mật khẩu gồm chữ cái đầu viết hoa, có chữ cái thường, số và ký tự đặc biệt, từ 7 - 20 ký tự',
                                },
                            })}
                        />

                        <span onClick={togglePassword} style={{ userSelect: 'none' }}>
                            {pwdShow && <FontAwesomeIcon className={cx('showPwdIcon')} icon={faEye} />}

                            {!pwdShow && <FontAwesomeIcon className={cx('showPwdIcon')} icon={faEyeSlash} />}
                        </span>
                    </div>

                    {errors.newPw?.message && <span className={cx('show-err')}>{errors.newPw?.message}</span>}

                    <div className={cx('input-item')}>
                        <FontAwesomeIcon icon={faLock} />
                        <input
                            type={rePwdShow ? 'text' : 'password'}
                            placeholder="Nhập lại mật khẩu..."
                            spellCheck={false}
                            {...register('rePassword', {
                                required: 'Trường này không được để trống',
                                validate: (value) => value === getValues('newPw') || 'Xác nhận không đúng!',
                            })}
                        />

                        <span onClick={toggleRePassword} style={{ userSelect: 'none' }}>
                            {rePwdShow && <FontAwesomeIcon className={cx('showPwdIcon')} icon={faEye} />}

                            {!rePwdShow && <FontAwesomeIcon className={cx('showPwdIcon')} icon={faEyeSlash} />}
                        </span>
                    </div>

                    {errors.rePassword?.message && <span className={cx('show-err')}>{errors.rePassword?.message}</span>}

                    <div className={cx('button')}>
                        <button type="submit" className={cx('button-register')}>
                            Xác nhận
                        </button>
                        <Link className={cx('button-return')} to={routesConfig.home}>
                            Trở về trang chủ
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
