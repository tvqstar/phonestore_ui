import { useEffect, useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import Images from '../../assets/Images/Images';

import classNames from 'classnames/bind';
import styles from './Slider.module.scss';

const cx = classNames.bind(styles);

const sliderImage = [
    {
        img: Images.slider1,
    },
    {
        img: Images.slider2,
    },
    {
        img: Images.slider3,
    },
];

// const sliderImage = [
//     {
//         img: 'https://uploads-ssl.webflow.com/6073fad993ae97919f0b0772/609fa7b53c435fb27393587d_dd5787fa0c9306323b7176ce91a4d31ff6041c4a2.jpg',
//     },
//     {
//         img: 'https://uploads-ssl.webflow.com/6073fad993ae97919f0b0772/609fa860f3b25f8e37cb0f30_ssa.jpg',
//     },
//     {
//         img: 'https://uploads-ssl.webflow.com/6073fad993ae97919f0b0772/609fa8abeb91232c4a5e964f_hw.jpg',
//     },
// ];

function Slider() {
    const [slideCurr, setSlideCurr] = useState(0);
    const length = sliderImage.length;

    // const prevSlide = () => {
    //     setSlideCurr(slideCurr === 0 ? length - 1 : slideCurr - 1);
    // };

    // const nextSlide = () => {
    //     setSlideCurr(slideCurr === length - 1 ? 0 : slideCurr + 1);
    // };

    useEffect(() => {
        const runSlider = setTimeout(() => {
            setSlideCurr(slideCurr === length - 1 ? 0 : slideCurr + 1);
        }, 7000);

        return () => clearTimeout(runSlider);
    }, [slideCurr]);

    return (
        <div className={cx('wrapper')}>
            {/* <FontAwesomeIcon className={cx('next')} icon={faArrowCircleLeft} onClick={prevSlide} />
            <FontAwesomeIcon className={cx('prev')} icon={faArrowCircleRight} onClick={nextSlide} /> */}
            {sliderImage.map((image, index) => (
                <div key={index} className={index === slideCurr ? cx('slideActive') : cx('slide')}>
                    {index === slideCurr && <img src={image.img} alt="slider" />}
                </div>
            ))}
        </div>
    );
}

export default Slider;
