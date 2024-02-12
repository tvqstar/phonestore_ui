import classNames from 'classnames/bind';
import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons';

import routesConfig from '../../config/routes';
import styles from './Login.module.scss';
import axios from 'axios';
import swal from 'sweetalert';

const cx = classNames.bind(styles);

function Login() {
    // const [email, setEmail] = useState('');
    // const [pwd, setPwd] = useState('');

    // const history = useHistory();
    const navigate = useNavigate();

    const [pwdShow, setPwdShow] = useState(false);
    const [message, setMessage] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const onSubmit = (data) => {
        delay(2000);
        axios
            .post('https://phone-tv49.onrender.com/api/user/login', {
                username: data.username,
                password: data.password,
            })
            .then((res) => {
                if (res.data.msg === 'SUCCESS') {
                    if (!res.data.status) {
                        swal({
                            icon: 'error',
                            title: 'Tài khoản ngưng hoạt động',
                        });
                        return;
                    }
                    localStorage.setItem('user', JSON.stringify(res.data));
                    if (res.data.isAdmin) {
                        navigate('/');
                        window.location.reload(true);
                    } else {
                        navigate('/');
                        window.location.reload(true);
                    }
                    return;
                } else {
                    setMessage(res.data);
                    return;
                }
            });
    };

    const togglePassword = () => {
        setPwdShow(pwdShow ? false : true);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <h2 className={cx('title')}>Đăng nhập</h2>
                {!!message && <h3 style={{ color: 'red' }}>{message}</h3>}
                <form className={cx('input')} onSubmit={handleSubmit(onSubmit)}>
                    <div className={cx('input-item')}>
                        <FontAwesomeIcon icon={faEnvelope} />
                        <input
                            type="text"
                            placeholder="Nhập tên tài khoản..."
                            {...register('username', {
                                required: 'Trường này không được để trống',
                                // pattern: {
                                //     value: /^[A-Z0-9._%+-]+@[[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                //     message: 'Vui lòng nhập đúng email',
                                // },
                            })}
                        />
                    </div>

                    {errors.username?.message && <span className={cx('show-err')}>{errors.username?.message}</span>}

                    <div className={cx('input-item')}>
                        <FontAwesomeIcon icon={faLock} />
                        <input
                            type={pwdShow ? 'text' : 'password'}
                            placeholder="Nhập mật khẩu..."
                            {...register('password', {
                                required: 'Trường này không được để trống',
                                // minLength: {
                                //     value: 6,
                                //     message: 'Tối thiểu 6 kí tự',
                                // },
                            })}
                        />

                        <span style={{ userSelect: 'none' }} onClick={togglePassword}>
                            {pwdShow && <FontAwesomeIcon className={cx('showPwdIcon')} icon={faEye} />}
                            {!pwdShow && <FontAwesomeIcon className={cx('showPwdIcon')} icon={faEyeSlash} />}
                        </span>
                    </div>

                    {errors.password?.message && <span className={cx('show-err')}>{errors.password?.message}</span>}

                    <div className={cx('button')}>
                        <button type="submit" className={cx('button-login')} to={routesConfig.home}>
                            Đăng nhập
                        </button>
                        <Link className={cx('button-return')} to={routesConfig.home}>
                            Trở về trang chủ
                        </Link>
                    </div>
                </form>

                <div className={cx('link')}>
                    <span>Bạn chưa có tài khoản?</span>
                    <Link className={cx('link-button')} to={routesConfig.register}>
                        Đăng ký ngay!
                    </Link>
                </div>

                {/* <Link
                    onClick={() => {
                        alert('Chức năng chưa hỗ trợ');
                    }}
                >
                    Quên mật khẩu
                </Link> */}
            </div>
        </div>
    );
}

export default Login;
