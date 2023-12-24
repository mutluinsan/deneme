const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "isim boş bırakılamaz"],
        maxlength: [100, "isim en fazla 100 karakter olabilir"],
    },
    author: {
        type: String,
        required: [true, "yazar boş bırakılamaz"],
        maxlength: [100, "yazar adı en fazla 100 karakter olabilir"],
    },
    publishYear: {
        type: Number,
        min: [1000, "Yayın yılı en az 1000 olabilir"],
        max: [2021, "Yayın yılı en fazla 2021 olabilir"],
    },
    publisher: {
        type: String,
        required: [true, "yayınevi boş bırakılamaz"],
        maxlength: [100, "yayınevi en fazla 100 karakter olabilir"],
    },
    stock: {
        type: Number,
        required: [true, "stok miktarı boş bırakılamaz"],
        min: [0, "stok miktarı en az 0 olabilir"],
    },
    price: {
        type: Number,
        required: [true, "fiyat boş bırakılamaz"],
        min: [0, "fiyat en az 0 TL olabilir"],
    },
    barcode: {
        type: String,
        required: [true, "barkod boş bırakılamaz"],
        unique: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);