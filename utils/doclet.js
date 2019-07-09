/**
 * @description <p>
 *                  Common Doclet (aka JSDoc comment) utility functions for JSDoc templates.
 *              </p>
 * @author      K. McCormick <https://github.com/blackdrago>
 * @namespace   docletUtils
 */
var path = require('path');
var templateHelper = require('jsdoc/util/templateHelper');

module.exports = {
    /**
     * @memberof    docletUtils
     * @function    filePath
     * @description <p>
     *                  Given a JSDoc Doclet, return the full file path or NULL if it
     *                  does not exist.
     *              </p>
     * @param       {module:jsdoc/doclet.Doclet} doclet
     * @return      {string|null}
     */
    filePath: function(doclet)
    {
        if (doclet.constructor.name != 'Doclet'
            || !doclet || !doclet.meta || !doclet.meta.filename
        ) {
            return null;
        }
        return path.join(doclet.meta.path || '', doclet.meta.filename);
    },
    /**
     * @memberof    docletUtils
     * @function    jumpHashToHtmlLink
     * @description <p>
     *                  Given a JSDoc Doclet and an associated jump/hash value, return
     *                  an HTML link.
     *              </p>
     * @param       {module:jsdoc/doclet.Doclet} doclet
     * @param       {string}                     hash
     * @return      {string|null}
     */
    jumpHashToHtmlLink: function(doclet, hash)
    {
        // a jump tag always starts with a hashtag (#) and has at least one character after
        if ( !/^(#.+)/.test(hash) ) {
            return hash;
        }
        var url = templateHelper.createLink(doclet);
        url = url.replace(/(#.+|$)/, hash);
        return '<a href="' + url + '">' + hash + '</a>';
    },
    /**
     * @memberof    docletUtils
     * @function    processExamples
     * @description <p>
     *                  Given a JSDoc Doclet that has examples, process them so that
     *                  they are appropriately split into code and caption strings.
     *              </p>
     * @param       {module:jsdoc/doclet.Doclet} doclet
     * @return      {object}
     */
    processExamples: function(doclet)
    {
        return doclet.examples.map( function(example) {
            // TODO: test/prune this regex
            if (example.match(/^\s*<caption>([\s\S]+?)<\/caption>(\s*[\n\r])([\s\S]+)$/i)) {
                return {
                    caption: RegExp.$1,
                    code: RegExp.$3
                };
            }
            return {
                caption: '',
                code: example
            };
        });
    },
}
