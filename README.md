# html-webpack-inline-asset-plugin

> Inline all the css and js assets in the html where the `<script>`, `<link>` tags that contain the `inline` attribute.

## Installation


```shell
npm install --save html-webpack-inline-asset-plugin
```

## Basic Usage
Require the plugin in your webpack config:

```javascript
var HtmlWebpackInlineAssetPlugin = require('html-webpack-inline-asset-plugin');
```

Add the plugin to your webpack config as follows:

```javascript
plugins: [
  new HtmlWebpackPlugin({inject: false}),
  new HtmlWebpackInlineAssetPlugin()
]  
```

Add the tag to your html template as follows:

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" inline>
  </head>
  <body>
    <script inline></script>
  </body>
</html>
```



# License

This project is licensed under [MIT](https://github.com/Samciu/html-webpack-inline-asset-plugin/blob/master/LICENSE).