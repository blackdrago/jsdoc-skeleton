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
var path = require('jsdoc/path');

var templateHelper = require('jsdoc/util/templateHelper');
var envUtils = require('./utils/env');
var docletUtils = require('./utils/doclet');
var arrayUtils = require('./utils/array');
var textUtils = require('./utils/text');
var htmlUtils = require('./utils/html');
var fileUtils = require('./utils/files');
var viewUtils = require('./utils/view');
var templateUtils = require('./utils/template');
var navUtils = require('./utils/nav');


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

        // copy over all the static files
        var staticDirs = envUtils.staticDirs();
        staticDirs.forEach(function(dir) {
            fileUtils.copyAllFiles(dir, outdir);
        });

        // create the two primary files
        var indexUrl = templateHelper.getUniqueFilename('index');
        var globalUrl = templateHelper.getUniqueFilename('global');
        templateHelper.registerLink('global', globalUrl);

        // setup tutorials (for templateHelper)
        templateHelper.setTutorials(tutorials);

        // prepare taffyData for processing
        var data = taffyData;
        data = templateHelper.prune(data);
        data.sort('longname, version, since');
        templateHelper.addEventListeners(data);

        // iterate over each Doclet of data
        // SEE: node_modules/jsdoc/lib/jsdoc/doclet.js
        var sourceFiles = [];
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

            // if this doclet has a source path, add it to our known sources
            sourceFiles = docletUtils.addSourceFilePath(sourceFiles, doclet);
        });

        // if sourceFiles exist, make sure they've got 'relativePath' values
        if (arrayUtils.size(sourceFiles) > 0) {
            sourceFiles = fileUtils.mapRelativePaths(
                sourceFiles,
                path.commonPrefix(Object.keys(sourceFiles))
            );
        }

        // iterate over the Doclets again and assign relativePaths
        data().each(function(doclet) {
            var url = templateHelper.createLink(doclet);
            templateHelper.registerLink(doclet.longname, url);
            var docletPath = docletUtils.filePath(doclet);
            if (docletPath != null && sourceFiles.indexOf(docletPath) != -1) {
                doclet.meta.shortpath = sourceFiles[docletPath].relativePath;
            }
            // assign the doclet ID
            doclet = docletUtils.assignIdFromLongNameToUrl(doclet);

            // assign signature components, if necessary
            doclet = docletUtils.assignSignatureComponents(doclet);

            // assign attributes
            doclet = docletUtils.addAttribsProperty(doclet);
        });

        // iteration #3 over doclets (must be done AFTER all URLs are generated)
        data().each(function(doclet) {
            // NOTE: this function allows for a third optional parameter of 'class'
            //       e.g., CSS class to assign to ancestor links
            doclet.ancestors = templateHelper.getAncestorLinks(data, doclet);

            // given a doclet kind, assign associated signatures and attributes
            if (['member', 'constant'].indexOf(doclet.kind)) {
                doclet = docletUtils.addSignatureTypes(doclet);
                doclet = docletUtils.addAttribsProperty(doclet);
                doclet.kind = 'member';
            }
        });

        // TODO: complete this (still in progress)
        var members = templateHelper.getMembers(data);
        members.tutorials = tutorials.children;

        // check if we output pretty-print source files - and if so, generate them
        // so that other files can link to them
        var outSourceFiles = envUtils.getConfSetting(['default', 'outputSourceFiles'], false);
        if (outSourceFiles) {
            // TODO: code this
            // generateSourceFiles(sourceFiles, opts.encoding);
        }

        // establish templating, assign configuration settings, and augment it with helpers
        var view = {};
        view.layout = envUtils.primaryLayoutFile();
        view.outputSourceFiles = outSourceFiles;
        view.linkto = templateHelper.linkto;
        view.resolveAuthorLinks = templateHelper.resolveAuthorLinks;
        view.tutoriallink = htmlUtils.tutorialLink;
        view.htmlsafe = htmlUtils.htmlsafe;
        // special case: find function - wrap it so that view can call find(needle)
        //               without specifying the haystack over and over again
        view.find = function(needle) {
            return templateHelper.find(data, needle);
        };

        // now that the essentials have been established, build the navigation menu
        // TODO: complete this (still in development)
        //view.nav = navUtils.generate(members);
    }
}
