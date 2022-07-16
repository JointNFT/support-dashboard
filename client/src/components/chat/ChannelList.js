import React from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  ConversationList,
  Conversation,
  Avatar,
  Search,
} from "@chatscope/chat-ui-kit-react";
import { format } from "timeago.js";

export class ChannelList extends React.Component {
  handleClick = (channelId) => {
    this.props.onSelectChannel(channelId);
  };

  render() {
    let list = [];
    if (this.props.channels && this.props.channels.map) {
      console.log("channels", this.props.channels);
      list = this.props.channels
        .filter((c) => {
          if (
            this.props.type != null &&
            this.props.type == (c.tag != null ? c.tag : "")
          )
            return true;
          else if (this.props.type == null || this.props.type == "all")
            return true;
          else if (this.props.type == "me" && this.props.address == c.assignedTo)
            return true;
          else return false;
        })
        .map((c) => {
          if (c.accessToken == this.props.accessToken) {
            return {
              avatar:
                "https://storage.googleapis.com/opensea-static/opensea-profile/" +
                ((parseInt(c.userAddress) % 30) + 1) +
                ".png",
              alt: "Some DP",
              title: c.userAddress,
              subtitle:
                c?.messages 
                  ? c.messages[c.messages.length - 1].message
                  : c?.lastMessage?.message,
              date: new Date(
                c?.messages
                  ? c.messages[c.messages.length - 1].timestamp
                  : c?.lastMessage?.timestamp
              ),
              unread: c.unread != null ? c.unread : 0,
            };
          }
        });
    }
    if (list.length) {
      list = list.sort((objA, objB) => Number(objB.date) - Number(objA.date));
      return (
        <ConversationList className="channel-list" scrollable={true}>
          <Search
            placeholder="Search..."
            className="search"
          />
          {list.map((conversationInfo) => (
            <Conversation
              name={conversationInfo.title.slice(0, 10) + "..."}
              info={conversationInfo.subtitle}
              unreadCnt={conversationInfo.unread}
              lastActivityTime={format(conversationInfo.date)}
              onClick={() => this.handleClick(conversationInfo.title)}
            >
              <Avatar
                src={conversationInfo.avatar}
                name={conversationInfo.title.slice(0, 10) + "..."}
              />
            </Conversation>
          ))}
        </ConversationList>
      );
    } else {
      return (
        <div className="no-content-message">There is no channels to show</div>
      );
    }
  }
}
