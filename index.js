var path = require( 'path' );
var extend = require( 'extend' );
var readJSON = require( 'read-json-sync' );
var expand = require( 'glob-expand' );
var dispatchy = require( 'dispatchy' );

var sFormat = require( 'stringformat' );
var ES6Promise = require( 'es6-promise' ).Promise;
var thenify = require( 'thenify' );
var pCopy = thenify( require( 'copy' ) );

var read = function ( _path ) {
  return require( 'fs' ).readFileSync( _path, { encoding: 'utf8' } );
};

var write = require( 'write' ).sync;

var fontCreator = extend( dispatchy.create(), {
  process: function ( dataEntry, opts ) {
    var me = this;
    return new ES6Promise( function ( resolve, reject ) {
      try {
        var dest = path.resolve( dataEntry.dest );
        var mixinsDest = dest.replace( /\.less$/g, '.mixins.less' );
        var fontDefDest = dest.replace( /\.less$/g, '.def.less' );

        var destDir = path.dirname( mixinsDest );
        var mixinsFile = path.basename( mixinsDest );
        var fontDefFile = path.basename( fontDefDest );

        var jsonFontDescriptor = path.resolve( dataEntry.src );

        var rawData = readJSON( jsonFontDescriptor );

        var prefix = rawData.preferences.fontPref.prefix;

        var fontData = {
          name: rawData.metadata.name,
          prefix: prefix,
          icons: rawData.icons.map( function ( icon ) {
            var name = icon.properties.name;
            var iconName = opts.processIconName( name );
            return {
              name: iconName,
              hexCode: '\\' + (icon.properties.code).toString( 16 ),
              className: prefix + iconName
            };
          } )
        };

        var relativePath = path.resolve( path.join( path.dirname( jsonFontDescriptor ), opts.fontsFolder ) );
        var sourceFiles = path.join( relativePath, '**/*.*' );
        var filesToProcess = expand( sourceFiles );

        me.fire( 'files:to:process', filesToProcess );

        var dot = require( 'dot' );

        // make dot do not remove the line breaks
        var compileOptions = { strip: false };

        // why dot why!!!!: dot don't use defaults, if a template setting is passed here it will
        // completely override the defaults, so we need to extend from the default options and override
        // the one we want to change!...
        // again... why dot why?
        var templateSettings = extend( { }, dot.templateSettings, compileOptions );
        var renderCodeFonts = dot.template( read( path.resolve( opts.fontCodesTemplate ) ), templateSettings );
        var renderFontsLess = dot.template( read( path.resolve( opts.fontLessTemplate ) ), templateSettings );
        var renderFontDef = dot.template( read( path.resolve( opts.fontDefTemplate ) ), templateSettings );

        var fData = {
          fontData: fontData, mixinsFile: mixinsFile, fontDefFile: fontDefFile
        };

        var mixinText = renderCodeFonts( fData );
        var lessText = renderFontsLess( fData );
        var fontText = renderFontDef( fData );

        write( mixinsDest, mixinText );

        me.fire( 'file:created', {
          type: 'mixin less file',
          dest: mixinsDest
        } );

        write( fontDefDest, fontText );

        me.fire( 'file:created', {
          type: 'def less file',
          dest: fontDefDest
        } );

        write( dest, lessText );

        me.fire( 'file:created', { type: 'main less file', dest: dest } );


        var jsonCodesOutput = opts.jsonCodesOutput;
        if ( jsonCodesOutput ) {
          jsonCodesOutput = path.resolve( jsonCodesOutput );
          write( jsonCodesOutput, sFormat( 'var fontData = {0}', JSON.stringify( fontData, null, 2 ) ) );
          me.fire( 'file:created', {
            type: 'JSON Metadata',
            dest: jsonCodesOutput
          } );
        }

        var p = filesToProcess.reduce( function ( seq, entry ) {
          return seq.then( function () {
            var baseName = path.basename( entry );
            // convert filename to lowercase to allow consistency
            var outputDir = path.join( destDir, opts.fontsFolder );

            return pCopy( entry, outputDir ).then( function () {
              me.fire( 'file:created', {
                type: 'font file',
                dest: path.join( outputDir, baseName )
              } );
            } );
          } );
        //grunt.log.ok( 'File created: ' + outputFileName );
        }, ES6Promise.resolve() );

        p.then( resolve, reject );

      } catch (ex) {
        reject( ex );
      }
    } );
  }
} );

module.exports = {
  create: function () {
    var ins = Object.create( fontCreator );
    return ins;
  }
};
