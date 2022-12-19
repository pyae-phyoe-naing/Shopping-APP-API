require('dotenv').config();
const path = require('path');
const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    fileUpload = require('express-fileupload');
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

const { validateToken, hasAnyRole, hasAnyPermit } = require('./utils/validator');

app.use('/permits', [validateToken(), hasAnyPermit(['create_category', 'edit_category']), permitRoute]);
app.use('/roles', [validateToken(), hasAnyRole(['Admin', 'Manager', 'Supervisor']), roleRoute]);
app.use('/users', userRoute);
app.use('/categories', catRoute);
app.use('/subcats', subcatRoute);
app.use('/childcats', childcatRoute);

const migrateData = async () => {
    let migrator = require('./migrations/migrator');
    // await migrator.migrate();
   // await migrator.backup();
   // await migrator.rolePermitMigrate();
    await migrator.addAdminRole();
}
 // migrateData();

app.listen(process.env.PORT, console.log(`Server is running at port ${process.env.PORT}`));

app.use((err, req, res, next) => {
    err.status = err.status || 500;
    res.status(err.status).json({
        con: false,
        msg: err.message
    })
})