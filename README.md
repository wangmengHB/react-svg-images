# react-svg-images
Collection of svg images wrapped in react component


# Install
```bash
npm install --S react-svg-images
```

# Usage
```jsx
import { ImageName } from "react-svg-images";
// [ImageName] here is a placeholder, please find available svg image names in the below list 
// In order to save your bundle size, you can use it like this:
import ImageName from "react-svg-images/lib/ImageName";

<ImageName />
```

# Interface
```tsx
export interface IconProps extends React.SVGAttributes<SVGElement> {
    size?: number;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
    attr?: React.SVGAttributes<SVGElement>;
}
```

# Docs
| PropName | Type | Description |
| ------ | ------------ | -------------------------------------------------------- |
| size | number | it means the pixel width of svg, height will be calcuated automatically according to the original h/w ratio |
| color | string | it will applied to the color attribute and color css style property of svg element |
