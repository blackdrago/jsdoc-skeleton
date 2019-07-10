/**
 * @description <p>
 *                  Common navigation utility functions for JSDoc templates.
 *              </p>
 * @author      K. McCormick <https://github.com/blackdrago>
 * @namespace   navUtils
 */
var helper = require('jsdoc/util/templateHelper');
var arrayUtils = require('./array');
var envUtils = require('./env');

module.exports = {
    tutorialHeading: envUtils.getConfSetting(['templates', 'tabNames', 'tutorials']),
    // TODO: make the default values customize/configurable?
    useLongNames: envUtils.getConfSetting(['templates', 'default', 'useLongnameInNav', true]),
    useCollapsibles: envUtils.getConfSetting(['templates', 'useCollapsibles'], true),
    /**
     * @memberof    navUtils
     * @function    extractElementDisplayName
     * @description <p>
     *                  Given an element for navigation, return the appropriate
     *                  display name based on the element type and the config settings.
     *                  The display name is either the "name" property or the "longname"
     *                  property.
     *              </p>
     *              <p>
     *                  The display name is the "longname" property in the following
     *                  circumstances:
     *              </p>
     *              <ul>
     *                  <li>
     *                      The configuration sets useLongnameInNav to true
     *                      (env.conf.templates.default.useLongnameInNav)
     *                  </li>
     *                  <li>
     *                      The element is a namespace
     *                  </li>
     *              </ul>
     * @param       {object} element
     * @return      {string}
     */
    extractElementDisplayName: function(element)
    {
        if (module.exports.useLongNames || element.kind === 'namespace') {
            return element.longname;
        }
        return element.name;
    },
    /**
     * @memberof    navUtils
     * @function    generateMember
     * @description <p>
     *                  Given a subset of members (e.g., classes, tutorials, etc.), generate
     *                  the navigation markup for the subset.
     *              </p>
     * @param       {array}    elements
     * @param       {string}   heading
     * @param       {object}   visibleElements
     * @param       {function} linkToFunc
     * @return      {string}
     */
    generateMember: function(elements, heading, visibleElements, linkToFunc)
    {
        var nav = '';
        if (arrayUtils.size(elements) > 0) {
            var generateFunction = module.exports.useCollapsibles
                ? module.exports.htmlWithCollapse
                : module.exports.htmlWithoutCollapse;
            // TODO: evaluate classname based on heading (specific to tutorials)
            //       this should be either configurable or customizable
            if (heading == envUtils.getConfSetting(['templates', 'tabNames', 'tutorials'])) {
                var className = 'examples hidden';
            } else {
                var className = 'api hidden';
            }
            var elementsNav = '';
            elements.forEach(function(element) {
                if (!hasOwnProp.call(element, 'longname')) {
                    elementsNav += '<li>'
                        + linktoFunc('', element.name)
                        + module.exports.generateSubNav(element)
                        + '</li>';
                } else if (!hasOwnProp.call(visibleElements, element.longname)) {
                    var displayName = module.exports.extractElementDisplayName(element);
                    var linkHtml = linkToFunc(
                        element.longname,
                        displayName.replace(/\b(module|event):/g, '')
                    );
                    elementsNav += generateFunction(element, linkHtml);
                }
                visibleElements[element.longname] = true;
            });
            if (elementsNav !== '') {
                nav += '<div class="' + className + '"><h3>'
                    + heading + '</h3><ul>'
                    + elementsNav + '</ul></div>';
            }
        }
        return nav;
    },
    /**
     * @memberof    navUtils
     * @function    generateSubNav
     * @description <p>
     *                  //
     *                  //
     *              </p>
     * @param       {string} ?
     * @return      {string}
     */
    generateSubnav: function()
    {
        return 'rawr';
    },
    /**
     * @memberof    navUtils
     * @function    generate
     * @description <p>
     *                  //
     *                  //
     *              </p>
     * @param       {string} ?
     * @return      {string}
     */
    generate: function()
    {
        return 'rawr';
    },
    /**
     * @memberof    navUtils
     * @function    htmlWithCollapse
     * @description <p>
     *                  //
     *                  //
     *              </p>
     * @param       {string} ?
     * @return      {string}
     */
    htmlWithCollapse: function()
    {
        return 'rawr';
    },
    /**
     * @memberof    navUtils
     * @function    htmlWithoutCollapse
     * @description <p>
     *                  //
     *                  //
     *              </p>
     * @param       {string} ?
     * @return      {string}
     */
    htmlWithoutCollapse: function()
    {
        return 'rawr';
    },
}
