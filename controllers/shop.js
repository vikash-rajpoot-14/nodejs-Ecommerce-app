const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(([product]) => {
      res.render('shop/product-detail', {
        product: product[0],
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
  // Product.findAll({ where: { id: prodId } }).then(product => {
  //   console.log(product);
  //   res.render('shop/product-detail', {
  //     product: product[0],
  //     pageTitle: product[0].title,
  //     path: '/products'
  //   });
  // }).catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll().then(products => {
    // console.log(products)
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err => {
    console.log(err)
  })
};

exports.getCart = (req, res, next) => {
  // console.log(req.user.cart)
  req.user.getCart().then(cart => {
    return cart.getProducts()
  }).then(products => {
    // console.log(products[0].CartItem)
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products
    });
  }).catch(err => {
    console.log(err)
  })
  // Cart.getCarts(cart => {
  //   Product.findAll(products => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         prod => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: cartProducts
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  // Product.findById(prodId, product => {
  //   Cart.addProduct(prodId, product.price);
  // });
  let fetchedCart ;
  let newQuantity = 1;
  req.user.getCart().then((cart) => {
    fetchedCart = cart;
    cart.getProducts({ where: { id: prodId } }).then(products => {
      let product ;
      if(products.length > 0) {
         product = products[0];
      }
      // console.log(product);
      if(product){
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
      }
      return  Product.findByPk(prodId)
      }).then(product =>{
          return  fetchedCart.addProduct(product , {through : {quantity :newQuantity}});
    }).then(()=>{
         res.redirect('/cart');
    })
  }).catch((err) => {
    console.log(err)
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  req.user.getCart().then(cart =>{
    cart.getProducts({where:{id : prodId}}).then(products =>{
      let product = products[0];
       return product.cartItem.destroy();
    }).then(() =>{
        res.redirect('/cart');
    }).catch(err =>{console.log(err)});
  })
  // Product.findById(prodId, product => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect('/cart');
  // });
};
  

exports.postOrders = (req, res, next) => {
  let fetchedCart;
  req.user.getCart().then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    }).then(products => {
      return req.user.createOrder().then(order => {
          return order.addProducts(products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      // console.log("vikash",result);
    return fetchedCart.setProducts(null)
  }).then(val=>{
    res.redirect('/orders')
  })
  .catch(err => {console.log(err);})
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include : ['products']}).then(orders =>{
    // console.log(orders);
    res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    orders : orders
  });
  })
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
