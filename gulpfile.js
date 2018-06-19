/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/6/19
 */

"use strict";

const path = require('path');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');
const runSequence = require('run-sequence');
const tsProject = ts.createProject(path.join(__dirname, 'src/client/tsconfig.json'), {
  typescript: require('typescript')
});

const basePath = path.join(__dirname, 'src/client/');
const baseOutput = path.join(__dirname, 'dist/client/');
const paths = {
  // 静态资源目录
  assets: basePath + 'assets/**/*',
  // 静态资源存放目录
  assetsOutput: baseOutput + 'assets',
  // src目录
  source: basePath + '**/*.ts',
  // 通用功能
  utils: path.join(__dirname, 'src/utils/**/*.ts'),
  utilsOutput: path.join(__dirname, 'dist/utils'),
  // 输出目录
  output: path.join(__dirname, 'dist/client/'),
  // 输出目录的文件
  clientOutput: path.join(__dirname, 'dist/client/**/*'),
  // 所有输出目录
  allOutput: path.join(__dirname, 'dist/'),
};

/**
 * 编译TS
 */
gulp.task('compile', () => {
  return gulp.src(paths.source)
    .pipe(plumber())
    .pipe(tsProject())
    .pipe(gulp.dest(paths.output))
});


/**
 * 复制资源文件
 */
gulp.task('copy', () => {
  return gulp.src(paths.assets)
    .pipe(gulp.dest(paths.assetsOutput))
});

/**
 * 清理目录
 */
gulp.task('clean', () => {
  return gulp.src(paths.clientOutput, {read: false})
    .pipe(clean());
});

/**
 * 清理所有
 */
gulp.task('cleanAll', () => {
  return gulp.src(paths.clientOutput, {read: false})
    .pipe(clean());
});

// 清理，拷贝资源，编译TS
gulp.task('build', function (callback) {
  // 串行各个任务
  runSequence('clean', 'copy', 'compile', callback);
});

gulp.task('default', ['build'], () => {
  gulp.watch(paths.source, ['compile']);
});
