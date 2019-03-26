const ReStyleTag = /<link[^>].*?href=['"]?([^'"]*)['"]?.*?>/g;
const ReInlinePlaceholder = /\?__inline/i;
const debug = process.env.NODE_ENV !== 'production';

function createStyleTag(content) {
  return '<style>' + content + '</style>';
}

function HtmlWebpackInlinePlugin(options) {
  this.options = options;
}

HtmlWebpackInlinePlugin.prototype.getRelativeDirPath = function (compilation, result) {
  return Object.keys(compilation.assets).filter((assetName) => {
    return result.indexOf(assetName) !== -1
  })[0]
}

HtmlWebpackInlinePlugin.prototype.apply = function (compiler) {

  let self = this;
  compiler.hooks.compilation.tap('html-webpack-inline-plugin', compilation => {
    compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
      'html-webpack-inline-plugin', (htmlPluginData, callback) => {
        let result = self.processAssetsMapHtml(compilation, htmlPluginData);
        callback(null, result);
      })
  });
};

HtmlWebpackInlinePlugin.prototype.processAssetsMapHtml = function (compilation, pluginData) {
  let self = this;
  let html = pluginData.html;

  // css注入
  if (ReStyleTag.test(html) && ReInlinePlaceholder.test(html)) {
    html = html.replace(ReStyleTag, (match, p1, offset, string) => {
      let result = match;

      let relativeDirPath = self.getRelativeDirPath(compilation, p1);

      if (!relativeDirPath) {
        return result;
      }

      if (!debug && ReInlinePlaceholder.test(p1)) { // 内联形式
        let source = compilation.assets[relativeDirPath].source();
        result = match.replace(match, createStyleTag(source));
      }

      return result;
    });
  }

  return {
    html
  }
};

module.exports = HtmlWebpackInlinePlugin;
