var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var webserver = require('gulp-webserver');

gulp.task('sass', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css/'))
});

gulp.task('watch', function() {
    gulp.watch('./src/scss/*.scss', gulp.series('sass'));
});

gulp.task('webserver', function() {
    return gulp.src('./src/')
        .pipe(webserver({
            port: 8032,
            proxies: [{
                source: '/classify/icon',
                target: "http://localhost:3000/classify/classify/icon"
            }, {
                source: '/list',
                target: "http://localhost:3000/users/list"
            }, {
                source: '/classify/add',
                target: "http://localhost:3000/classify/classify/add"
            }, {
                source: '/classify/find',
                target: "http://localhost:3000/classify/classify/find"
            }, {
                source: '/bill/billList',
                target: "http://localhost:3000/bill/bill/billList"
            }, {
                source: '/bill/getTime',
                target: "http://localhost:3000/bill/bill/getTime"
            }, {
                source: '/bill/delBill',
                target: "http://localhost:3000/bill/bill/delBill"
            }]
        }));
});

gulp.task('dev', gulp.series('sass', 'webserver', 'watch'));