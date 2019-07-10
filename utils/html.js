/**
 * @description <p>
 *                  Common HTML utility functions for JSDoc templates.
 *              </p>
 * @author      K. McCormick <https://github.com/blackdrago>
 * @namespace   htmlUtils
 */
var util = require('util');
var templateHelper = require('jsdoc/util/templateHelper');
var arrayUtils = require('./array');

module.exports = {
    /**
     * @memberof    htmlUtils
     * @function    generateAttributeMarkers
     * @description <p>
     *                  Given an array of attributes collected from a Doclet component,
     *                  generate the markup for displaying said attributes.
     *              </p>
     * @param       {array}  attributes
     * @return      {string}
     */
    generateAttributeMarkers: function(attributes)
    {
        if (arrayUtils.size(attributes) == 0) {
            return '';
        }
        return util.format(
            '<span class="icon bg-red">%s</span> ',
            attributes.join('</span>, <span class="icon bg-red">')
        );
    },
    /**
     * @memberof    htmlUtils
     * @function    tutorialLink
     * @description <p>
     *                  Given a tutorial object, return the associated tutorial link.
     *              </p>
     * @param       {object} tutorial
     * @return      {string}
     */
    tutorialLink: function(tutorial)
    {
        // TODO: double check the 'disbled' classname thing)
        return templateHelper.toTutorial(tutorial, null, {
            tag: 'em', 
            classname: 'disabled', 
            prefix: 'Tutorial: '
        });
    },
    /**
     * @memberof    htmlUtils
     * @function    htmlsafe
     * @description <p>
     *                  Return an HTML-safe string (safe for using as an attribute name).
     *              </p>
     * @param       {string} str
     * @return      {string}
     */
    htmlsafe: function(str)
    {
        return templateHelper.htmlsafe(str);
    },
}
