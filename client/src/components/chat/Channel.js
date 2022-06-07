import React from 'react';


export class Channel extends React.Component {

    click = () => {
        this.props.onClick(this.props.address);
    }

    render() {
        return (
            <div className='channel-item' onClick={this.click}>
                <div>{this.props.address}</div>
                {/* <span></span> highlist if new message has come */}
            </div>
        )
    }
}