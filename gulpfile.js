var del = require('del');
var gulp = require('gulp');
var path = require('path');
var argv = require('yargs').argv;
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('gulp-buffer');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var exorcist = require('exorcist');
var babelify = require('babelify');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();

/**
 * Using different folders/file names? Change these constants:
 */
var PHASER_PATH = './node_modules/phaser/build/';
var BUILD_PATH = './build';
var SCRIPTS_PATH = BUILD_PATH + '/scripts';
var SOURCE_PATH = './src';
var STATIC_PATH = './static';
var ENTRY_FILE = SOURCE_PATH + '/index.js';
var OUTPUT_FILE = 'game.js';
const isProd = process.env.NODE_ENV === 'production';

var keepFiles = false;

// фікс гімна мамонта
const reloadGulp = (done) => {
  browserSync.reload();
  done();
};

/**
 * Simple way to check for development/production mode.
 */
function isProduction() {
  return argv.production;
}

/**
 * Logs the current build mode on the console.
 */
function logBuildMode() {
  if (isProduction()) {
    gutil.log(gutil.colors.green('Running production build...'));
  } else {
    gutil.log(gutil.colors.yellow('Running development build...'));
  }
}

/**
 * Deletes all content inside the './build' folder.
 * If 'keepFiles' is true, no files will be deleted. This is a dirty workaround since we can't have
 * optional task dependencies :(
 * Note: keepFiles is set to true by gulp.watch (see serve()) and reseted here to avoid conflicts.
 */
function cleanBuild(c) {
  if (!keepFiles) {
    del(['build/**/*.*']);
  } else {
    keepFiles = false;
  }
  c();
}

/**
 * Copies the content of the './static' folder into the '/build' folder.
 * Check out README.md for more info on the '/static' folder.
 */
async function copyStatic() {
  return gulp.src(STATIC_PATH + '/**/*').pipe(gulp.dest(BUILD_PATH));
}

/**
 * Copies required Phaser files from the './node_modules/Phaser' folder into the './build/scripts' folder.
 * This way you can call 'npm update', get the lastest Phaser version and use it on your project with ease.
 */
async function copyPhaser(d) {
  //   var srcList = ['phaser.min.js'];
  //   if (!isProduction()) {
  //     srcList.push('phaser.map', 'phaser.js');
  //   }
  //   srcList = srcList.map(function (file) {
  //     return PHASER_PATH + file;
  //   });
  //   return gulp.src(srcList).pipe(gulp.dest(SCRIPTS_PATH));
  //   d();
}

/**
 * Transforms ES2015 code into ES5 code.
 * Optionally: Creates a sourcemap file 'game.js.map' for debugging.
 *
 * In order to avoid copying Phaser and Static files on each build,
 * I've abstracted the build logic into a separate function. This way
 * two different tasks (build and fastBuild) can use the same logic
 * but have different task dependencies.
 */
function build() {
  var sourcemapPath = SCRIPTS_PATH + '/' + OUTPUT_FILE + '.map';
  logBuildMode();

  return browserify({
    paths: [path.join(__dirname, 'src')],
    entries: ENTRY_FILE,
    debug: true,

    transform: [
      [
        babelify,
        {
          presets: ['es2015'],
        },
      ],
    ],
  })
    .transform(babelify)
    .bundle()
    .on('error', function (error) {
      gutil.log(gutil.colors.red('[Build Error]', error.message));
      this.emit('end');
    })
    .pipe(gulpif(!isProduction(), exorcist(sourcemapPath)))
    .pipe(source(OUTPUT_FILE))
    .pipe(buffer())
    .pipe(gulpif(isProduction(), uglify()))
    .pipe(gulp.dest(SCRIPTS_PATH));
}

/**
 * Starts the Browsersync server.
 * Watches for file changes in the 'src' folder.
 */
function serve() {
  var options = {
    server: {
      baseDir: BUILD_PATH,
    },
    open: false, // Change it to true if you wish to allow Browsersync to open a browser window.
  };

  browserSync.init(options);

  // Watches for changes in files inside the './src' folder.
  gulp.watch(SOURCE_PATH + '/**/*.js', gulp.parallel('watch-js'));

  // Watches for changes in files inside the './static' folder. Also sets 'keepFiles' to true (see cleanBuild()).
  gulp
    .watch(STATIC_PATH + '/**/*', gulp.parallel('watch-static'))
    .on('change', function () {
      keepFiles = true;
    });
}

gulp.task('cleanBuild', cleanBuild);
gulp.task('copyStatic', gulp.series('cleanBuild', copyStatic));
gulp.task('copyPhaser', gulp.series('copyStatic', copyPhaser));
gulp.task('build', gulp.series('copyPhaser', build));
gulp.task('fastBuild', build);
gulp.task('serve', gulp.series('build', serve));
gulp.task('watch-js', gulp.series('fastBuild', reloadGulp)); // Rebuilds and reloads the project when executed.
gulp.task('watch-static', gulp.series('copyPhaser', reloadGulp));

/**
 * The tasks are executed in the following order:
 * 'cleanBuild' -> 'copyStatic' -> 'copyPhaser' -> 'build' -> 'serve'
 *
 * Read more about task dependencies in Gulp:
 * https://medium.com/@dave_lunny/task-dependencies-in-gulp-b885c1ab48f0
 */
if (isProd) {
  gulp.task('default', gulp.series('build'));
} else {
  gulp.task('default', gulp.series('serve'));
}
