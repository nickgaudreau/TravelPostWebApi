var gulp = require('gulp'),
    nodemon = require('nodemon');
    gulpMocha = require('gulp-mocha');

// create a default task to run nodemon pluggin
gulp.task('default', function () {
    nodemon({
        script: 'app.js',
        ext: 'js',
        env: {
            PORT: 8008
        },
        ignore: ['./node_modules/**']
    })
    .on('restart', function () {
        console.log('Restarting');
    })
    ;
});


// testing
// gulp.task('test', function(){
//     // get all tests
//     //gulp.src('tests/*.js', 
// })