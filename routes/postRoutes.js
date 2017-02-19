var express = require('express'); // import express object reference 

// function is good to if needed pass in data/test
var postRoutes = function (Post) {
    var postRouter = express.Router(); // router instance
    // get this controller reference
    var postController = require('../controllers/postController')(Post); //pass in Post on require
    
    // Get all
    postRouter.route('/')
        .post(postController.httpPost)
        .get(postController.httpGet);

    /*
    * Middleware / services... to intercept request, do something, then go to next step below route (or could be another service/middleware)
    * and handle error / status
    */
    postRouter.use('/:postId', function (req, res, next) {

        // params postId must match match the route string above e.g. '/Books/:bookId'
        Post.findById(req.params.postId, function (err, post) {
            if (err) {
                console.error(err);
                res.status(500).send(err); // send 500 and details to cleint
            }
            else if (post) {
                // *** if data exist, we add to request for it to be available on next step
                req.post = post;
                next();
            }
            else { // if not found return 404
                console.log('not found!');
                res.status(404).send('Post not found');
            }
        });
    });

    // Get by ID    
    postRouter.route('/:postId')
        .get(function (req, res) {
            console.log('get by id success');
            var post = req.post.toJSON();
            post.links = {};
            var newLink = 'http://' + req.headers.host + '/api/posts?Title=' + post.Title;
            post.links.FilterByThisTitle = newLink.replace(' ', '%20');
            res.json(post);
        })
        .put(function (req, res) {
            // params bookId must match match the route string above e.g. '/Books/:bookId'
            console.log('put by id success');
            req.post.Title = req.body.Title;
            req.post.Location = req.body.Location;
            req.post.CreatedDate = req.body.CreatedDate;
            req.post.Text = req.body.Text;
            req.post.OwnerId = req.body.OwnerId;
            req.post.MainPic = req.body.MainPic;
            req.post.Memo = req.body.Memo;

            // use callback to avoid async issue!!
            req.post.save(function (err) {
                if (err) {
                    console.error(err);
                    res.status(500).send(err); // send 500 and details to cleint
                }
                else{ // Ok
                    res.json(req.post);
                    console.log('put by id success');
                }
            }); 

        })
        .patch(function (req, res) {
            // we dont want to update id
            if (req.body._id)
                delete req.body._id; // delete a body prop

            // check what is in req.body, base on what prop exists we want to update req.post
            // for in loop => for every key in req.body. Match every req.body prop to req.post prop
            for (var prop in req.body) {
                if (req.body.hasOwnProperty(prop)) {
                    req.post[prop] = req.body[prop];
                }
            }
            // use callback to avoid async issue!!
            req.post.save(function (err) {
                if (err) {
                    console.error(err);
                    res.status(500).send(err); // send 500 and details to cleint
                }
                else{ // Ok
                    res.json(req.post);
                    console.log('patch by id success');
                }
            });            
            
        })
        .delete(function (req, res) {
            // use callback for async possible issue
            req.post.remove(function(err){
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

    return postRouter;
};

module.exports = postRoutes;