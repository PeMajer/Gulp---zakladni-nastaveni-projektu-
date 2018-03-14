const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const concat = require('gulp-concat');  //spoji vice js do jednoho js
const uglify = require('gulp-uglify-es').default;  // minifikuje JS

gulp.task('default', ['copy-html','copy-img','copy-js','sassik'], function(){
    browserSync.init({
        server: './dist'
    });
    gulp.watch('app/sass/**/*.scss', ['sassik']);
    gulp.watch('app/index.html', ['copy-html']);
    gulp.watch('app/js/**/*.js', ['copy-js']);
    gulp.watch('dist/index.html', browserSync.reload);              // obe moznosti funguji
    gulp.watch('dist/js/**/*.js').on('change', browserSync.reload); // obe moznosti funguji

});

gulp.task('dist',['copy-html','copy-img','copy-js','sassik']);  //pokud chci spojit vice tasku do jednoho

// vytvoreni spojeni mezi prohlizecem a kodem, muze byt samostatne nebo  primo v defaultu
gulp.task('server', ['watch'],function() { // nejprve pusti WATCH

    browserSync.init({
        server: './dist'
    });
});

// prevedeni sass na css
gulp.task('sassik', function () {
    gulp.src('app/sass/**/*.scss')
        .pipe(sass({
            // outputStyle: 'compressed'   //minifikace
        }).on('error', sass.logError))
        .pipe(autoprefixer({              // autoprefix csska
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream()); // posle zmeny do browseru pri zmene sassu
});

gulp.task('watch', function(){  //sledovani zmen, muze byt samostatne nebo  primo v defaultu
    gulp.watch('app/sass/**/*.scss', ['sassik']);
    gulp.watch('dist/*.html').on('change', browserSync.reload); // posle zmeny do browseru pokud se zmeni HTML
    gulp.watch('dist/js/**/*.js', browserSync.reload); // posle zmeny do browseru pokud se zmeni JS
});


gulp.task('copy-img', function(){ // zkopiruje img do distu
    gulp.src('app/img/*')
        .pipe(gulp.dest('dist/img/'));
});

gulp.task('copy-html', function(){ // zkopiruje html do distu
    gulp.src('app/*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('copy-js', function(){ // zkopiruje js do distu
    gulp.src('app/js/**/*.js')
        .pipe(gulp.dest('dist/js'));
});

gulp.task('script', ['babel','concat','uglify']);

gulp.task('babel', function(){ // babel - prevedeni na es2015
    gulp.src('app/js/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('concat',function(){ //spoji vice js do jednoho js
    gulp.src('dist/js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('uglify', function () {  // minifikuje JS
    function createErrorHandler(name) {
        return function (err) {
            console.error('Error from ' + name + ' in compress task', err.toString());
        };
    }

    return gulp.src('dist/js/all.js')
        .on('error', createErrorHandler('gulp.src'))
        .pipe(uglify())
        .on('error', createErrorHandler('uglify'))
        .pipe(gulp.dest('dist/js/'))
        .on('error', createErrorHandler('gulp.dest'));
});

