const shell = require('gulp-shell');
const gulp = require('gulp');
const path = require('path');



gulp.task('run-server', gulp.parallel(
  shell.task([`dotnet run --project ${path.join(__dirname, './apiServer/MarketingDashboardAPI')}`]),
  shell.task(['ng serve -o'])
));
