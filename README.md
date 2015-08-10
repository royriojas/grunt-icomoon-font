[![NPM Version](http://img.shields.io/npm/v/ico-mixins.svg?style=flat)](https://npmjs.org/package/ico-mixins)

# ico-mixins
`ico-mixins` is a cli tool to generate a mixin for each icon defined in the selection.json file from icomoon

## Motivation
I didn't want to use the declarative classes, with this tool given a `selection.json` file and the fonts from the `icomoon` app
it can generate the less files for both the font and the mixins

## Install
```bash
npm i -g ico-mixins
```

## Usage

here is the output of the -h option

```bash
===============================================================
Usage: ico-mixins -c my.conf.js
       ico-mixins ./font/selection.json -o ./dest/outfile.less
===============================================================

Options:
  -o, --output String  The path to the output less file. A mixins file will also be created in the same directory
  -h, --help           Show this help
  -v, --version        Outputs the version number
  -q, --quiet          Show only the summary info - default: false
  --colored-output     Use colored output in logs
  --stack              if true, uncaught errors will show the stack trace if available
  -c, --config String  Path to your `ico-mixins` config. This can be used to specify the options and targets instead of passing them on the command line
```

## examples

```bash
# create a font from the `selection.json` file and fonts folder.
# this will create three files and copy the fonts relative to the
# font-name.less file in a folder named fonts
ico-mixins ./path/to/selection.json -o ./path/to/dest/font-name.less
```

or using a config file

```bash
ico-mixins -c fonts.conf.js
```

And the `font.conf.js` should contain something like

```javascript
module.exports = function () {
  return {
    'name-of-target': {
      src: './demo/source/selection.json',
      dest: './demo/dest/name-of-less-file-to-generate.less',
      options: {
        // where to dump a js file with the codes declared
        // useful for making demos of the font
        jsonCodesOutput: './demo/font-codes.js',

        // This function is called once per icon name and allows
        // to fix inconsistencies in the naming conventions
        processIconName: function ( name ) {
          var fixPrefix = 'my-icon_';
          return (name || '').trim().toLowerCase().replace( fixPrefix, '' ).replace( /_/g, '-' );
        }
      }
    }
  };
};
```

## Changelog

[Changelog](./changelog.md)

## License

[MIT](./LICENSE)
