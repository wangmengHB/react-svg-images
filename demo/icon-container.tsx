import React from 'react';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';
import toast from "cogo-toast";
// list all svg icon from 'react-svg-images'
import * as SVG_ICONS from '../lib';

const Container = styled.div`
    margin: 10px 20px 0 0;
    cursor: pointer;
    &:hover { outline: dashed 1px rgba(0, 0, 0, 0.5) }
`

const IconWrapper = styled.div`
    border: 1px solid rgba(0, 0, 0, 0.1);
`
const IconTitle = styled.h5`
    text-align: center;
    line-height: 26px;
    height: 26px;
`

export default function IconContainer(props: any) {

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
            <IconWrapper>{React.createElement(SVG_ICONS[name], { ...customProps })}</IconWrapper>
            <IconTitle>{ name }</IconTitle>
        </Container>
    )
    
}