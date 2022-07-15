function iconTemplate(formattedName, iconData, type = "module") {
  switch (type) {
    case "module":
      return (
        `export function ${formattedName} (props) {\n` +
        `  return GenIcon(${JSON.stringify(iconData)})(props);\n` +
        `};\n`
      );
    case "common":
      return (
        `module.exports.${formattedName} = function ${formattedName} (props) {\n` +
        `  return GenIcon(${JSON.stringify(iconData)})(props);\n` +
        `};\n`
      );
    case "dts":
      return `export declare const ${formattedName}: IconType;\n`;
  }
}

function libEntryTemplate(iconsFolderName, type = "module") {
  switch (type) {
    case "common":
      return `module.exports = require("./${iconsFolderName}")`
    case "module":
      return `export * from './${iconsFolderName}';\n`;
    case "dts":
      return `export * from './${iconsFolderName}';\n`;
  }
}


function singleIconFileTemplate(formattedName, iconData, type = "module") {
  switch (type) {
    case "module":
      return (
        `export function ${formattedName} (props) {\n` +
        `  return GenIcon(${JSON.stringify(iconData)})(props);\n` +
        `};\n`
      );
    case "common":
      return (
        `module.exports.${formattedName} = function ${formattedName} (props) {\n` +
        `  return GenIcon(${JSON.stringify(iconData)})(props);\n` +
        `};\n`
      );
    case "dts":
      return `export declare const ${formattedName}: IconType;\n`;
  }
}



module.exports = {
  iconTemplate,
  singleIconFileTemplate,
  libEntryTemplate,
};
