/**
 * @namespace  jsdoc-skeleton
 * @description <p>
 *                  //
 *              </p>
 * @author      K. McCormick <https://github.com/blackdrago>
 */
// TODO: remove this
var fs = require ('jsdoc/fs');
var env = require('jsdoc/env');

var envUtils = require('./utils/env');
var textUtils = require('./utils/text');
var fileUtils = require('./utils/files');

/**
 * @memberof    jsdoc-skeleton
 * @function    publish
 * @description <p>
 *                  //
 *              </p>
 * @param       {TAFFY}    taffyData
 * @param       {object}   opts
 * @param       {Tutorial} tutorials
 * @see         {@link http://taffydb.com/|TaffyDB}
 */
exports.publish = function(taffyData, opts, tutorials)
{
    var html = '<p>Testing!</p>';
    fs.writeFileSync('output/thisFile.html', html, 'utf8');
}
