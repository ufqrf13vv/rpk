"use strict";

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    less = require('gulp-less'),
    pug = require('gulp-pug'),
    combineMq = require('gulp-combine-mq'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin');

var path = {
    build: { 
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { 
        pug: 'src/html/**/*.pug', 
        js: 'src/js/main.js',
        style: 'src/less/style.less',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: { 
        html: 'src/html/**/*.pug',
        js: 'src/js/**/*.js',
        style: 'src/less/**/*.less',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};
//  Компиляция HTML
gulp.task('html', function () {
  gulp.src(path.src.pug)
  .pipe(pug({pretty: '\t'}))
  .pipe(gulp.dest(path.build.html));
});

//  Компиляция стилей
gulp.task('style', function () {
    gulp.src(path.src.style) 
        .pipe(less()) 
        .pipe(prefixer()) 
        .pipe(combineMq())
        .pipe(gulp.dest(path.build.css));   
});

//  Минификация стилей
gulp.task('stylemin', function () {
    gulp.src(path.src.style) 
        .pipe(less()) 
        .pipe(prefixer()) 
        .pipe(combineMq())
        .pipe(cleanCSS())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest(path.build.css));   
});

//  Сжатие картинок
gulp.task('image', function () {
    gulp.src(path.src.img) 
        .pipe(imagemin({ 
            progressive: true,
            interlaced: true
        }),
        imagemin.optipng(), 
        imagemin.svgo())
        .pipe(gulp.dest(path.build.img));
});

//  Компиляция JS
gulp.task('js', function() {
    gulp.src(path.src.js)
        //.pipe(uglify())
        .pipe(gulp.dest(path.build.js))
});

//  Перенос шрифтов
gulp.task('fonts', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

//  Сборка
gulp.task('build', [
    'html',
    'style',
    'fonts',
    'image',
    'js'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style');
    });
//    watch([path.watch.img], function(event, cb) {
//        gulp.start('image');
//    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js');
    });
});

gulp.task('default', ['build', 'watch']);