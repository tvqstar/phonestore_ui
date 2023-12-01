import classNames from 'classnames/bind';
import styles from './HomeLayout.module.scss';

import SideBar from '../SideBar';
import Slider from '../Slider';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Navigate } from 'react-router-dom';

function DefaultLayout({ children }) {
    const cx = classNames.bind(styles);
    const admin = true;
    // const admin = localStorage.getItem('admin');
    return (
        <>
            <div className={cx('wrapper')}>
                <Header />
                <div className={cx('grid wide')}>
                    <div className={cx('sidebar-slider', 'row sm-gutter')}>
                        <div className={cx('side-bar', 'col l-3')}>
                            <SideBar />
                        </div>
                        <div className="col l-9">
                            <Slider />
                        </div>
                    </div>
                    <div className="row sm-gutter">
                        <div className="col l-12 m-12 c-12 ">
                            <div className={cx('content')}>{children}</div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default DefaultLayout;
