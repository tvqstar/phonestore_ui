import { useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useTypewriter } from 'react-simple-typewriter';
import axios from 'axios';
import { Link } from 'react-router-dom';

import useDebounce from '../../Layouts/Debounce';

import styles from './Search.module.scss';

const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(true);
    const [loading, setLoading] = useState(false);

    const debounced = useDebounce(searchValue, 500);
    const inputRef = useRef();

    const [text] = useTypewriter({
        words: ['Bạn cần tìm gì...', 'Nhập tên sản phẩm...'],
        loop: true,
        cursor: true,
        cursorStyle: '_',
        cursorBlinking: true,
        delaySpeed: 1500,
        deleteSpeed: 120,
    });

    const handleClear = () => {
        setSearchValue('');
        setSearchResult([]);
        inputRef.current.focus();
    };

    useEffect(() => {
        if (!debounced.trim()) {
            setSearchResult([]);
            return;
        }

        const fetchApi = async () => {
            setLoading(true);

            const result = await axios.get(`https://phone-tv49.onrender.com/api/product/search?name=${debounced}`);
            // console.log(result.data.products);

            setSearchResult(result.data.products);
            setLoading(false);
        };

        fetchApi();
    }, [debounced]);

    const handleHideResult = () => {
        setShowResult(false);
    };

    const handleChange = (e) => {
        const searchValue = e.target.value;
        setSearchValue(searchValue.startsWith(' ') ? searchValue.trim() : searchValue);
    };

    return (
        // Using a wrapper <div> or <span> tag around the reference element solves
        // this by creating a new parentNode context.
        <div>
            <HeadlessTippy
                interactive
                visible={showResult && searchResult.length > 0}
                render={(attrs) => (
                    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                        <div className={cx('wrapper')}>
                            <h3 style={{ marginLeft: '5px' }}>Sản phẩm tìm thấy</h3>
                            {searchResult.slice(0, 5).map((result) => (
                                <Link key={result._id} className={cx('prod-items')} to={`/${result.slug}`}>
                                    <img
                                        className={cx('avatar')}
                                        src={`https://phone-tv49.onrender.com/api/product/image/${result.image}`}
                                        alt={result.name}
                                    />
                                    <div className={cx('info')}>
                                        <p className={cx('name')}>
                                            <span>{result.name}</span>
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
                onClickOutside={handleHideResult}
            >
                <div className={cx('search')}>
                    <input
                        ref={inputRef}
                        value={searchValue}
                        placeholder={text}
                        spellCheck={false}
                        onChange={handleChange}
                        onFocus={() => setShowResult(true)}
                    />

                    {!!searchValue && !loading && (
                        <button className={cx('search-clear-btn')} onClick={handleClear}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    )}
                    {!!loading && <FontAwesomeIcon className={cx('loading-icon')} icon={faSpinner} />}

                    {/* <button className={cx('search-btn')}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button> */}
                </div>
            </HeadlessTippy>
        </div>
    );
}

export default Search;
