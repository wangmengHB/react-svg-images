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


function singleIconFileTemplate(baseFolderName, formattedName, iconData, type = "module") {
  switch (type) {
    case "module":
      return (
        `import { GenIcon } from './${baseFolderName}';\n` +
        `export { IconContext } from './${baseFolderName}';\n` +
        `export default function ${formattedName} (props) {\n` +
        `  return GenIcon(${JSON.stringify(iconData)})(props);\n` +
        `};\n`
      );
    case "common":
      return (
        `var GenIcon = require('./${baseFolderName}').GenIcon;\n` +
        `module.exports = module.exports.default = function ${formattedName} (props) {\n` +
        `  return GenIcon(${JSON.stringify(iconData)})(props);\n` +
        `};\n` + 
        `module.exports.IconContext = require('./${baseFolderName}').IconContext;\n`
      );
    case "dts":
      return (
        `import * as React from 'react';\n` +
        `import { IconBaseProps } from './${baseFolderName}';\n` +
        `export { IconContext } from './${baseFolderName}';\n` +
        `export default function ${formattedName}(props: IconBaseProps): JSX.Element;\n`
      )  
  }
}



module.exports = {
  iconTemplate,
  singleIconFileTemplate,
  libEntryTemplate,
};
