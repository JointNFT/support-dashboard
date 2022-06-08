import React from "react";
import { Channel } from "./Channel";
import { ChatList } from "react-chat-elements";

export class ChannelList extends React.Component {
    handleClick = (data) => {
        this.props.onSelectChannel(data.title);
    };

    render() {
        let list = [];
        if (this.props.channels && this.props.channels.map) {
            list = this.props.channels.map((c) => {
                console.log('c',c)
                if (c.accessToken == "some-token")
                    return {
                        avatar: "https://storage.googleapis.com/opensea-static/opensea-profile/19.png",
                        alt: "Some DP",
                        title: c.userAddress,
                        subtitle: c?.messages != null ? c.messages.length[c.messages.length - 1] : "",
                        data: new Date(),
                        unread: 0
                    };
            });
            console.log(list)
        }
        if (list != []) {
            return (
                    <ChatList className="chat-list" dataSource={list} onClick={this.handleClick}/>
                
            );
        } else {
            return <div className="no-content-message">There is no channels to show</div>;
        }
    }
}
