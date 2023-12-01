import classNames from 'classnames/bind';
import { NavLink, useParams } from 'react-router-dom';
import { useContext } from 'react';

import styles from './Category.module.scss';

import { DataContext } from '../../Provider';

function Category() {
    const cx = classNames.bind(styles);

    const value = useContext(DataContext);
    const [category] = value.category;
    const { nameCate } = useParams();


    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>Danh mục sản phẩm</h2>

            <ul className={cx('cate-list')}>
                {category.map((cate) => (
                    <li key={cate._id}>
                        <NavLink
                            className={(nav) => cx('list-item', { active: nav?.isActive })}
                            to={`/product/${cate?.name}`}
                            isActive={() => nameCate === cate?.name}
                        >
                            {cate?.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Category;
