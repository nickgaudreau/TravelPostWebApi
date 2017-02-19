var express = require('express'); // import express object reference 

// function is good to if needed pass in data/test
var commentRoutes = function (Comment) {
    var commentRouter = express.Router(); // router instance
    // get this controller reference
    var commentController = require('../controllers/commentController')(Comment); //pass in Post on require
    
    // Get all
    commentRouter.route('/')
        .post(commentController.httpPost)
        .get(commentController.httpGet);

    /*
    * Middleware / services... to intercept request, do something, then go to next step below route (or could be another service/middleware)
    * and handle error / status
    */
    commentRouter.use('/:commentId', function (req, res, next) {

        // params postId must match match the route string above e.g. '/Books/:bookId'
        Comment.findById(req.params.commentId, function (err, comment) {
            if (err) {
                console.error(err);
                res.status(500).send(err); // send 500 and details to cleint
            }
            else if (comment) {
                // *** if data exist, we add to request for it to be available on next step
                req.comment = comment;
                next();
            }
            else { // if not found return 404
                console.log('not found!');
                res.status(404).send('Comment not found');
            }
        });
    });

    // Get by ID    
    commentRouter.route('/:commentId')
        .get(function (req, res) {
            console.log('get by id success');
            var comment = req.comment.toJSON();
            comment.links = {};
            var newLink = 'http://' + req.headers.host + '/api/comments?CommenterId=' + comment.CommenterId;
            comment.links.FilterByThisCommenterId = newLink.replace(' ', '%20');
            res.json(comment);
        })
        .put(function (req, res) {
            // params bookId must match match the route string above e.g. '/Books/:bookId'
            console.log('put by id success');            
            req.comment.CreatedDate = req.body.CreatedDate;
            req.comment.Text = req.body.Text;
            req.comment.CommenterId = req.body.CommenterId;
            req.comment.PostId = req.body.PostId;

            // use callback to avoid async issue!!
            req.comment.save(function (err) {
                if (err) {
                    console.error(err);
                    res.status(500).send(err); // send 500 and details to cleint
                }
                else{ // Ok
                    res.json(req.comment);
                    console.log('put by id success');
                }
            }); 

        })
        .patch(function (req, res) {
            // we dont want to update id
            if (req.body._id)
                delete req.body._id; // delete a body prop

            // check what is in req.body, base on what prop exists we want to update req.comment
            // for in loop => for every key in req.body. Match every req.body prop to req.comment prop
            for (var prop in req.body) {
                if (req.body.hasOwnProperty(prop)) {
                    req.comment[prop] = req.body[prop];
                }
            }
            // use callback to avoid async issue!!
            req.comment.save(function (err) {
                if (err) {
                    console.error(err);
                    res.status(500).send(err); // send 500 and details to cleint
                }
                else{ // Ok
                    res.json(req.comment);
                    console.log('patch by id success');
                }
            });            
            
        })
        .delete(function (req, res) {
            // use callback for async possible issue
            req.comment.remove(function(err){
                if (err) {
                    console.error(err);
                    res.status(500).send(err); // send 500 and details to cleint
                }
                else{ // Ok                    
                    res.status(204).send('Resource deleted');
                    console.log('Deleete by id success');
                }
            });
        });

    return commentRouter;
};

module.exports = commentRoutes;