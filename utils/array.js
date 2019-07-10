/**
 * @description <p>
 *                  Common array utility functions for JSDoc templates.
 *              </p>
 * @author      K. McCormick <https://github.com/blackdrago>
 * @namespace   arrayUtils
 */

module.exports = {
    /**
     * @memberof    arrayUtils
     * @function    size
     * @description <p>
     *                  Given an array, return its length/size. This function works for both
     *                  regular arrays and associative arrays.
     *              </p>
     *              <p>
     *                  Sizing a non-array variable results in a return of null.
     *              </p>
     * @param       {array}        arr
     * @return      {integer|null}
     */
    size: function(arr)
    {
        if (typeof arr != 'object') {
            return null;
        }
        if (arr.length == 0) {
            var counter = 0;
            for (var x in arr) {
                counter++;
            }
            if (counter > arr.length) {
                return counter;
            }
        }
        return arr.length;
    },
}
