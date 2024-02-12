const routes = {
    home: '/',
    cart: '/cart',
    checkout: '/checkout',
    news: '/news',
    order: '/order',
    login: '/login',
    product: '/product',
    register: '/register',
    productDetail: '/:slug',
    newsDetail: 'news/:id',
    prodByCate: '/product/:nameCate',
    changePassword: '/change-password',
    notfound: '/*',
};

export default routes;
