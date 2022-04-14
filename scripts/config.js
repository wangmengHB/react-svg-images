const path = require('path');


const rootDir = path.resolve(__dirname, "../");
const DIST = path.resolve(rootDir, 'lib');
const BASE_LIB_NAME = 'base';




/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g
const camelize = (str) => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
}






module.exports = {
    rootDir,
    DIST,
    BASE_LIB_NAME,
    LIB: path.resolve(DIST, BASE_LIB_NAME),    // common icon lib path
    iconsFolderName: 'react-svg-images',
    svgContents: [
        {
            files: path.resolve( __dirname, "../src/icons/*.svg"),
            formatter: (name) => `${camelize(name)}`,
            processWithSVGO: false,
            multiColor: true,
        },
    ],

}