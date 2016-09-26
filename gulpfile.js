var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var coffeeSources = ['components/coffee/tagline.coffee'];
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var compass = require('gulp-compass');
var connect = require('gulp-connect');
var webserver = require('gulp-webserver');

var env,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

if (env === 'development') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
}
else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
}

env = process.env.NODE_ENV || 'production';

jsSources = ['components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];

 sassSources = ['components/sass/style.scss'];
 htmlSources = [outputDir+'*.html'];
 jsonSources = [outputDir +'js/*.json'];

gulp.task('coffee', function () {
    gulp.src(coffeeSources)
        .pipe(coffee({ bare: true })
        .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function () {
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(gulp.dest(outputDir + 'js'))
        
});


gulp.task('compass', function () {
    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/sass',
            image: outputDir +'images',
            style: sassStyle,
            require: ['susy']
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest(outputDir+'css'))
        
});

gulp.task('html', function () {
    gulp.src(htmlSources)
      
});

gulp.task('json', function () {
    gulp.src(jsonSources)
      
});

gulp.task('webserver', function () {
    //connect.server({
    //    root: 'builds/development/index.html',
    //    livereload: true
    //})

    gulp.src('.')
    .pipe(webserver({
        livereload: {
            enable: true // need this set to true to enable livereload
            },
        directoryListing: false,
        open: true,
        port:8080,
        fallback: 'index.html',
        open: 'http://localhost:8080/builds/development/index.html'
    }));
});

gulp.task('watch', function () {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch(jsSources, ['js']);
    gulp.watch(htmlSources, ['html']);
    gulp.watch(jsonSources, ['json']);
});


gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'watch', 'webserver'], function () {

});