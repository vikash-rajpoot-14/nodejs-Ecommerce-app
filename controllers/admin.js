const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  
  req.user.createProduct({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
  })
    // Product.create({
    //   title: title,
    //   price: price,
    //   imageUrl: imageUrl,
    //   description: description,
    //   UserId: req.user.id
    // })
    .then(() => {
      console.log('product created');
      res.redirect('/admin/products')
    }).catch((err) => {
      console.log(err)
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  console.log(req.user)
  req.user.getProducts({ where: { id: prodId } }).then(product => {
    // console.log(product)
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product[0]
    });
  }).catch(err => {
    console.log(err)
  })
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  // Product.update({
  //   title: updatedTitle,
  //   price: updatedPrice,
  //   imageUrl: updatedImageUrl,
  //   description: updatedDesc
  // }, {
  //   where: { id: prodId }
  // }).then(product => {
  //   console.log(product)
  // }).catch(err => {
  //   console.log(err)
  // })

  Product.findByPk(prodId).then(product => {
    console.log(product)
    product.title = updatedTitle,
      product.price = updatedPrice,
      product.imageUrl = updatedImageUrl,
      product.description = updatedDesc
    return product.save()
  }).then(result => {
    // console.log(result);
    res.redirect('/admin/products');
  }).catch(err => {
    console.log(err)
  })
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err => {
    console.log(err)
  })
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId)
  req.user.removeProduct(prodId).then((product) => {
    console.log(product)
  }).then(() => {
    // console.log(result);
    res.redirect('/admin/products');
  }).catch((err) => {
    console.log(err)
  });

};
