import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const DataContext = createContext();

function Provider({ children }) {
    // function Provider({children}) {
    const [category, setCategory] = useState([]);
    const [product, setProduct] = useState([]);
    const [allUser, setAllUser] = useState([]);
    const [user, setUser] = useState(() => {
        // getting stored value
        const user = localStorage.getItem('user');
        const initialValue = JSON.parse(user);
        return initialValue || [];
    });
    const [cart, setCart] = useState([]);
    const [order, setOrder] = useState([]);
    const [allOrder, setAllOrder] = useState([]);
    const [allNews, setAllNews] = useState([]);
    const [loading, setLoading] = useState(false);

    const reload = () => {
        loading ? setLoading(false) : setLoading(true);
    };

    const decodedJWT = () => {
        try {
            const user = localStorage.getItem('user');
            const initialValue = JSON.parse(user);
            const token = initialValue.accessToken;
            const decoded = jwtDecode(token);
            const noww = new Date().getTime() / 1000;

            if (decoded.exp < noww) {
                localStorage.removeItem('user');
                reload();
            }
        } catch (err) {
            return false;
        }
        return true;
    };

    const getCategory = () => {
        axios
            .get(`https://phone-tv49.onrender.com/api/product/category/`)
            .then((res) => {
                setCategory(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getProduct = () => {
        axios
            .get(`https://phone-tv49.onrender.com/api/product/get-product`)
            .then((res) => {
                setProduct(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getUserForAdmin = () => {
        axios
            .get(`https://phone-tv49.onrender.com/api/user/allUser`)
            .then((res) => {
                setAllUser(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getCart = () => {
        axios
            .get(`https://phone-tv49.onrender.com/api/cart/get-cart/${user._id}`)
            .then((res) => {
                setCart(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getOrder = () => {
        axios
            .get(`https://phone-tv49.onrender.com/api/order/${user._id}`)
            .then((res) => {
                setOrder(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getAllOrder = () => {
        axios
            .get(`https://phone-tv49.onrender.com/api/order/all`)
            .then((res) => {
                setAllOrder(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getAllNews = () => {
        axios
            .get(`https://phone-tv49.onrender.com/api/news/allNews`)
            .then((res) => {
                setAllNews(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        decodedJWT();
        getCategory();
        getProduct();
        getUserForAdmin();
        getCart();
        getOrder();
        getAllOrder();
        getAllNews();
    }, [loading]);

    const value = {
        category: [category, setCategory],
        products: [product, setProduct],
        allUser: [allUser, setAllUser],
        user: [user, setUser],
        cart: [cart, setCart],
        order: [order, setOrder],
        allOrder: [allOrder, setAllOrder],
        allNews: [allNews, setAllNews],
        reload: reload,
        // addCart: addCart,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export default Provider;
