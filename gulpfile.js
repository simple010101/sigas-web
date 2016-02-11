//////////////////////////
// Required
//////////////////////////

var gulp = require('gulp');

var sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	del = require('del'),
	compass = require('gulp-compass'),
	sourcemaps = require('gulp-sourcemaps');

// Log Errors

function errorLog(err) {
	console.log(err.message);
	this.emit('end');
}
	
	
/////////////////////////
// Scripts Task
/////////////////////////

// minify && concat all client-dsd JS files
gulp.task('scripts', function() {
	return gulp.src('sigas.de/js/*.js')
		.pipe(sourcemaps.init())
			.pipe(concat('temp-js.js'))
			.pipe(uglify())
			.on('error', errorLog)
			.pipe(rename('main-all.min.js'))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest('sigas.de/js/js-min'));
});

/////////////////////////
//	Compass / Sass Tasks
/////////////////////////

gulp.task('compass', function() {
	gulp.src('sigas.de/scss/*.scss')
	.pipe(sourcemaps.init())
	//.pipe(plumber())				// has to be at first after src, with plumber gulp does not kick out when problem occurs
		.pipe(compass({
			config_file: 'sigas.de/scss/config.rb',
			css: 'sigas.de/css',
			sass: 'sigas.de/scss'
		}))
		.on('error', errorLog)
	.pipe(sourcemaps.write('maps'))
	.pipe(gulp.dest('sigas.de/css'));
	//.pipe(reload({stream:true}));
});


/////////////////////////
// Build Tasks
/////////////////////////

gulp.task('build:cleanfolder', function(callBack) {
	del([
		'build/**'
	], callBack);
});

gulp.task('build:copy', function() {
	return gulp.src(['**/*/', '!node_modules/**/*/', '!daemon/', '!public/js/*.js'])
	.pipe(gulp.dest('build/'));
});

gulp.task('build:remove', ['build:copy'], function(callBack) {
	del([
		'build/node_modules/',
		'build/daemon/',
		'build/public/scss/'
	], callBack);
});

gulp.task('build', ['build:copy', 'build:remove']);


/////////////////////////
// Watch Task
/////////////////////////

// watch folder(s) or file(s), and what to do if change happens

gulp.task('watch', function() {
	gulp.watch('public/js/*.js', ['scripts']);
	gulp.watch('public/scss/*.scss', ['compass']);
});

/////////////////////////
// Default Task
/////////////////////////

// calls other tasks
// what happens when type 'gulp' in console

gulp.task('default', ['scripts', 'compass', 'watch']);