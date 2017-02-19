var should = require('should');
var sinon = require('sinon');

describe('Book Cotnroller Test', function () {

    // we need a mock requesta nd a mock Book
    describe('Post', function () {
        // testing post method of book  controller
        it('should not allowed an empty title on post', function () {

            // mock book
            var Book = function (book) { this.save() = function () { } }

            // mock request with no title
            var req = {
                body: {
                    author: 'Nick'
                }
            };

            var res = {
                // what spy do, get info on : what is called, how manby times
                status: sinon.spy(),
                send: sinon.spy()
            }

            // get book controller reference
            var bookController = require('../controllers/bookController')(Book); //pass in Book on require
            
            // trigger post test
            bookController.post(req,res); 

            res.status.calledWith(400).should.equal(true, 'BAd Status ' + res.status.args[0][0]); // args array of each time this function called
            res.send.calledWith('Title is requiured').should.equal(true);
        });
    })
})