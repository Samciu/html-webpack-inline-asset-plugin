const ReStyleTag = /<link[^>].*inline.*>/g;
const ReScriptTag = /<script.*inline.*>/g;

function createStyleTag(content) {
    return `<style>${content}</style>`;
}

function createScriptTag(content) {
    return `<script>${content}</script>`;
}

function HtmlWebpackInlinePlugin(options) {
    this.options = options;
}

HtmlWebpackInlinePlugin.prototype.getRelativeDirPaths = function (compilation, results) {
    const assetsKeys = Object.keys(compilation.assets);
    let paths = []
    results.forEach(result => {
        let path = assetsKeys.filter(assetsKey => {
            return result.includes(assetsKey)
        })[0];
        path && paths.push(path);
    })
    return paths;
}

HtmlWebpackInlinePlugin.prototype.apply = function (compiler) {
    let self = this;
    (compiler.hooks
        ? compiler.hooks.compilation.tap.bind(compiler.hooks.compilation, 'html-webpack-inline-plugin')
        : compiler.plugin.bind(compiler, 'compilation'))(function (compilation) {
            (compilation.hooks
                ? compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync.bind(compilation.hooks.htmlWebpackPluginAfterHtmlProcessing, 'html-webpack-inline-plugin')
                : compilation.plugin.bind(compilation, 'html-webpack-plugin-after-html-processing'))(function (htmlPluginData, callback) {
                    let result = self.processAssetsMapHtml(compilation, htmlPluginData);
                    callback(null, result);
                });
        });
};

HtmlWebpackInlinePlugin.prototype.processAssetsMapHtml = function (compilation, pluginData) {
    let self = this;
    let html = pluginData.html;

    // 内联形式
    html = html.replace(ReStyleTag, (match, p1, offset, string) => {
        let result = match;

        let relativeDirPaths = self.getRelativeDirPaths(compilation, pluginData.assets.css);

        if (!relativeDirPaths.length) {
            return result;
        }

        let source = '';
        relativeDirPaths.map(relativeDirPath => {
            source += compilation.assets[relativeDirPath].source();
        });

        result = createStyleTag(source);

        return result;
    });

    html = html.replace(ReScriptTag, (match, p1, offset, string) => {
        let result = match;

        let relativeDirPaths = self.getRelativeDirPaths(compilation, pluginData.assets.js);

        if (!relativeDirPaths.length) {
            return result;
        }

        let source = '';
        relativeDirPaths.map(relativeDirPath => {
            source += compilation.assets[relativeDirPath].source();
        });

        result = createScriptTag(source);

        return result;
    });


    return { html }
};

module.exports = HtmlWebpackInlinePlugin;