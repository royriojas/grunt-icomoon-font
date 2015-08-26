var ES6Promise = require( 'es6-promise' ).Promise;

module.exports = {
  dirname: __dirname,
  processTargets: function ( dataEntry, cli ) {
    var me = this;

    var _files = dataEntry.files || [ ];
    cli.log( dataEntry.name, 'start!' );

    var options = dataEntry.options; //extend( true, dataEntry.options, me._getOverrideOptions( cli.opts ) );

    return _files.reduce( function ( seq, data ) {
      return seq.then( function () {
        var _data = { src: data.src[ 0 ], dest: data.dest };
        return me.processTarget( _data, options, cli ).then( function () {
          cli.log( dataEntry.name, 'done!' );
        } );
      } );
    }, ES6Promise.resolve() );
  },
  processTarget: function ( data, options, cli ) {

    var fCreator = require( '../' ).create();

    fCreator.on( 'file:created', function ( e, args ) {
      cli.subtle( 'created:', args.dest );
    } );

    return fCreator.process( data, options );
  },
  run: function ( cli ) {
    var path = require( 'path' );
    var cliOpts = cli.opts;
    var extend = require( 'extend' );
    var me = this;

    var commonOpts = {
      options: {
        // the template for the file that will generate the my-icon-* classes
        fontLessTemplate: path.resolve( me.dirname, '../resources/font.less.tpl' ),
        // the template for the mixins to use this font
        fontCodesTemplate: path.resolve( me.dirname, '../resources/font-codes.mixins.tpl' ),
        // the folder where the fonts are located relative to the selection.json file
        fontsFolder: 'fonts',
        fontDefTemplate: path.resolve( me.dirname, '../resources/font.def.tpl' ),
        jsonCodesOutput: null,
        processIconName: function ( name ) {
          return name;
        }
      }
    };

    var taskTargets;

    if ( cliOpts.config ) {
      var config = cli.getConfig();
      if ( config ) {
        extend( true, commonOpts, config );
      }

      taskTargets = cli.getTargets( commonOpts, cliOpts.target );

    } else {
      if ( cliOpts._.length === 0 ) {
        cli.log( 'no file to process' );
        return;
      }
      if ( !cliOpts.output ) {
        cli.log( 'please provide an output path. use -h to show help info' );
        return;
      }

      taskTargets = [
        {
          name: 'default',
          files: [
            {
              src: cliOpts._,
              dest: cliOpts.output
            }
          ],
          options: commonOpts.options
        }
      ];
    }

    var p = taskTargets.reduce( function ( seq, target ) {
      return seq.then( me.processTargets.bind( me, target, cli ) );
    }, ES6Promise.resolve() );

    p.then( function () {
      cli.ok( 'ico-mixins done!' );
    } );
    p.catch( function ( ex ) {
      setTimeout( function () {
        throw ex;
      }, 0 );
    } );
  }
};
