// Revealing pattern
var postController = function (Post) {
    var httpPost = function (req, res) {
        // use body parser to parse post data into JSON
        var post = new Post(req.body);
        // create new post -> document -> in mongodb 
        post.save();
        //console.log(post);
        // send status created  and post returned
        res.status(201).send(post);
    }
    var httpGet = function (req, res) {
        // query string ... like OData
        var query = req.query;
        // console.log(Post); => get intersting Mongoose/Entity details
        Post.find(query, function (err, posts) {
            if (err) {
                console.error(err);
                res.status(500).send(err); // send 500 and details to cleint
            }
            else { // OK
                // add self link to object
                var returnPosts = [];
                console.log('post count: ' + posts.length);
                posts.forEach(function (element, index, array) {
                    var newPost = element.toJSON();
                    //console.log(newPost);
                    newPost.links = {};
                    newPost.links.self = 'http://' + req.headers.host + '/api/posts/' + newPost._id
                    returnPosts.push(newPost);
                });
                res.json(returnPosts);
                console.log('success');
            }
        });
    }
    return {
        httpPost: httpPost,
        httpGet: httpGet
    }
}
module.exports = postController;