require('dotenv').config();
const express = require('express'),
    app = express(),
    mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`);

app.use(express.json());

const permitRoute = require('./route/permit');
const roleRoute = require('./route/role');
const userRoute = require('./route/user');

app.use('/permits', permitRoute);
app.use('/roles', roleRoute);
app.use('/users', userRoute);

const migrateData = async () => {
    let migrator = require('./migrations/migrator');
    // await migrator.migrate();
   // await migrator.backup();
   // await migrator.rolePermitMigrate();
    await migrator.addAdminRole();
}
 migrateData();

app.listen(process.env.PORT, console.log(`Server is running at port ${process.env.PORT}`));

app.use((err, req, res, next) => {
    err.status = err.status || 500;
    res.status(err.status).json({
        con: false,
        msg: err.message
    })
})