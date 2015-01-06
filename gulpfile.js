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

var srcAssets = {
  styles        : basePath.src + 'stylesheets/',
  scripts       : basePath.src + 'scripts/',
  vendorScripts : basePath.src + 'scripts/vendor/',
  images        : basePath.src + 'images/',
  svg           : basePath.src + 'svg/'
};

var destAssets = {
  styles        : basePath.dest + 'stylesheets/',
  scripts       : basePath.dest + 'scripts/',
  vendorScripts : basePath.dest + 'scripts/',
  images        : basePath.dest + 'images/',
  svg           : basePath.dest + 'svg/'
};

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

gulp.task('default', function() {
  browserSync({
    server: {
      baseDir: '_site'
    },
    notify: false
  });
  gulp.watch(['*.html', '*.md', '_layouts/*.html', '_includes/*.html', '_posts/*', '_config.yml'], ['build', browserSync.reload]);
  gulp.watch(srcAssets.styles + '**/*', ['injectStyles']);
  gulp.watch(srcAssets.scripts + '*', ['injectScripts']);
  gulp.watch(srcAssets.vendorScripts + '**/*', ['injectVendorScripts']);
  gulp.watch(srcAssets.images + '*', ['images', browserSync.reload]);
  gulp.watch(srcAssets.svg + '*', ['svg', browserSync.reload]);
});

gulp.task('styles', ['cleanStyles'], function() {
  return gulp.src(srcAssets.styles + 'main.scss')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.sass({
      precision: 6
    }))
    .pipe($.autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'Android >= 4']
    }))
    .pipe($.minifyCss())
    .pipe($.rev())
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(destAssets.styles))
    .pipe($.notify({
        title: "Stylesheets recompiled",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('scripts', ['cleanScripts'], function() {
  return gulp.src(srcAssets.scripts + '*.js')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.concat('main.js'))
    .pipe($.uglify())
    .pipe($.rev())
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(destAssets.scripts))
    .pipe($.notify({
        title: "Scripts recompiled",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('vendorScripts', ['cleanVendorScripts'], function() {
  return gulp.src(srcAssets.vendorScripts + '**/*.js')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.concat('vendor.js'))
    .pipe($.uglify())
    .pipe($.rev())
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(destAssets.vendorScripts))
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
    .pipe($.notify({
        title: "Images optimized",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('svg', function() {
  return gulp.src(srcAssets.svg + '*')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.changed(destAssets.svg))
    .pipe($.imgmin())
    .pipe($.svgstore({ fileName: 'sprite.svg', prefix: 'icon-' }))
    .pipe(gulp.dest(destAssets.svg))
    .pipe($.notify({
        title: "SVGs optimized",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('cleanAll', ['cleanStyles', 'cleanScripts', 'cleanVendorScripts']);

gulp.task('cleanStyles', function (cb) {
  del('assets/dest/stylesheets/*.css', cb);
});

gulp.task('cleanScripts', function (cb) {
  del('assets/dest/scripts/main*', cb);
});

gulp.task('cleanVendorScripts', function (cb) {
  del('assets/dest/scripts/vendor*', cb);
});

gulp.task('injectStyles', ['styles'], function () {
  var target = gulp.src('_layouts/default.html');
  var sources = gulp.src('assets/dest/stylesheets/*.css', {read: false});

  return target
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.inject(sources, {
      addPrefix: "{{ site.baseurl }}",
      addRootSlash: false
    }))
    .pipe(gulp.dest('./_layouts'));
});

gulp.task('injectScripts', ['scripts'], function () {
  var target = gulp.src('_layouts/default.html');
  var sources = gulp.src('assets/dest/scripts/main*', {read: false});

  return target
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.inject(sources, {
      addPrefix: "{{ site.baseurl }}",
      addRootSlash: false
    }))
    .pipe(gulp.dest('./_layouts'));
});

gulp.task('injectVendorScripts', ['vendorScripts'], function () {
  var target = gulp.src('_layouts/default.html');
  var sources = gulp.src('assets/dest/scripts/vendor*', {read: false});

  return target
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.inject(sources, {
      addPrefix: "{{ site.baseurl }}",
      addRootSlash: false
    }))
    .pipe(gulp.dest('./_layouts'));
});
