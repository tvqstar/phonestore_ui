import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
// import { useState } from 'react';

import classNames from 'classnames/bind';
import styles from './Pagination.module.scss';

function Pagination(props) {
    const cx = classNames.bind(styles);

    const [numPage, setNumPage] = props.numPage;
    const numberpage = [...Array(props.totalPage + 1).keys()].slice(1);

    const handlePrePage = () => {
        if (numPage !== 1) {
            setNumPage(numPage - 1);
        }
    };

    const handleNextPage = () => {
        if (numPage !== props.totalPage) {
            setNumPage(numPage + 1);
        }
    };

    

    return (
        <div className={cx('pagination')}>
            <FontAwesomeIcon
                onClick={handlePrePage}
                className={cx('pagination-icon', `${numPage === 1 ? 'disable' : ''}`)}
                icon={faAngleLeft}
            />
            {numberpage.map((num, index) => (
                <button
                    className={cx('pagination-button', `${numPage === num ? 'active' : ''}`)}
                    key={index}
                    onClick={() => {
                        setNumPage(num);
                    }}
                >
                    {num}
                </button>
            ))}
            <FontAwesomeIcon
                onClick={handleNextPage}
                className={cx('pagination-icon', `${numPage === props.totalPage ? 'disable' : ''}`)}
                icon={faAngleRight}
            />
        </div>
    );
}

export default Pagination;
