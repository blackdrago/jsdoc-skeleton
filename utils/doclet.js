/**
 * @description <p>
 *                  Common Doclet (aka JSDoc comment) utility functions for JSDoc templates.
 *              </p>
 * @author      K. McCormick <https://github.com/blackdrago>
 * @namespace   docletUtils
 */
var path = require('path');
var util = require('util');
var templateHelper = require('jsdoc/util/templateHelper');
var arrayUtils = require('./array');
var htmlUtils = require('./html');

module.exports = {
    /**
     * @memberof    docletUtils
     * @function    isDoclet
     * @description <p>
     *                  Given an variable, check if it is a Doclet.
     *              </p>
     * @param       {mixed}   obj
     * @return      {boolean}
     */
    isDoclet: function(obj)
    {
        if (obj === null || typeof obj != 'object') {
            return false;
        }
        return obj.constructor.name == 'Doclet';
    },
    /**
     * @memberof    docletUtils
     * @function    assignIdFromLongNameToUrl
     * @description <p>
     *                  Given Doclet, assign its ID value based on its long name and URL.
     *              </p>
     *              <p>
     *                  If the Doclet URL has no hash jumps (#), then its id will be the
     *                  value of its assigned name property. For Doclets that have URLs
     *                  with hash jumps (#), the assigned id is the value that appears
     *                  after the last hash in the URL.
     *              </p>
     * @param       {module:jsdoc/doclet.Doclet} doclet
     * @return      {module:jsdoc/doclet.Doclet} doclet
     */
    assignIdFromLongNameToUrl: function(doclet)
    {
        if (!module.exports.isDoclet(doclet)) {
            return doclet;
        }
        var longUrl = templateHelper.longnameToUrl[doclet.longname];
        if (longUrl.indexOf('#') === -1) {
            doclet.id = doclet.name;
        } else {
            doclet.id = longUrl.split(/#/).pop();
        }
        return doclet;
    },
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
        if (!module.exports.isDoclet(doclet)
            || !doclet || !doclet.meta || !doclet.meta.filename
        ) {
            return null;
        }
        return path.join(doclet.meta.path || '', doclet.meta.filename);
    },
    /**
     * @memberof    docletUtils
     * @function    hasSignature
     * @description <p>
     *                  Given a Doclet, check if its type or kind requires or has
     *                  a signature component. If a non-Doclet is passed, this function
     *                  returns false.
     *              </p>
     *              <p>
     *                  Currently, the following Doclets have signatures:
     *              </p>
     *              <ul>
     *                  <li>function (doclet.kind == function)</li>
     *                  <li>class (doclet.kind == class)</li>
     *                  <li>
     *                      typedef (doclet.kind == typedef) that has at least one
     *                      function (doclet.type.names[someIndex] == function)
     *                  </li>
     *              </ul>
     * @param       {module:jsdoc/doclet.Doclet} doclet
     * @return      {boolean}
     */
    hasSignature: function(doclet)
    {
        if (module.exports.isDoclet(doclet)) {
            if (['function', 'class'].indexOf(doclet.kind) !== -1) {
                return true;
            } else if (doclet.kind == 'typedef' && doclet.type && doclet.type.names
                && doclet.type.names.length > 0
            ) {
                var lengther = doclet.type.names.length;
                for (var n = 0; n < lengther; n++) {
                    if (doclet.type.names[n].toLowerCase() === 'function') {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    /**
     * @memberof    docletUtils
     * @function    assignSignatureComponents
     * @description <p>
     *                  Given a Doclet, assess if it has a signature, and if so, add
     *                  all vital components to the Doclet.
     *              </p>
     * @param       {module:jsdoc/doclet.Doclet} doclet
     * @return      {module:jsdoc/doclet.Doclet}
     */
    assignSignatureComponents: function(doclet)
    {
        if (!module.exports.hasSignature(doclet)) {
            return doclet;
        }
        // FIRST: handle doclet parameters
        if (doclet.params) {
            var params = doclet.params ? doclet.params : [];
            // remove any params that are missing names or whose names contain a period
            params = params.filter(function(param) {
                return param.name && param.name.indexOf('.') === -1;
            });
            // update the parameter names given the associated signature attributes
            params = params.map(function (param) {
                // collect the markers ("tags") for this parameter
                var markers = [];
                if (param.optional) {
                    markers.push('opt');
                }
                if (param.nullable === true) {
                    markers.push('nullable');
                } else if (param.nullable === false) {
                    markers.push('non-null');
                }
                var name = param.name || '';
                // if this is a variable, add horizontal elipsis to its name
                if (param.variable) {
                    name = '&hellip;' + name;
                }
                // given the signature attributes, assign "tags" to mark it
                if (arrayUtils.size(markers) > 0) {
                    // TODO: consider making the signature-attributes markup a style setting
                    name = util.format(
                        '%s<span class="signature-attributes">%s</span>',
                        name,
                        markers.join(',' )
                    );
                }
                return name;
            });
        } else {
            var params = [];
        }
        doclet.signature = util.format(
            '%s(%s)',
            (doclet.signature || ''),
            params.join(', ')
        );

        // SECOND: Handle signature returns (e.g., the return type)
        // jam all the return-type attributes into an array. this could create odd
        // results (for example, if there are both nullable and non-nullable return types),
        // but let's assume that most people who use multiple @return tags aren't using
        // Closure Compiler type annotations, and vice-versa
        var returnTypes = [];
        var source = doclet.yields || doclet.returns;
        if (source) {
            var attribs = [];
            source.forEach(function(item) {
                templateHelper.getAttribs(item).forEach(function(attrib) {
                    if (attribs.indexOf(attrib) === -1) {
                        attribs.push(attrib);
                    }
                });
            });
            var attribsString = htmlUtils.generateAttributeMarkers(attribs);
            if (doclet.returns) {
                doclet.returns.forEach(function(returnType) {
                    returnTypes = returnTypes.concat(
                        module.export.buildItemTypeStrings(returnType)
                    );
                });
            }
        } else {
            var attribsString = '';
        }
        if (arrayUtils.size(returnTypes) > 0) {
            var returnTypesString = util.format(
                ' &rarr; %s{%s}',
                attribsString,
                returnTypes.join('|')
            );
        } else {
            var returnTypesString = '';
        }
        // now format and assign the new return markers
        doclet.signature = '<span class="signature">'
            + (doclet.signature || '') + '</span>'
            + '<span class="type-signature">'
            + returnTypesString + '</span>';
        return doclet;
    },
    /**
     * @memberof    docletUtils
     * @function    buildItemTypeStrings
     * @description <p>
     *                  
     *                  
     *              </p>
     * @param       {object} item
     * @return      {array}
     */
    buildItemTypeStrings: function(item)
    {
        var types = [];
        if (item && item.type && item.type.names) {
            item.type.names.forEach(function(name) {
                types.push(templateHelper.linkto(name, htmlUtils.htmlsafe(name)));
            });
        }
        return types;
    },
    /**
     * @memberof    docletUtils
     * @function    addAttribsProperty
     * @description <p>
     *                  Given a Doclet, add a formatted version of its attribs property.
     *              </p>
     * @param       {module:jsdoc/doclet.Doclet} doclet
     * @return      {module:jsdoc/doclet.Doclet}
     */
    addAttribsProperty: function(doclet)
    {
        if (module.exports.isDoclet(doclet)) {
            var attrs = templateHelper.getAttribs(doclet);
            var attrStr = htmlUtils.generateAttributeMarkers(attrs);
            doclet.attribs = util.format('<span class="type-signature">%s</span>', attrStr);
        }
        return doclet;
    },
    /**
     * @memberof    docletUtils
     * @function    addSignatureTypes
     * @description <p>
     *                  
     *              </p>
     * @param       {module:jsdoc/doclet.Doclet} doclet
     * @return      {module:jsdoc/doclet.Doclet}
     */
    addSignatureTypes: function(doclet)
    {
        if (module.exports.isDoclet(doclet)) {
            if (doclet.type) {
                var types = module.exports.buildItemTypeStrings(doclet);
            } else {
                var types = [];
            }
            // if types exist,  assign a signature or append to the existing signature
            if (types.length > 0) {
                doclet.signature = (doclet.signature || '')
                    + '<span class="icon bg-yellow">'
                    + types.join('|')
                    + '</span>';
            }
        }
        return doclet;
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
    /**
     * @memberof    docletUtils
     * @function    addSourceFilePath
     * @description <p>
     *                  Given an array of objects that represent Doclet source files, 
     *                  extract this doclet's source file and add it to the array.
     *              </p>
     * @param       {array}                      sourceFiles
     * @param       {module:jsdoc/doclet.Doclet} doclet
     * @return      {array}
     */
    addSourceFilePath: function(sourceFiles, doclet)
    {
        var sourcePath = module.exports.filePath(doclet);
        if (sourcePath != null) {
            sourceFiles[sourcePath] = {
                fullPath: sourcePath,
                relativePath: null
            };
        }
        return sourceFiles;
    },
}
