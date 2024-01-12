const Book = require('../models/Book.js')

            //  PDF ÖDEV YAPIMI

const getAllBooks = async (req, res) => {
    try {
        const { author, title, sort, fields, numericFilters } = req.query;
        const queryObj = {}; 

        if (author) {
            queryObj.author = author;
        }

        if (title) {
            const modifiedTitle = title.toLocaleLowerCase()
                .replace(/i/gi, '[iİ]')
                .replace(/ı/gi, '[ıI]');

            queryObj.title = { $regex: modifiedTitle, $options: 'i' };
        }

        if (numericFilters) {
            const operatorMap = {
                '>': '$gt',
                '>=': '$gte',
                '=': '$eq',
                '<': '$lt',
                '<=': '$lte',
            };

            const regEx = /\b(<|>|>=|=|<|<=)\b/g;
            let filters = numericFilters.replace(regEx, match => `-${operatorMap[match]}-`);

            const options = ['price', 'stock'];

            filters.split(',').forEach(item => {
                const [field, operator, value] = item.split('-');
                
                if (options.includes(field)) {
                    queryObj[field] = { [operator]: Number(value) };
                }
            });
        }

        let result = Book.find(queryObj);

        if (sort) {
            const sortList = sort.split(',').join(' ');
            result = result.sort(sortList);
        } else {
            result = result.sort('createdAt');
        }

        if (fields) {
            const fieldsList = fields.split(',').join(' ');
            result = result.select(fieldsList);
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        result = result.skip(skip).limit(limit);
        const books = await result;

        return res.status(200).json({ message: 'başarılı arama kaydı!', data: books, count: books.length });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Dahili sunucu hatası!' });
    }
};

const getBook = async (req, res) => {

    const id = req.params.id

    const book = await Book.findById(id)
    if (!book) {
        return res.status(404).send({ message: "Kitap bulunamadı" })
    }

    return res.status(201).send({ message: "Başarılı", data: book })

}

const addBook = async (req, res) => {

    const newBook = {   title: req.body.title,
                        author: req.body.author,
                        publishYear: req.body.publishYear,
                        publisher: req.body.publisher,
                        stock: req.body.stock,
                        price: req.body.price,
                        barcode: req.body.barcode
                    }
    const book = await Book.create(newBook)
    return res.status(201).send({ message: "Başarılı", data: book })

}

const updateBook = async (req, res) => {

    const { id } = req.params

    const book = await Book.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })

    if (!book) {
        return res.status(404).send({ message: "Kitap bulunamadı" })
    }

    return res.status(201).send({ message: "Başarılı", data: book })

}

const deleteBook = async (req, res) => {

    const { id } = req.params

    const book = await Book.findByIdAndDelete(id)
    if (!book) {
        return res.status(404).send({ message: "Kitap bulunamadı" })
    }
    return res.status(201).send({ message: "Başarılı", data: book })

}

module.exports = { getAllBooks, getBook, addBook, updateBook, deleteBook }
