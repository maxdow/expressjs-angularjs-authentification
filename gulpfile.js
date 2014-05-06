var gulp = require('gulp'),
    livereload = require('gulp-livereload');



gulp.task('default', function() {
  var server = livereload();
  gulp.watch(["public/*","public/authentification/*"]).on("change", function(file) {
      server.changed(file.path);
  });
});