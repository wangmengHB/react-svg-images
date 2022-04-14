const path = require("path");
const fs = require("fs").promises;
const camelcase = require("camelcase");
const util = require("util");
const { iconRowTemplate, iconsEntryTemplate } = require("./templates");
const { getIconFiles, convertIconData, rmDirRecursive } = require("./logics");
const { svgo } = require("./svgo");
const { DIST, LIB, rootDir, iconsFolderName, svgContents, BASE_LIB_NAME } = require('./config');

const exec = util.promisify(require("child_process").exec);

async function dirInit() {
  const ignore = (err) => {
    if (err.code === "EEXIST") return;
    throw err;
  };

  await rmDirRecursive(DIST);
  await fs.mkdir(DIST, { recursive: true }).catch(ignore);
  await fs.mkdir(LIB).catch(ignore);
  await fs.mkdir(path.resolve(LIB, "esm")).catch(ignore);
  await fs.mkdir(path.resolve(LIB, "cjs")).catch(ignore);

  const write = (filePath, str) =>
    fs.writeFile(path.resolve(DIST, ...filePath), str, "utf8").catch(ignore);

  
  await fs.mkdir(path.resolve(DIST, iconsFolderName)).catch(ignore);

  await write(
    [iconsFolderName, "index.js"],
    `// THIS FILE IS AUTO GENERATED\nvar GenIcon = require('../${BASE_LIB_NAME}').GenIcon\nmodule.exports.IconContext = require('../${BASE_LIB_NAME}').IconContext\n`
  );
  await write(
    [iconsFolderName, "index.esm.js"],
    `// THIS FILE IS AUTO GENERATED\nimport { GenIcon } from '../${BASE_LIB_NAME}';\nexport { IconContext } from '../${BASE_LIB_NAME}'\n`
  );
  await write(
    [iconsFolderName, "index.d.ts"],
    `// THIS FILE IS AUTO GENERATED\nimport { IconTree, IconType } from '../${BASE_LIB_NAME}'\nexport { IconContext } from '../${BASE_LIB_NAME}'\n`
  );
  await write(
    [iconsFolderName, "package.json"],
    JSON.stringify(
      {
        sideEffects: false,
        module: "./index.esm.js",
      },
      null,
      2
    ) + "\n"
  );
  

  
}

async function writeIconModule() {
  const entryCommon = iconsEntryTemplate(iconsFolderName, "common");
  await fs.writeFile(path.resolve(DIST, "index.js"), entryCommon, "utf8");
  const entryModule = iconsEntryTemplate(iconsFolderName, "module");
  await fs.writeFile(path.resolve(DIST, "index.esm.js"), entryModule, "utf8");
  const entryDts = iconsEntryTemplate(iconsFolderName, "dts");
  await fs.writeFile(path.resolve(DIST, "index.d.ts"), entryDts, "utf8");

  const exists = new Set(); // for remove duplicate
  for (const content of svgContents) {
    const files = await getIconFiles(content);

    for (const file of files) {
      const svgStrRaw = await fs.readFile(file, "utf8");
      const svgStr = content.processWithSVGO
        ? await svgo.optimize(svgStrRaw).then((result) => result.data)
        : svgStrRaw;

      const iconData = await convertIconData(svgStr, content.multiColor);

      const rawName = path.basename(file, path.extname(file));
      const pascalName = camelcase(rawName, { pascalCase: true });
      const name =
        (content.formatter && content.formatter(pascalName, file)) ||
        pascalName;
      if (exists.has(name)) continue;
      exists.add(name);

      const modRes = iconRowTemplate(name, iconData, "module");
      await fs.appendFile(
        path.resolve(DIST, iconsFolderName, "index.esm.js"),
        modRes,
        "utf8"
      );
      const comRes = iconRowTemplate(name, iconData, "common");
      await fs.appendFile(
        path.resolve(DIST, iconsFolderName, "index.js"),
        comRes,
        "utf8"
      );
      const dtsRes = iconRowTemplate(name, iconData, "dts");
      await fs.appendFile(
        path.resolve(DIST, iconsFolderName, "index.d.ts"),
        dtsRes,
        "utf8"
      );

      exists.add(file);
    }
  }
}

async function writeEntryPoints() {
  const generateEntryCjs = function() {
    return `module.exports = require('./cjs/index.js');`;
  };
  const generateEntryMjs = function(filename = "index.js") {
    return `import * as m from './esm/${filename}'
export default m
    `;
  };
  await fs.writeFile(
    path.resolve(LIB, "index.js"),
    generateEntryCjs(),
    "utf8"
  );
  await fs.writeFile(
    path.resolve(LIB, "index.esm.js"),
    generateEntryMjs(),
    "utf8"
  );
  await fs.writeFile(
    path.resolve(LIB, "index.d.ts"),
    generateEntryMjs("index.d.ts"),
    "utf8"
  );
}



async function buildLib() {
  await rmDirRecursive(LIB);

  const execOpt = {
    cwd: rootDir,
  };
  await Promise.all([
    exec(`yarn tsc -p ./tsconfig.build.json --outDir "./lib/${BASE_LIB_NAME}/esm" --module es2015 && yarn babel --config-file ./babel.build.json ./lib/${BASE_LIB_NAME}/esm -d ./lib/${BASE_LIB_NAME}/esm`, execOpt),
    exec(`yarn tsc -p ./tsconfig.build.json --outDir "./lib/${BASE_LIB_NAME}/cjs" --module commonjs`, execOpt),
  ]);
}

module.exports = {
  dirInit,
  writeIconModule,
  writeEntryPoints,
  buildLib
};
