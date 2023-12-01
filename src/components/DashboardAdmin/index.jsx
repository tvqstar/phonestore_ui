import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import classNames from 'classnames/bind';
import styles from './DashboardAdmin.module.scss';

function DashboardHeader(props) {
    const cx = classNames.bind(styles);
    return (
        <div className={cx('col l-3 m-4 c-6')}>
            <div className={cx('wrapper')} style={{ backgroundColor: `${props.color}` }}>
                <div className={cx('content')}>
                    <div>
                        <h2>{props.quantity}</h2>
                        <h3>{props.title}</h3>
                    </div>

                    <span className={cx('icon')}>
                        {props.icon}
                    </span>
                </div>

                <Link className={cx('link')} to={props.link}>
                    Xem thêm
                    <FontAwesomeIcon icon={faArrowRight} />
                </Link>
            </div>
        </div>
    );
}

export default DashboardHeader;
