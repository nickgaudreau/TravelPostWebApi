// Revealing pattern
var commentController = function (Comment) {
    var httpPost = function (req, res) {
        // use body parser to parse comment data into JSON
        var comment = new Comment(req.body);
        // create new comment -> document -> in mongodb 
        comment.save();
        console.log(comment);
        // send status created  and comment returned
        res.status(201).send(comment);
    }
    var httpGet = function (req, res) {
        // query string ... like OData
        var query = req.query;
        Comment.find(query, function (err, comments) {
            if (err) {
                console.error(err);
                res.status(500).send(err); // send 500 and details to cleint
            }
            else { // OK
                // add self link to object
                var returnComments = [];
                comments.forEach(function (element, index, array) {
                    var newComment = element.toJSON();
                    newComment.links = {};
                    newComment.links.self = 'http://' + req.headers.host + '/api/comments/' + newComment._id
                    returnComments.push(newComment);
                });
                res.json(returnComments);
                console.log('success');
            }
        });
    }
    return {
        httpPost: httpPost,
        httpGet: httpGet
    }
}
module.exports = commentController;