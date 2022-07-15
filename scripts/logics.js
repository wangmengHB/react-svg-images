const cheerio = require("cheerio");
const glob = require("glob-promise");
const camelcase = require("camelcase");
const fs = require("fs").promises;
const path = require("path");
const { strings } = require("util-kit");

const { escapeRegExpCharacters } = strings;


async function convertIconData(svg, multiColor, fileName) {
  const $svg = cheerio.load(svg, { xmlMode: true })("svg");

  // filter/convert attributes
  // 1. remove class attr
  // 2. convert to camelcase ex: fill-opacity => fillOpacity
  const attrConverter = (
    /** @type {{[key: string]: string}} */ attribs,
    /** @type string */ tagName
  ) => {
    if (!attribs) {
      return {};
    }
    return Object.keys(attribs)
    .filter(
      (name) =>
        ![
          "class",
          ...(tagName === "svg"
            // ? ["xmlns", "xmlns:xlink", "xml:space", "width", "height"]
            ? ["xmlns", "xmlns:xlink", "xml:space"]
            : []), // if tagName is svg remove size attributes
        ].includes(name)
    )
    .reduce((obj, name) => {
      const newName = camelcase(name);
      switch (newName) {
        case "fill":
          if (
            attribs[name] === "none" ||
            attribs[name] === "currentColor" ||
            multiColor
          ) {
            obj[newName] = attribs[name];
          }
          break;
        case "pId":
          break;
        default:
          obj[newName] = attribs[name];
          break;
      }
      // If id property exist in svg raw files, it can cause conflict when showing them at the same time.
      // So it would better to use its own filename as prefix in order to make id globally unique
      const FILENAME_REG = new RegExp(`^${escapeRegExpCharacters(fileName)}-`);
      if (newName === 'id' && !FILENAME_REG.test(attribs[name])) {
        obj[newName] = `${fileName}-${attribs[name]}`;
      }
      // For id refence, such as url(#xxx), must replace them as well
      const REG_ID_REFERENCE = /url\(#([a-zA-Z0-9\-]+)\)/;
      if (REG_ID_REFERENCE.test(attribs[name])) {
        const idRefStr = attribs[name];
        const newIdRef = idRefStr.replace(REG_ID_REFERENCE, `url(#${fileName}-$1)`);
        obj[newName] = newIdRef;
        console.log('id converted:', idRefStr, newIdRef);
      }
      return obj;
    }, {});

  }  
    

  // convert to [ { tag: 'path', attr: { d: 'M436 160c6.6 ...', ... }, child: { ... } } ]
  const elementToTree = (/** @type {Cheerio} */ element) =>
    element
      .filter((_, e) => e.tagName && !["style"].includes(e.tagName))
      .map((_, e) => ({
        tag: e.tagName,
        attr: attrConverter(e.attribs, e.tagName),
        child:
          e.children && e.children.length
            ? elementToTree(cheerio(e.children))
            : undefined,
      }))
      .get();

  const tree = elementToTree($svg);
  return tree[0]; // like: [ { tag: 'path', attr: { d: 'M436 160c6.6 ...', ... }, child: { ... } } ]
}

async function copyRecursive(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    const sPath = path.join(src, entry.name);
    const dPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyRecursive(sPath, dPath);
    } else {
      await fs.copyFile(sPath, dPath);
    }
  }
}

async function rmDirRecursive(dest) {
  try {
    for (const entry of await fs.readdir(dest, { withFileTypes: true })) {
      const dPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await rmDirRecursive(dPath);
      } else {
        await fs.unlink(dPath);
      }
    }
    await fs.rmdir(dest);
  } catch (err) {
    if (err.code === "ENOENT") return;
    throw err;
  }
}

module.exports = {
  convertIconData,
  copyRecursive,
  rmDirRecursive,
};
