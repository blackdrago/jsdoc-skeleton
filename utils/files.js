/**
 * @description <p>
 *                  Common file utility functions for JSDoc templates.
 *              </p>
 * @author      K. McCormick <https://github.com/blackdrago>
 * @namespace   fileUtils
 */
var fs = require('jsdoc/fs');
var path = require('path');

module.exports = {
    /**
     * @memberof    fileUtils
     * @function    generateFilePath
     * @description <p>
     *                  Given an target directory (e.g., an outpath) and a filename,
     *                  create the full file path name and return it.
     *              </p>
     * @param       {string} targetDir
     * @param       {string} filename
     * @return      {string}
     */
    generateFilePath: function(targetDir, filename)
    {
        return path.join(targetDir, filename);
    },
    /**
     * @memberof    fileUtils
     * @function    writeFile
     * @description <p>
     *                  Given a full output file path, content to write, and an optional
     *                  encoding value (default = utf8), write the content to the file.
     *              </p>
     * @param       {string} outpath
     * @param       {string} content
     * @param       {string} encoding (optional) defaults to utf8
     * @return      {string}
     */
    writeFile: function(outpath, content, encoding)
    {
        if (typeof encoding == 'undefined') {
            encoding = 'utf8';
        }
        fs.writeFileSync(outpath, content, encoding);
    },
    /**
     * @memberof    fileUtils
     * @function    createDirectory
     * @description <p>
     *                  Given a target directory name, create it.
     *              </p>
     * @param       {string} dir
     */
    createDirectory: function(dir)
    {
        if (!fs.existsSync(dir)
            || (fs.existsSync(dir) && !fs.statSync(dir).isDirectory())
        ) {
            fs.mkPath(dir);
        }
    },
    /**
     * @memberof    fileUtils
     * @function    allFilePaths
     * @description <p>
     *                  Given an existing directory, collect all the files within,
     *                  including files that are in subdirectories of the given directory.
     *              </p>
     * @param       {string}  dir
     * @return      {Array}
     */
    allFilePaths: function(dir)
    {
        var filepaths = new Array();
        if (!fs.existsSync(dir)) {
            console.log('Directory does not exist: ' + dir);
            return filepaths;
        }
        var files = fs.readdirSync(dir);
        files.forEach(function(file) {
            var path = module.exports.generateFilePath(dir, file);
            if (fs.statSync(path).isDirectory()) {
                var subdir = module.exports.allFilePaths(path);
                subdir.forEach(function (filepath) {
                    filepaths.push(filepath);
                });
            } else {
                filepaths.push(path);
            }
        });
        return filepaths;
    },
    /**
     * @memberof    fileUtils
     * @function    allDirPaths
     * @description <p>
     *                  Given an existing directory, identify all subdirectories within.
     *              </p>
     * @param       {string} dir
     * @return      {Array}
     */
    allDirPaths: function(dir)
    {
        var dirpaths = new Array();
        if (!fs.existsSync(dir)) {
            console.log('Directory does not exist: ' + dir);
            return dirpaths;
        }
        var files = fs.readdirSync(dir);
        files.forEach(function(file) {
            var path = module.exports.generateFilePath(dir, file);
            if (fs.statSync(path).isDirectory()) {
                dirpaths.push(path);
                var subdir = module.exports.allDirPaths(path, false);
                subdir.forEach(function (dirpath) {
                    dirpaths.push(dirpath);
                });
            }
        });
        return dirpaths;
    },
    /**
     * @memberof    fileUtils
     * @function    copyAllFiles
     * @description <p>
     *                  Given an existing directory and a target directory, copy all
     *                  files and directories in the existing directory into the target
     *                  directory, maintaining the file structure.
     *              </p>
     * @param       {string} existingDir
     * @param       {string} targetDir
     */
    copyAllFiles: function(existingDir, targetDir)
    {
        var files = module.exports.allFilePaths(existingDir);
        files.forEach(function (filepath) {
            var newpath = filepath.replace(existingDir, targetDir);
            var newdir = fs.toDir(newpath);
            module.exports.createDirectory(newdir);
            fs.copyFileSync(filepath, newdir);
        });
    },       
}
