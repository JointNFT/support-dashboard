import React from "react";
import { Channel } from "./Channel";

export class ChannelList extends React.Component {
    handleClick = (address) => {
        this.props.onSelectChannel(address);
    };

    render() {
        let list = <div className="no-content-message">There is no channels to show</div>;
        if (this.props.channels && this.props.channels.map) {
            list = this.props.channels.map((c) => {
                return <Channel address={c.userAddress} onClick={this.handleClick} />;
            });
        }
        return <div className="channel-list">{list}</div>;
    }
}
