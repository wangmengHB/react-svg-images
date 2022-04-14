import React, { ChangeEvent, useState } from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';
import IconContainer from './icon-container';
import Instruction from './instruction';
// list all svg icon from 'react-svg-images'
import * as SVG_ICONS from '../lib';

const Main = styled.div`
    margin: 0 auto;
    width: 90%;
`

const Title = styled.h1`
    margin: 0 auto;
    width: 90%;
    text-align: center;
`

const IconList = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    padding: 20px 0;
`

const Control = styled.div`
    padding: 5px 0;
    line-height: 30px;
    height: 30px;
`

const Label = styled.span`
    margin: 0 10px 0 20px;
`

const GlobalStyle = createGlobalStyle`
.ag-cell-wrap-text {
    word-break: break-word !important;
}
`


const root = document.createElement('div');
document.body.appendChild(root);





const App = () => {
    let allImageNames = Object.keys(SVG_ICONS);
    allImageNames = allImageNames.filter(name => name !== 'IconContext');  
    const [ keyword, setKeyword ] = useState('');
    const [ useCustom, setUseCustom ] = useState(false);
    const [ size, setSize] = useState(300);
    const [ color, setColor] = useState('#FF0000');

    
    function filterImages() {

        let props;
        if (useCustom) {
            props = { color, size }
        }

        return allImageNames
            .filter((name) => {
                const REG = new RegExp(keyword);
                if (!keyword.trim()) {
                    return true;
                }
                if (REG.test(name)) {
                    return true;
                }
                return false;
            })
            .map((name) => (<IconContainer name={name} key={name} customProps={props}/>))
    }

    return(
        <Main>
            <GlobalStyle/>
            <Title>React Svg Images</Title>
            <Instruction/>
            <div style={{ margin: '20px 0'}}>
                <h2>Find SVG Images:</h2>
                <input value={keyword} onChange={(e: ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value) } />
                
                <Control>
                    <input type="checkbox" checked={useCustom} onChange={(e: ChangeEvent<HTMLInputElement>) => setUseCustom(e.target.checked)}/>
                    <Label style={{ marginLeft: 0 }}>Customize Props</Label>
                    <Label>size</Label>
                    <input disabled={!useCustom} type="number" value={size} onChange={(e: any) => setSize(parseInt(e.target.value, 10))} style={{ width: 200}}/>
                    <Label>color</Label>
                    <input disabled={!useCustom} type="color" value={color} onChange={(e: any) => setColor(e.target.value)}  style={{ width: 200, verticalAlign: 'bottom' }}/>
                </Control>
            </div>
            <IconList>{ filterImages() }</IconList>
        </Main>
        
    )

}




ReactDOM.render(<App/>, root);
