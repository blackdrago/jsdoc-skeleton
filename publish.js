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
var path = require('path');

var templateHelper = require('jsdoc/util/templateHelper');
var envUtils = require('./utils/env');
var docletUtils = require('./utils/doclet');
var textUtils = require('./utils/text');
var fileUtils = require('./utils/files');
var templateUtils = require('./utils/template');

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
    var customLogicPath = path.join(envUtils.customDir(), 'publish.js');
    if (fs.existsSync(customLogicPath)) {
        var customPublish = require('./custom/publish');
        customPublish.publish(taffyData, opts, tutorials);
    } else {
        // start by creating the output directory (if it doesn't already exist)
        var outdir = envUtils.outDir();
        fileUtils.createDirectory(outdir);

        // create the two primary files
        var indexUrl = templateHelper.getUniqueFilename('index');
        var globalUrl = templateHelper.getUniqueFilename('global');
        templateHelper.registerLink('global', globalUrl);

        // establish templating
        var view = {};
        view.layout = envUtils.primaryLayoutFile();

        // setup tutorials (for templateHelper)
        templateHelper.setTutorials(tutorials);

        // prepare taffyData for processing
        var data = taffyData;
        data = templateHelper.prune(data);
        data.sort('longname, version, since');
        templateHelper.addEventListeners(data);

        // iterate over each Doclet of data
        // SEE: node_modules/jsdoc/lib/jsdoc/doclet.js
        data().each(function(doclet) {
            // process example data for this Doclet
            if (doclet.examples) {
                doclet.examples = docletUtils.processExamples(doclet);
            }

            // update any @see internal "jump" links
            if (doclet.see) {
                doclet.see.forEach( function(seeItem, index) {
                    doclet.see[index] = docletUtils.jumpHashToHtmlLink(doclet, seeItem);
                });
            }
        });

        var staticDirs = envUtils.staticDirs();
        staticDirs.forEach(function(dir) {
            fileUtils.copyAllFiles(dir, outdir);
        });
    }
}
