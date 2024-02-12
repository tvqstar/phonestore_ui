import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import swal from 'sweetalert';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import classNames from 'classnames/bind';
import styles from './NewsMNG.module.scss';
import { DataContext } from '../../../Provider';

import adminRoutes from '../../../config/adminRoutes';

function EditNews() {
    const navigate = useNavigate();
    const { id } = useParams();
    const cx = classNames.bind(styles);

    const value = useContext(DataContext);
    const [allNews] = value.allNews;
    const reload = value.reload;

    const newsEdit = allNews.find((news) => news._id === id);

    const ne = { ...newsEdit };

    const [news, setNews] = useState({
        title: ne.title,
        content: ne.content,
        image: ne.image,
    });

    const [loadingAdd, setLoadingAdd] = useState(false);
    const [err, setErr] = useState('');

    const changeNews = (value) => {
        setNews({ ...news, content: value });
    };

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleEditNews = async (e) => {
        try {
            e.preventDefault();

            if (news.title.trim() === '' || news.content.trim() === '') {
                setErr('Điền đủ thông tin!');
                return;
            }

            let formData = new FormData();

            formData.append('image', news?.image);
            formData.append('title', news.title);
            formData.append('content', news.content);

            setLoadingAdd(true);
            await delay(2000);

            const res = await axios.put(`https://phone-tv49.onrender.com/api/news/edit/${id}`, formData);
            setLoadingAdd(false);

            if (res.data.status === 'SUCCESS') {
                swal({
                    icon: 'success',
                    title: 'Sửa thành công',
                });

                setNews({
                    title: '',
                    content: '',
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
                                onChange={(e) => setNews({ ...news, image: e.target?.files[0] })}
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

                <button className={cx('btn', 'btn-save')} style={{ marginLeft: '10px' }} onClick={(e) => handleEditNews(e)}>
                    {!loadingAdd && <p>Sửa</p>}
                    {!!loadingAdd && <FontAwesomeIcon className={cx('loading-icon')} icon={faSpinner} />}
                </button>
            </div>
        </>
    );
}

export default EditNews;
