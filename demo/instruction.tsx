import React from 'react';
import CodeBlock from './code-block';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';



const rowData = [
    { PropName: 'size', Type: 'number', Description: 'it means the pixel width of svg, height will be calcuated automatically according to the original h/w ratio'},
    { PropName: 'color', Type: 'string', Description: 'it will applied to the color attribute and color css style property of svg element'},
];

const columnDefs = [
    { field: 'PropName',},
    { field: 'Type'  },
    { field: 'Description', width: 620,  wrapText: true, autoHeight: true, },
]


const installCode = `npm install react-svg-images --S`;

const usageCode = `import { IconName } from "react-svg-images";
// [IconName] here is a placeholder, please find available icon names below 
// It is used as same as a standard react component.
<IconName />`;

const interfaceCode = `export interface IconProps extends React.SVGAttributes<SVGElement> {
    size?: number;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
    attr?: React.SVGAttributes<SVGElement>;
}`;


export default function Instruction() {

    
    return (
        <div style={{ margin: '20px 0'}}>
            <h2>Install</h2>
            <CodeBlock language="bash" code={installCode} />
            <h2>Usage</h2>
            <CodeBlock language="jsx" code={usageCode} />
            <h2>Props</h2>
            <CodeBlock language={"ts"} code={interfaceCode}/>
            <h2>Specification</h2>
            <div className="ag-theme-alpine">
                <AgGridReact
                    domLayout={'autoHeight'}
                    defaultColDef={{
                        resizable: true,
                    }}
                    animateRows={true}
                    rowData={rowData}
                    columnDefs={columnDefs}>
                </AgGridReact>
            </div>
        </div>
    )
}