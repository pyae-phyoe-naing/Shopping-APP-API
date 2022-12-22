require('dotenv').config();
const path = require('path');
const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    fileUpload = require('express-fileupload'),
    server = require('http').createServer(app),
    io = require('socket.io')(server);


mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`);

app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const permitRoute = require('./route/permit');
const roleRoute = require('./route/role');
const userRoute = require('./route/user');
const catRoute = require('./route/category');
const subcatRoute = require('./route/subcat');
const childcatRoute = require('./route/childcat');
const tagRoute = require('./route/tag');
const deliveryRoute = require('./route/delivery');
const warrantyRoute = require('./route/warranty');
const productRoute = require('./route/product');
const orderRoute = require('./route/order');

const {
    validateToken,
    hasAnyRole,
    hasAnyPermit
} = require('./utils/validator');

app.use('/permits', [validateToken(), hasAnyPermit(['create_category', 'edit_category']), permitRoute]);
app.use('/roles', [validateToken(), hasAnyRole(['Admin', 'Manager', 'Supervisor']), roleRoute]);
app.use('/users', userRoute);
app.use('/categories', catRoute);
app.use('/subcats', subcatRoute);
app.use('/childcats', childcatRoute);
app.use('/tags', tagRoute);
app.use('/delivery', deliveryRoute);
app.use('/warranty', warrantyRoute);
app.use('/products', productRoute);
app.use('/orders', orderRoute);

const {
    decodeToken
} = require('./utils/token');
const Redis = require('./utils/redis');


io.of('/chat').use(async (socket, next) => {
    let token = socket.handshake.query.token;
    // Check Login or not
    if (!token) {
        next(new Error('Please first login!'));
        return;
    }
    // Decode User
    let decode = decodeToken(token);
    if (!decode) {
        next(new Error('Tokenization Error!'));
        return;
    }
    // Check Login User or not
    let user = await Redis.get(decode._id);
    if (!user) {
        next(new Error('Not Login User!'));
        return;
    }
    // Go Next Step
    socket.userData = user;
    next();
}).on('connection', socket => {
    require('./utils/chat').initilaize(io, socket);
});

// io.on('connection', socket => {
//     socket.on('test', data => {
//         console.log(data);
//         socket.emit("success", { name: 'Admin', message: 'Welcome' });
//     })
// });

const migrateData = async () => {
    let migrator = require('./migrations/migrator');
    // await migrator.migrate();
    // await migrator.backup();
    // await migrator.rolePermitMigrate();
    await migrator.addAdminRole();
}
// migrateData();

server.listen(process.env.PORT, console.log(`Server is running at port ${process.env.PORT}`));

app.use((err, req, res, next) => {
    err.status = err.status || 500;
    res.status(err.status).json({
        con: false,
        msg: err.message
    })
})