const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.findAll().then(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
        });
    }).catch(err =>
        console.log(err)
    );
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    // Product.findAll({
    //     where: {
    //         id: prodId
    //     }
    // }).then(result => {
    //     console.log('here boy: ', result);
    // }).catch(err => console.log(err));
    Product.findByPk(prodId).then(({dataValues}) => {
        res.render('shop/product-detail', {
            product: dataValues,
            pageTitle: dataValues.title,
            path: '/products',
        })
    }).catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
    Product.findAll().then(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.getCart = (req, res, next) => {
    req.user.getCart().then(cart => {
        cart.getProducts().then(products => {
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products: products
            });
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
}

exports.getOrders = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/orders', {
            pageTitle: 'Your orders',
            path: '/orders',
        });
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    })
};