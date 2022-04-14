import Highlight, { defaultProps } from "prism-react-renderer";
import PrismTheme from "prism-react-renderer/themes/nightOwl";
import React from "react";

export default function CodeBlock({ code, language }) {
  
  return (
    <Highlight
      {...defaultProps}
      theme={PrismTheme as any}
      code={code.trim()}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={`${className} code`} style={{...style, padding: '10px'}}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
