import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import classNames from 'classnames/bind';
import styles from './NewsMNG.module.scss';
import adminRoutes from '../../../config/adminRoutes';
import { DataContext } from '../../../Provider';

function AddNews() {
    const cx = classNames.bind(styles);
    const navigate = useNavigate();

    const value = useContext(DataContext);
    // const [allNews] = value.allNews;
    const reload = value.reload;

    const [loadingAdd, setLoadingAdd] = useState(false);
    const [err, setErr] = useState('');
    const [news, setNews] = useState({
        title: '',
        content: '',
        image: null,
    });

    const changeNews = (value) => {
        setNews({ ...news, content: value });
    };

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleAddNews = async (e) => {
        try {
            e.preventDefault();
            setErr('');
            if (news.title.trim() === '' || news.content.trim() === '' || !news.image) {
                setErr('Điền đủ thông tin!');
                return;
            }

            let formData = new FormData();

            formData.append('image', news.image);
            formData.append('title', news.title);
            formData.append('content', news.content);

            setLoadingAdd(true);
            await delay(2000);

            const res = await axios.post(`https://phone-tv49.onrender.com/api/news/add`, formData);
            setLoadingAdd(false);

            if (res.data.status === 'SUCCESS') {
                swal({
                    icon: 'success',
                    title: 'Thêm thành công',
                });

                setNews({
                    title: '',
                    content: '',
                    image: null,
                });
                setErr('');
                navigate(adminRoutes.news);
                reload();
                return;
            }

            return;
        } catch (error) {
            console.log(error);
            return;
        }
    };

    const modules = {
        toolbar: [
            [{ header: [false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ color: [] }, { background: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'video', 'image'],
            ['clean'],
        ],
    };

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'color',
        'background',
        'list',
        'bullet',
        'link',
        'video',
        'image',
    ];

    return (
        <>
            <div>
                <div className={cx('btnCancel')}>
                    <Link to={adminRoutes.news} className={cx('btn', 'cancel-addnews')}>
                        X
                    </Link>
                </div>
                <div className={cx('wrap-addNews')}>
                    <div className={cx('editor-content')}>
                        <div>
                            <h3>Tiêu đề</h3>
                            <input
                                className={cx('input-title')}
                                type="text"
                                value={news.title}
                                onChange={(e) => setNews({ ...news, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <h3>Ảnh đại diện</h3>
                            <input
                                className={cx('input-img')}
                                type="file"
                                name="filename"
                                // value={data.description}
                                onChange={(e) => setNews({ ...news, image: e.target.files[0] })}
                            />
                        </div>
                        <div>
                            <h3>Nội dung</h3>
                            <ReactQuill
                                className={cx('editor')}
                                theme="snow"
                                value={news.content}
                                onChange={changeNews}
                                placeholder={'Write something awesome...'}
                                modules={modules}
                                formats={formats}
                            />
                        </div>
                    </div>

                    <div className={cx('preview')}>
                        <div className={cx('preview-title')}>
                            <h3>Xem trước</h3>
                        </div>
                        <h3>{news.title}</h3>
                        <div className={cx('preview-content')} dangerouslySetInnerHTML={{ __html: news.content }} />
                    </div>
                </div>

                {err && <p style={{ color: 'red', margin: '8px' }}>{err}</p>}

                <button className={cx('btn', 'btn-save')} style={{ marginLeft: '10px' }} onClick={(e) => handleAddNews(e)}>
                    {!loadingAdd && <p>Thêm</p>}
                    {!!loadingAdd && <FontAwesomeIcon className={cx('loading-icon')} icon={faSpinner} />}
                </button>
            </div>
        </>
    );
}

export default AddNews;
