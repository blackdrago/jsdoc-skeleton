/**
 * @description <p>
 *                  Common environmental/setting utility functions for JSDoc templates.
 *              </p>
 * @author      K. McCormick <https://github.com/blackdrago>
 * @namespace   envUtils
 */
var env = require('jsdoc/env');

module.exports = {
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
     *              </p>
     * @param       {Array}      keys
     * @return      {mixed|null}
     */
    getConfSetting: function(keys)
    {
        if (!module.exports.confkeyExists(keys)) {
            return null;
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
