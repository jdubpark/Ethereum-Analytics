"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeyByValue = void 0;
/**
 * Get key by value in a map
 * @param map
 * @param searchValue
 */
function getKeyByValue(map, searchValue) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of map.entries()) {
        if (value === searchValue)
            return key;
    }
    return undefined;
}
exports.getKeyByValue = getKeyByValue;
