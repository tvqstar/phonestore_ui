import routesConfig from '../config/routes';
import adminRoutes from '../config/adminRoutes';
import HomeLayout from '../Layouts/HomeLayout';
import AdminLayout from '../Layouts/AdminLayout';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AllProduct from '../pages/AllProduct';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Order from '../pages/Order';
import News from '../pages/News';
import NewsDetail from '../pages/News/NewsDetail';
import ProdByCate from '../pages/AllProduct/ProdByCate';
// import User from '~/pages/User';
// import Order from '~/pages/Order';
// import NotFound from '~/pages/NotFound';
import AdminHome from '../pages/Admin/AdminHome';
import ProdMNG from '../pages/Admin/ProdMNG';
import UserMNG from '../pages/Admin/UserMNG';
import OrderMNG from '../pages/Admin/OrderMNG';
import CategoryMNG from '../pages/Admin/CategoryMNG';
import NewsMNG from '../pages/Admin/NewsMNG';
import AddNews from '../pages/Admin/NewsMNG/addNews';
import EditNews from '../pages/Admin/NewsMNG/editNews';

import NotFound from '../pages/NotFound';

const publicRoutes = [
    { path: routesConfig.home, component: Home, layout: HomeLayout },
    { path: routesConfig.login, component: Login, layout: null },
    { path: routesConfig.register, component: Register, layout: null },
    { path: routesConfig.cart, component: Cart },
    { path: routesConfig.order, component: Order },
    { path: routesConfig.product, component: AllProduct },
    { path: routesConfig.productDetail, component: ProductDetail },
    { path: routesConfig.prodByCate, component: ProdByCate },
    { path: routesConfig.news, component: News },
    { path: routesConfig.newsDetail, component: NewsDetail },
    { path: routesConfig.notfound, component: NotFound, layout: null },
];

const privateRoutes = [
    { path: adminRoutes.home, component: AdminHome, layout: AdminLayout },
    { path: routesConfig.login, component: Login, layout: null },
    { path: adminRoutes.product, component: ProdMNG, layout: AdminLayout },
    { path: adminRoutes.category, component: CategoryMNG, layout: AdminLayout },
    { path: adminRoutes.order, component: OrderMNG, layout: AdminLayout },
    { path: adminRoutes.user, component: UserMNG, layout: AdminLayout },
    { path: adminRoutes.news, component: NewsMNG, layout: AdminLayout },
    { path: adminRoutes.addNews, component: AddNews, layout: null },
    { path: adminRoutes.editNews, component: EditNews, layout: null },
    { path: adminRoutes.notfound, component: NotFound, layout: null },
];

export { publicRoutes, privateRoutes };
