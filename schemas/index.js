const mongoose = require('mongoose');

const connect = () => {
    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }

    // url 바꿀것

    mongoose.connect(process.env.MONGODB_URI, {
        dbName: 'nodejs',
        useNewUrlParser: true,
    }).then(() => {
        console.log('mongodb connection');
    }).catch((err) => {
        console.error('mongodb connection error', err);
    });
}

mongoose.connection.on('error', (err) => {
    console.error('mongodb connection error', err);
});
mongoose.connection.on('disconnected', () => {
    console.error('mongodb connection disconnected, trying to reconnect...');
    connect();
});

module.exports = connect;