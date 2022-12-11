require('dotenv').config();
const express = require('express'),
    app = express(),
    mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`);

app.use(express.json());

const permitRoute = require('./route/permit');
const roleRoute = require('./route/role');

app.use('/permits', permitRoute);
app.use('/roles', roleRoute);

const migrateData = async () => {
    let migrator = require('./migrations/migrator');
    migrator.migrate();
}
migrateData();

app.listen(process.env.PORT, console.log(`Server is running at port ${process.env.PORT}`));

app.use((err, req, res, next) => {
    err.status = err.status || 500;
    res.status(err.status).json({con:false,msg:err.message})
})