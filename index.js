var fs = require('fs');
var sysPath = require('path');
var process = require('process');
var deepmerge = require('deepmerge');

var read = function (src) {
  var data = {};
  try {
    data = JSON.parse(fs.readFileSync(src, {encoding: 'utf8'}));
  } catch (e) {
    console.log(e);
  }
  return data;
};

module.exports = function (data) {
  var t = data.types;

  return {
    visitor: {
      ImportDeclaration: function (path, state) {
        var options = state.opts;

        if (options.replacedModuleName === undefined)
          return;

        if (path.node.source.value === options.replacedModuleName) {
          var configDir = options.configDir ? options.configDir : './';
          var configPath = sysPath.join(configDir, 'default.json');
          var config = read(configPath) || {};
          if (process.env.BABEL_ENV) {
            var platformPath = sysPath.join(configDir, process.env.BABEL_ENV + '.json');
            if (fs.existsSync(platformPath)) {
              config = deepmerge(config, read(platformPath));
            }
          }
          path.node.specifiers.forEach(function (specifier, idx) {
            var localId = specifier.local.name;
            var binding = path.scope.getBinding(localId);
            var imported = specifier.type === "ImportDefaultSpecifier" ? config : config[specifier.imported.name];
            binding.referencePaths.forEach(function (refPath) {
              refPath.replaceWith(t.valueToNode(imported));
            });
          });

          path.remove();
        }
      }
    }
  }
};