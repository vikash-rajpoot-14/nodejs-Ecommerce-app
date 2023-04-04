const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database')
const errorController = require('./controllers/error');
// const db = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/CartItem')
const OrderItem = require('./models/order-item');
const Order = require('./models/order');

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product , { through : OrderItem });
Product.belongsToMany(Order, { through : OrderItem });

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1).then(user => {
        // console.log("user", user)
        req.user = user;
        next();
    }).catch(err => console.log(err));
})
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
// sequelize.sync({ force: true })
sequelize.sync()
    .then(result => {
        User.findByPk(1).then(user => {
            if (!user) {
                return User.create({ name: 'John', email: 'john@example.com' });
            }
            return user  // bcoz then return promise but in other case Promise.resolve(user) onj to promise
        }).then(async (user) => {
           const cart =  await user.getCart()
            // console.log(cart);
            if(!cart){
               return user.createCart()
            }
            return cart;
        }).then(() => {
            app.listen(3000)
        })
    }).catch(err => {
        console.log(err)
    });

