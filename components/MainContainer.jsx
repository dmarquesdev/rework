// React
import React from 'react';

// Antd
import { Spin } from 'antd';


export default class MainContainer extends React.Component {
    render() {
        return (
            <Spin spinning={this.props.isLoading} size="large">
                <div className={`main-container ${this.props.className}`} style={this.props.style}>
                    {this.props.children}
                </div>
            </Spin>
        );
    }
}

MainContainer.defaulProps = {
    'isLoading': false
};

MainContainer.propTypes = {
    'style': React.PropTypes.object,
    'children': React.PropTypes.node,
    'className': React.PropTypes.string,
    'isLoading': React.PropTypes.bool
};
