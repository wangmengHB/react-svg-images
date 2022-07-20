import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import copy from 'copy-to-clipboard';
import toast from "cogo-toast";
import ErrorBoundary from './error-boundary';
// list all svg icon from 'react-svg-images'
import * as SVG_IMAGES from '../lib';
import README from '../README.md';


const root = document.createElement('div');
document.body.appendChild(root);


const GlobalStyle = createGlobalStyle`
h1 {
    text-align: center;
}

code {
    color: #d53a55;
}

table {
    width: 100%;
}

thead{
    background: rgba(0, 0, 0, 0.1);
}
`

const Main = styled.div`
    margin: 0 auto;
    width: 90%;
    font-size: 14px;
    font-family: system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;
`

const ImageList = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    padding: 10px 0;
`

const Control = styled.div`
    padding: 5px 0;
    line-height: 30px;
    height: 30px;
`

const Label = styled.span`
    margin: 0 10px 0 20px;
`

const Container = styled.div`
    margin: 10px 20px 0 0;
    cursor: pointer;
    &:hover { outline: dashed 1px rgba(0, 0, 0, 0.5) }
`

const ImageWrapper = styled.div`
    border: 1px solid rgba(0, 0, 0, 0.1);
`
const ImageTitle = styled.h5`
    text-align: center;
    line-height: 26px;
    height: 26px;
`

function ImageContainer(props: any) {

    const { name, customProps } = props;
    
    function copyToClipboard() {
        // TODO: copy
        copy(name);
        // setShowing(true);
        toast.success(`${name} Copied to clipboard`, {
            position: "top-center"
        });
    }

    return (
        <Container onClick={copyToClipboard}>
            <ImageWrapper>{React.createElement(SVG_IMAGES[name], { ...customProps })}</ImageWrapper>
            <ImageTitle>{ name }</ImageTitle>
        </Container>
    )
    
}




const App = () => {
    const ALL_IMAGE_NAMES = Object.keys(SVG_IMAGES).filter(name => ['IconContext', 'default'].indexOf(name) === -1 );
    const [ keyword, setKeyword ] = useState("")
    const [ useCustom, setUseCustom ] = useState(false);
    const [ size, setSize] = useState(300);
    const [ color, setColor] = useState('#FF0000');

    function fitlerImages() {
        let props;
        if (useCustom) {
            props = { color, size }
        }

        return ALL_IMAGE_NAMES
            .filter((name) => {
                if (!keyword.trim()) {
                    return true;
                }
                const REG = new RegExp(keyword);
                if (REG.test(name)) {
                    return true;
                }
                return false;
            })
            .map((name) => (<ErrorBoundary key={name}><ImageContainer name={name} customProps={props}/></ErrorBoundary>))
    }

    return(
        <Main>
            <GlobalStyle/>
            <ReactMarkdown 
                children={README} 
                remarkPlugins={[remarkGfm]} 
                components={{
                    code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                        <SyntaxHighlighter
                            children={String(children).replace(/\n$/, '')}
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                        />
                        ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                        )
                    }
                }}
            />
            <h2> Demo </h2>
            <div style={{ margin: '20px 0'}}> 
                <input 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="search [ImageName] from react-svg-images"
                    style={{ width: '100%', height: 30, padding: '0 10px' }}
                />
                <Control>
                    <Label style={{ marginLeft: 0 }}>Customize Props</Label>
                    <input type="checkbox" checked={useCustom} onChange={event => {setUseCustom(event.target.checked)}}/>
                    <Label>size</Label>
                    <input disabled={!useCustom} type="number" value={size} onChange={(e: any) => setSize(parseInt(e.target.value, 10))} style={{ width: 100}}/>
                    <Label>color</Label>
                    <input disabled={!useCustom} type="color" value={color} onChange={(e: any) => setColor(e.target.value)}  style={{ width: 100 }}/>
                </Control>
            </div>
            <ImageList>
                { fitlerImages() }
            </ImageList>
        </Main>
    )

}




ReactDOM.render(<App/>, root);
