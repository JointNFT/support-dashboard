import React from 'react';


export class Message extends React.Component {
    render() {
        return (
            <div className='message-item'>
                <div><b>{this.props.address}</b></div>
                <span>{this.props.message}</span>
            </div>
        )
    }
}