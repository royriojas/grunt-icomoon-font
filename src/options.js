var path = require( 'path' );

module.exports = {
  pkgJSONPath: path.resolve( __dirname, '../package.json' ),
  configFile: {
    //defaultName: 'package.json',
    //pathToLocalConfig: path.resolve( __dirname, '../configs/bundly.json' ),
    description: 'Path to your `ico-mixins` config. This can be used to specify the options and targets instead of passing them on the command line'
  },
  //useDefaultOptions: true,
  optionator: {
    prepend: '===============================================================\nUsage: ico-mixins -c my.conf.js\n       ico-mixins ./font/selection.json -o ./dest/outfile.less \n===============================================================',
    options: [
      {
        heading: 'Options'
      },
      {
        option: 'output',
        alias: 'o',
        type: 'String',
        description: 'The path to the output less file. A mixins file will also be created in the same directory'
      },
      {
        option: 'target',
        alias: 't',
        type: 'String',
        dependsOn: 'config',
        description: 'The name of the target to execute from all the posible targets'
      }
    ]
  }
};
