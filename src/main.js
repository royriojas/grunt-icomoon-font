var ES6Promise = require( 'es6-promise' ).Promise;

module.exports = {
  dirname: __dirname,
  processTarget: function ( data, options, name, cli ) {

    var fCreator = require( '../' ).create();
    // fCreator.on( 'files:to:process', function ( e, files ) {
    //   cli.log( files );
    // } );

    fCreator.on( 'file:created', function ( e, args ) {
      cli.subtle( 'created:', args.dest );
    } );

    return fCreator.process( data, options ).then( function () {
      if ( name ) {
        cli.success( 'task "' + name + '" completed!' );
      }
    } );
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

      taskTargets = cli.getTargets( commonOpts );

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
          name: '',
          data: {
            src: cliOpts._[ 0 ],
            dest: cliOpts.output
          },
          options: commonOpts.options
        }
      ];
    }

    var p = taskTargets.reduce( function ( seq, target ) {
      return seq.then( me.processTarget.bind( me, target.data, target.options, target.name, cli ) );
    }, ES6Promise.resolve() );

    p.then( function () {
      cli.ok( 'Done!' );
    } );
    p.catch( function ( ex ) {
      cli.error( ex );
    } );
  }
};
