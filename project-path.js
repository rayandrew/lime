var path = require('path');

var globals = {
  'rootDir': path.resolve(__dirname) + '/',
  'serverDir': path.resolve(__dirname) + '/server/',
  'serverAppDir': path.resolve(__dirname) + '/server/app/',
  'clientDir': path.resolve(__dirname) + '/client/',
  'clientBuildDir': path.resolve(__dirname) + '/client/build/'
};

module.exports = globals;
