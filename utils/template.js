/**
 * @description <p>
 *                  Common template utility functions for JSDoc templates.
 *              </p>
 * @author      K. McCormick <https://github.com/blackdrago>
 * @namespace   templateUtils
 */
var path = require('path');
var fs = require('fs');
var envUtils = require('./env');

module.exports = {
    /**
     * @memberof    templateUtils
     * @function    templateDir
     * @description <p>
     *                  Return the full path for the template directory. If the optional
     *                  boolean flag is passed, return the <strong>custom</strong> 
     *                  template directory.
     *              </p>
     * @param       {boolean} returnCustom - (optional) defaults to false
     * @return      {string}
     */
    templateDir: function(returnCustom)
    {
        if (typeof returnCustom == 'undefined') {
            returnCustom = false;
        }
        if (returnCustom) {
            var dir = envUtils.customDir();
        } else {
            var dir = envUtils.baseDir();
        }
        return path.join(dir, 'tmpl');
    },
    /**
     * @memberof    templateUtils
     * @function    loadView
     * @description <p>
     *                  Given the name of a view file, identify the full path
     *                  of the file and return it.
     *              </p>
     *              <p>
     *                  <strong>Note</strong>: This function checks for customized
     *                  versions of the view <em>first</em>. If have a custom version of
     *                  a template file in the custom directory, it will essentially 
     *                  overwrites the core template file.
     *              </p>
     * @param       {string} viewName     - the name of the view
     * @param       {string} fileEnding   - (optional) defaults to tmpl
     *                                      do NOT include period in file ending
     * @return      {string|null}
     */
    loadView: function(viewName, fileEnding)
    {
        if (typeof fileEnding == 'undefined') {
            fileEnding = 'tmpl';
        }
        var tempdir = module.exports.templateDir();
        var customdir = module.exports.templateDir(true);
        var filename = viewName + '.' + fileEnding;
        var customFile = path.join(customdir, filename);
        var defaultFile = path.join(tempdir, filename);
        // check if custom exists first
        if (fs.existsSync(customFile)) {
            return customFile;
        }
        if (fs.existsSync(defaultFile)) {
            return defaultFile;
        }
        // the given view does not exist, which hopefully is a typo
        console.log("Attempted to load view " + viewName
            + " (" + filename + ") "
            + " but neither custom nor default file exists.\n"
            + "Please confirm the view name spelling (" + viewName + ") "
            + " and the assigned file ending (" + fileEnding + ").\n"
            + "The full file paths that were checked are as follows: "
            + "\n\t" + customFile
            + "\n\t" + defaultFile
        );
        return null;
    },
    /**
     * @memberof    templateUtils
     * @function    primaryLayoutFile
     * @description <p>
     *                  Return the primary layout view.
     *              </p>
     * @return      {string}
     */
    primaryLayoutFile: function()
    {
        var keys = ['default', 'layoutFile'];
        if (module.exports.confkeyExists(keys)) {
            var filepath = module.exports.getConfSetting(keys);
            var filename = path.basename(filepath);
            // check if their is a custom version
            
            return path.getResourcePath(
                path.dirname(pathname),
                path.basename(pathname)
            );
        }
        return 'layout.tmpl';
    },
}
