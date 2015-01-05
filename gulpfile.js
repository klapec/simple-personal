var gulp          = require('gulp');
var gutil         = require('gulp-util');
var cp            = require('child_process');
var browserSync   = require('browser-sync');
var del           = require('del');
var jshintStylish = require('jshint-stylish');
var merge         = require('merge-stream');
var $             = require('gulp-load-plugins')();

var basePath = {
  src   : 'assets/src/',
  dest  : 'assets/dest/'
};

// var sitePath = {
//   dest  : '_site'
// };

var srcAssets = {
  styles        : basePath.src + 'stylesheets/',
  scripts       : basePath.src + 'scripts/',
  vendorScripts : basePath.src + 'scripts/vendor/',
  images        : basePath.src + 'images/'
};

var destAssets = {
  styles        : basePath.dest + 'stylesheets/',
  scripts       : basePath.dest + 'scripts/',
  vendorScripts : basePath.dest + 'scripts/',
  images        : basePath.dest + 'images/'
};

// var siteAssets = {
//   styles        : sitePath.dest,
//   scripts       : sitePath.dest,
//   vendorScripts : sitePath.dest,
//   images        : sitePath.dest + 'images/',
// };

function errorAlert(err) {
  $.notify.onError({
    title: "Gulp Error",
    message: "Check your terminal",
    sound: "Basso"
  })(err);
  gutil.log(gutil.colors.red(err.toString()));
  this.emit("end");
}

gulp.task('build', function(done) {
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'}).on('close', done);
});

gulp.task('default', ['build'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    },
    notify: false
  });
  gulp.watch(['*.html', '*.md', '_layouts/*.html', '_includes/*.html', '_posts/*', '_config.yml'], ['build', browserSync.reload]);
  gulp.watch(srcAssets.styles + '**/*', ['styles', browserSync.reload]);
  gulp.watch(srcAssets.scripts + '*', ['scripts', browserSync.reload]);
  gulp.watch(srcAssets.vendorScripts + '**/*', ['vendorScripts', browserSync.reload]);
  gulp.watch(srcAssets.images + '*', ['images', browserSync.reload]);
});

gulp.task('styles', function() {
  return gulp.src(srcAssets.styles + 'main.scss')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.sass({
      precision: 6
    }))
    .pipe($.autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'Android >= 4']
    }))
    .pipe($.minifyCss())
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(destAssets.styles))
    // .pipe(gulp.dest(siteAssets.styles))
    .pipe($.notify({
        title: "Stylesheets recompiled",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('scripts', function() {
  return gulp.src(srcAssets.scripts + '*.js')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.concat('main.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(destAssets.scripts))
    // .pipe(gulp.dest(siteAssets.scripts))
    .pipe($.notify({
        title: "Scripts recompiled",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('vendorScripts', function() {
  return gulp.src(srcAssets.vendorScripts + '**/*.js')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.concat('vendor.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(destAssets.vendorScripts))
    // .pipe(gulp.dest(siteAssets.vendorScripts))
    .pipe($.notify({
        title: "Vendor scripts recompiled",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('images', function() {
  return gulp.src(srcAssets.images + '*')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.changed(destAssets.images))
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(destAssets.images))
    // .pipe(gulp.dest(siteAssets.images))
    .pipe($.notify({
        title: "Images optimized",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});
