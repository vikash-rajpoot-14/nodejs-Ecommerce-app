const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database')
const errorController = require('./controllers/error');
const db = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const Product = require('./models/product');
const User = require('./models/user')

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

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
sequelize.sync().then(result => {
    User.findByPk(1).then(user => {
        if (!user) {
            return User.create({ name: 'John', email: 'john@example.com' });
        }
        return user  // bcoz then return promise but in other case Promise.resolve(user) onj to promise
    }).then(user => {
        // console.log(user);
        app.listen(3000);

    })

}).catch(err => {
    console.log(err)
});

