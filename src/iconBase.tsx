import * as React from 'react';

import { IconContext, DefaultContext } from './iconContext';

export interface IconTree {
  tag: string;
  attr: {[key: string]: string};
  child: IconTree[];
}


function Tree2Element(tree: IconTree[]): React.ReactElement<{}>[] {
  return tree && tree.map((node, i) => React.createElement(node.tag, {key: i, ...node.attr}, Tree2Element(node.child)));
}
export function GenIcon(data: IconTree) {
  return (props: IconBaseProps) => (
    <IconBase attr={{...data.attr}} {...props}>
      {Tree2Element(data.child)}
    </IconBase>
  );
}

export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
  children?: React.ReactNode;
  size?: number;
  color?: string;
  title?: string;
}

export type IconType = (props: IconBaseProps) => JSX.Element;
export function IconBase(props:IconBaseProps & { attr?: {} }): JSX.Element {
  const elem = (conf: IconContext) => {
    const {attr, size, title, ...svgProps} = props;
    // default h/w is 1
    let ratio = 1;
    let svgWidth: number | string = '1em', svgHeight: number | string = '1em';
    const { width, height } = attr as any;
    if (width && height) {
      ratio = height / width;
      svgWidth = width;
      svgHeight = height;
    }
    const computedSize = size || conf.size || "1em";
    if (typeof computedSize === 'number') {
      svgWidth = computedSize;
      svgHeight = computedSize * ratio; 
    }
    
    let className;
    if (conf.className) {
      className = conf.className;
    } 
    if (props.className) {
      className = (className ? className + ' ' : '') + props.className;
    }

    return (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        {...conf.attr}
        {...attr}
        {...svgProps}
        className={className}
        height={svgHeight}
        width={svgWidth}
        style={{ color: props.color || conf.color, ...conf.style, ...props.style}}
        xmlns="http://www.w3.org/2000/svg"
      >
      {title && <title>{title}</title>}
      {props.children}
    </svg>
    )
  };

  return IconContext !== undefined
    ? <IconContext.Consumer>{(conf: IconContext) => elem(conf)}</IconContext.Consumer>
    : elem(DefaultContext);
}
