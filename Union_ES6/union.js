/**
 * Returns the union of two arrays while preserving order and removing duplicates.
 * - Uses a Set to handle primitive values efficiently.
 * - Uses deep equality checks to handle objects and arrays.
 * - Preserves the order of elements from arr1 and then arr2.
 *
 * @param {Array} arr1 - The first input array.
 * @param {Array} arr2 - The second input array.
 * @returns {Array} A new array containing the union of arr1 and arr2 without duplicates.
 * @throws {TypeError} If inputs are not valid arrays or if arguments count is incorrect.
 */
function union(arr1, arr2) {
    if (arguments.length !== 2) {
        throw new TypeError("union function expects exactly two arguments.");
    }
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        throw new TypeError("Both arguments must be arrays.");
    }

    const primitiveSet = new Set();
    const result = [];

    /**
     * Checks if the given item already exists in the result.
     * - Uses Set for primitive types.
     * - Uses deep equality check for objects and arrays.
     * 
     * @param {*} item - The item to check for duplication.
     * @returns {boolean} True if the item already exists, false otherwise.
     */
    function isDuplicate(item) {
        if (typeof item !== 'object' || item === null) {
            return primitiveSet.has(item);
        }
        return result.some(existingItem => deepEqual(existingItem, item));
    }

    /**
     * Adds an item to the result array if it's not a duplicate.
     * - Primitives are added to the Set for quick lookups.
     * - Objects and arrays are compared with deep equality.
     * 
     * @param {*} item - The item to be added to the result.
     */
    function addToResult(item) {
        if (!isDuplicate(item)) {
            if (typeof item !== 'object' || item === null) {
                primitiveSet.add(item);
            }
            result.push(item);
        }
    }

    [...arr1, ...arr2].forEach(addToResult);

    return result;
}

/**
 * Recursively checks if two objects or arrays are deeply equal.
 * - Works for nested objects and arrays.
 *
 * @param {*} obj1 - First object to compare.
 * @param {*} obj2 - Second object to compare.
 * @returns {boolean} True if both objects are deeply equal, false otherwise.
 */
function deepEqual(obj1, obj2) {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every(key => deepEqual(obj1[key], obj2[key]));
}

export default union;