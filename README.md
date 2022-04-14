# react-svg-images
collection of svg images wrapped in react component


# Install
```bash
npm install --S react-svg-images
```

# Usage
```jsx
import { IconName } from "react-svg-images";
// [IconName] here is a placeholder, please find available icon names below 
// It is used as a standard react component.
<IconName />
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

