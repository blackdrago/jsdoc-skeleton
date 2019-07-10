/**
 * @description <p>
 *                  Common environmental/setting utility functions for JSDoc templates.
 *              </p>
 * @author      K. McCormick <https://github.com/blackdrago>
 * @namespace   envUtils
 */
var env = require('jsdoc/env');
var path = require('path');

module.exports = {
    /**
     * @memberof    envUtils
     * @function    baseDir
     * @description <p>
     *                  Return the base directory of this template.
     *              </p>
     * @return      {string}
     */
    baseDir: function()
    {
        return path.normalize(module.exports.getSetting('template'));
    },
    /**
     * @memberof    envUtils
     * @function    customDir
     * @description <p>
     *                  Return the custom directory of this template.
     *              </p>
     * @return      {string}
     */
    customDir: function()
    {
        return path.join(module.exports.baseDir(), 'custom');
    },
    /**
     * @memberof    envUtils
     * @function    outDir
     * @description <p>
     *                  Return the output directory for this template.
     *              </p>
     * @return      {string}
     */
    outDir: function()
    {
        return path.normalize(module.exports.getSetting('destination'));
    },
    /**
     * @memberof    envUtils
     * @function    primaryLayoutFile
     * @description <p>
     *                  Return the primary layout as defined in the configuration
     *                  setting: conf.default.layoutFile
     *              </p>
     * @return      {string}
     */
    primaryLayoutFile: function()
    {
        var keys = ['default', 'layoutFile'];
        if (module.exports.confkeyExists(keys)) {
            // since this is a configuration setting, don't check for a custom version
            var pathname = module.exports.getConfSetting(keys);
            return path.getResourcePath(
                path.dirname(pathname),
                path.basename(pathname)
            );
        }
        return 'layout.tmpl';
    },
    /**
     * @memberof    envUtils
     * @function    staticDirs
     * @description <p>
     *                  Return an array of one or more static directories.
     *              </p>
     * @return      {array}
     */
    staticDirs: function()
    {
        var keys1 = [ 'templates', 'default', 'staticFiles', 'include' ];
        var keys2 = [ 'templates', 'default', 'staticFiles', 'paths' ];
        var dirs = new Array();
        if (module.exports.confkeyExists(keys1)) {
            var dirpaths = module.exports.getConfSetting(keys1);
            for(var d in dirpaths) {
                dirs.push(dirpaths[d]);
            }
        }
        if (module.exports.confkeyExists(keys2)) {
            var dirpaths = module.exports.getConfSetting(keys2);
            for(var d in dirpaths) {
                dirs.push(dirpaths[d]);
            }
        }
        return dirs;
    },
    /**
     * @memberof    envUtils
     * @function    templatePath
     * @description <p>
     *                  Return the assigned template path.
     *              </p>
     * @return      {string}
     */
    templatePath: function()
    {
        return path.normalize(module.exports.getSetting('template'));
    },
    /**
     * @memberof    envUtils
     * @function    scopeExists
     * @description <p>
     *                  Given an enviromental scope, check if it exists.
     *              </p>
     * @param       {string}  scope
     * @return      {boolean}
     */
    scopeExists: function(scope)
    {
        return typeof env[scope] !== 'undefined';
    },
    /**
     * @memberof    envUtils
     * @function    validSetting
     * @description <p>
     *                  Given an environmental key and scope, check if it exists.
     *              </p>
     * @param       {string}  key
     * @param       {string}  scope
     * @return      {boolean}
     */
    validSetting: function(key, scope)
    {
        if (typeof env[scope] == 'undefined') {
            console.log('Unknown environmental scope: ' + scope);
            return false;
        }
        if (typeof env[scope][key] == 'undefined') {
            console.log('Unknown environmental key: ' + key
                + ' (full name: env.'
                + scope
                + '.'
                + key
                + ')'
            );
            return false;
        }
        return true;
    },
    /**
     * @memberof    envUtils
     * @function    getSetting
     * @description <p>
     *                  Given a setting key and an optional scope key, return the value of
     *                  the setting if it exists. Otherwise, return NULL.
     *              </p>
     * @param       {string}     key
     * @param       {string}     scope  (optional) defaults to opts
     * @return      {mixed|null}
     */
    getSetting: function(key, scope)
    {
        if (typeof scope == 'undefined') {
            scope = 'opts';
        }
        if (!module.exports.validSetting(key, scope)) {
            return null;
        }
        return env[scope][key];
    },
    /**
     * @memberof    envUtils
     * @function    setSetting
     * @description <p>
     *                  Given a value for a setting, a setting key, and an optional 
     *                  scope key, assign the new value as a setting.
     *              </p>
     * @param       {mixed}      value
     * @param       {string}     key
     * @param       {string}     scope  (optional) defaults to opts
     */
    setSetting: function(value, key, scope)
    {
        if (typeof scope == 'undefined') {
            scope = 'opts';
        }
        if (!module.exports.scopeExists(scope)) {
            env[scope] = {};
        }
        env[scope][key] = value;
    },
    /**
     * @memberof    envUtils
     * @function    confkeyExists
     * @description <p>
     *                  Given a structured array for a config setting key, check if it
     *                  exists.
     *              </p>
     * @param       {Array}   keys
     * @return      {boolean}
     */
    confkeyExists: function(keys)
    {
        var keyhole = env.conf;
        for(var k in keys) {
            if (typeof keyhole[keys[k]] != 'undefined') {
                keyhole = keyhole[keys[k]];
            } else {
                return false;
            }
        }
        return true;
    },    
    /**
     * @memberof    envUtils
     * @function    getConfSetting
     * @description <p>
     *                  Given a structured array for a config setting key, return the value.
     *                  If a second parameter is passed, it will act as the default value
     *                  for the requested setting. This value will <strong>only</strong>
     *                  be returned if this function would otherwise return null.
     *              </p>
     * @param       {Array}      keys
     * @param       {mixed}      defaultValue (optional) only returned if setting is null
     * @return      {mixed|null}
     */
    getConfSetting: function(keys, defaultValue)
    {
        if (typeof defaultValue == 'undefined') {
            defaultValue = null;
        }
        if (!module.exports.confkeyExists(keys)) {
            return defaultValue;
        }
        var keyhole = env.conf;
        for(var k in keys) {
            keyhole = keyhole[keys[k]];
        }
        return keyhole;
    },
    /**
     * @memberof    envUtils
     * @function    setConfSetting
     * @description <p>
     *                  Given a new configuration setting value and its config key,
     *                  set the configuration value.
     *              </p>
     * @param       {string} value
     * @param       {array}  keys
     */
    setConfSetting: function(value, keys)
    {
        var keyhole = env.conf;
        var lastKey = keys.pop();
        for(var k in keys) {
            if (typeof keyhole[keys[k]] == 'undefined') {
                keyhole = keyhole[keys[k]] = {};
            }
            keyhole = keyhole[keys[k]];
        }
        keyhole[lastKey] = value;
    },
    /**
     * @memberof    envUtils
     * @function    extendConfSetting
     * @description <p>
     *                  Given an object of attributes and an existing configuration setting
     *                  key, extend the existing configuration setting by adding the new
     *                  attributes.
     *              </p>
     * @param       {object} attributes
     * @param       {array}  keys
     */
    extendConfSetting: function(attributes, keys)
    {
        if (module.exports.confkeyExists(keys)) {
            var setting = module.exports.getConfSetting(keys);
            for(var a in attributes) {
                setting[a] = attributes[a];
            }
        } else {
            console.log('Cannot extend a setting that does not exist: ');
            console.log(keys);
        }
    },
}
