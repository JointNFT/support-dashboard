import React from "react";
import { Channel } from "./Channel";
import { ChatList } from "react-chat-elements";

export class ChannelList extends React.Component {
    queryParams = new URLSearchParams(window.location.search);
    handleClick = (data) => {
        this.props.onSelectChannel(data.title);
    };


    render() {
        let list = [];
        if (this.props.channels && this.props.channels.map) {
            console.log('channels',this.props.channels);
            list = this.props.channels.map((c) => {
                console.log(c)
                if (c.accessToken == this.queryParams.get("accessToken"))
                    return {
                        avatar: "https://storage.googleapis.com/opensea-static/opensea-profile/"+((parseInt(c.userAddress)%30)+1)+".png",
                        alt: "Some DP",
                        title: c.userAddress,
                        subtitle: c?.messages != null ? c.messages[c.messages.length - 1].message : c?.lastMessage?.message,
                        date: new Date(c?.messages != null ? c.messages[c.messages.length - 1].timestamp : c?.lastMessage?.timestamp),
                        unread: c.unread != null ? c.unread : 0
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
