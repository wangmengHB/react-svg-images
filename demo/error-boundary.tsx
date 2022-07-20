import React from 'react';


export default class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      console.error(error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <div style={{ margin: '20px', padding: '20px', border: '1px red sold'}}>Svg Image can not be rendered.</div>;
      }
  
      return this.props.children; 
    }
  }
