// Revealing pattern
var bookController = function (Book) {
    var post = function (req, res) {
        // use body parser to parse post data into JSON
        var book = new Book(req.body);
        // create new book -> document -> in mongodb 
        book.save();
        console.log(book);
        // send status created  and book returned
        res.status(201).send(book);
    }

    var get = function (req, res) {
        // query string ... like OData
        var query = req.query;
        Book.find(query, function (err, books) {
            if (err) {
                console.error(err);
                res.status(500).send(err); // send 500 and details to cleint
            }
            else { // OK

                // add self link to object
                var returnBooks = [];
                books.forEach(function (element, index, array) {
                    var newBook = element.toJSON();
                    newBook.links = {};
                    newBook.links.self = 'http://' + req.headers.host + '/api/books/' + newBook._id
                    returnBooks.push(newBook);
                });
                res.json(returnBooks);

                console.log('success');
            }
        });
    }

    return {
        post: post,
        get: get
    }
}

module.exports = bookController;