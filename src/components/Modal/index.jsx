import classNames from 'classnames/bind';
import styles from './Modal.module.scss';

const cx = classNames.bind(styles);

function Modal(props) {
    if (!props.show) {
        return null;
    }
    return (
        <div className={cx('modal')} onClick={props.onClose}>
            <div className={cx('modal-content', `${props.show ? 'show' : ''}`)} onClick={(e) => e.stopPropagation()}>
                {props.children}
            </div>
        </div>
    );
}

export default Modal;
