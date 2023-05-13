const carRoutes = require('./car');
const authRoute = require('./auth');
const productRoute = require('./product');

const constructorMethod = (app) => {
    app.use('/cars', carRoutes);
    app.use('/', authRoute);
    app.use('/products',productRoute)
    // app.use('/additem', addProductRoute);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;