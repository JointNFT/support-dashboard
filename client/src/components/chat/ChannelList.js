import React from "react";
import { ChatList } from "react-chat-elements";

export class ChannelList extends React.Component {
    queryParams = new URLSearchParams(window.location.search);
    handleClick = (data) => {
        this.props.onSelectChannel(data.title);
    };


    
    render() {
        const lista = [
            {
              avatar: "https://storage.googleapis.com/opensea-static/opensea-profile/27.png",
              alt: "Some DP",
              title: "0x02215bF5ba4c4041CAbDaC097070Bff0283bcA19",
              subtitle: "testing multi line messages-testing multi line messages",
              date: "2022-06-14T10:20:57.975Z",
              unread: 0
            },
            {
              avatar: "https://storage.googleapis.com/opensea-static/opensea-profile/29.png",
              alt: "Some DP",
              title: "0x0B3074cd5891526420d493B13439f3D4b8be6144",
              subtitle: "Testing new message sent ",
              date: "2022-06-10T14:21:32.917Z",
              unread: 0
            },
            {
              avatar: "https://storage.googleapis.com/opensea-static/opensea-profile/3.png",
              alt: "Some DP",
              title: "0x390A19fcef7fc0B7De17E1C4e3feC52B4f9E1665",
              subtitle: "Testing a new message sent ",
              date: "2022-06-10T14:21:43.973Z",
              unread: 0
            },
            {
              avatar: "https://storage.googleapis.com/opensea-static/opensea-profile/17.png",
              alt: "Some DP",
              title: "0x3b036793Ea6dD8D9b352847f32818FA253eB759d",
              subtitle: "new mess",
              date: "2022-06-10T15:39:50.448Z",
              unread: 0
            },
            {
              avatar: "https://storage.googleapis.com/opensea-static/opensea-profile/29.png",
              alt: "Some DP",
              title: "0x5c146cd18fa53914580573c9b9604588529406ca",
              subtitle: "Hi ! ",
              date: "2022-06-13T15:17:02.576Z",
              unread: 0
            },
            {
              avatar: "https://storage.googleapis.com/opensea-static/opensea-profile/27.png",
              alt: "Some DP",
              title: "0x7E6422ac8a2b941612A561e91FCcd78b5427652d",
              subtitle: "Hello",
              date: "2022-06-13T14:06:15.342Z",
              unread: 0
            },
            {
              avatar: "https://storage.googleapis.com/opensea-static/opensea-profile/1.png",
              alt: "Some DP",
              title: "0xe95C4707Ecf588dfd8ab3b253e00f45339aC3054",
              subtitle: "yes ser",
              date: "2022-06-14T13:32:03.716Z",
              unread: 0
            }
          ]
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
        if (list.length) {
            return (
                <ChatList className="chat-list" dataSource={lista} onClick={this.handleClick}/>
            );
        } else {
            return <div className="no-content-message">There is no channels to show</div>;
        }
    }
}
