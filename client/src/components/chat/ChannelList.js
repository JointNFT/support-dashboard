import React from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ConversationList, Conversation, Avatar } from "@chatscope/chat-ui-kit-react";
import { format } from "timeago.js";

export class ChannelList extends React.Component {
    queryParams = new URLSearchParams(window.location.search);
    handleClick = (channelId) => {
        this.props.onSelectChannel(channelId);
    };

    render() {
        let list = [];
        if (this.props.channels && this.props.channels.map) {
            console.log("channels", this.props.channels);
            list = this.props.channels.filter((c) =>{
              if (this.props.type != null && this.props.type == (c.tag != null ? c.tag : "")) return true;
              else if (this.props.type == null || this.props.type == "all") return true;
              else return false;
            } ).map((c) => {
                if (c.accessToken == this.queryParams.get("accessToken")) {
                        return {
                            avatar:
                                "https://storage.googleapis.com/opensea-static/opensea-profile/" +
                                ((parseInt(c.userAddress) % 30) + 1) +
                                ".png",
                            alt: "Some DP",
                            title: c.userAddress,
                            subtitle: c?.messages != null ? c.messages[c.messages.length - 1].message : c?.lastMessage?.message,
                            date: new Date(c?.messages != null ? c.messages[c.messages.length - 1].timestamp : c?.lastMessage?.timestamp),
                            unread: c.unread != null ? c.unread : 0,
                        };
                }
            });

            console.log(list);
        }
        if (list.length) {
            return (
                <ConversationList className="chat-list">
                    {list.map((conversationInfo) => (
                        <Conversation
                            name={conversationInfo.title}
                            info={conversationInfo.subtitle}
                            unreadCnt={conversationInfo.unread}
                            lastActivityTime={format(conversationInfo.date)}
                            onClick={() => this.handleClick(conversationInfo.title)}
                        >
                            <Avatar src={conversationInfo.avatar} name={conversationInfo.title} />
                        </Conversation>
                    ))}
                </ConversationList>
            );
        } else {
            return <div className="no-content-message">There is no channels to show</div>;
        }
    }
}
