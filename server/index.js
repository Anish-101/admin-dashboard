const express = require('express');
const router = require('./routes/admin');
const mongoose = require('mongoose');
const app = express();

const PORT = process.env.PORT || 3000

app.use(express.json());
app.use('/admin', router);

main()
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/admin-courses')
    console.log('db connected');
}
app.listen(PORT, () => {
    console.log('server is ready');
})