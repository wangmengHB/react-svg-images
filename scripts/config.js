const path = require('path');

const rootDir = path.resolve(__dirname, "../");
const DIST = path.resolve(rootDir, 'lib');
const BASE_FOLDER_NAME = 'base';

module.exports = {
    rootDir,
    DIST,
    BASE_FOLDER_NAME,
    LIB: path.resolve(DIST, BASE_FOLDER_NAME),    // common icon lib path
    iconsFolderName: 'react-svg-images',
    svgFileGlobPath: path.resolve( __dirname, "../src/icons/**/*.svg"),
}