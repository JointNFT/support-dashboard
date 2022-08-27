import { createContext, useContext } from "react";

const ChannelContext = createContext(null);

export const getChannelList = (props) => {
    if (props.channels && props.channels.map) {
      console.log('here!!!!')
        //const list = getChannelList()
        const list = props.channels
            .map((c) => {
                if (c.accessToken == props.accessToken) {
                    return {
                        avatar:
                            "https://storage.googleapis.com/opensea-static/opensea-profile/" +
                            ((parseInt(c.userAddress) % 30) + 1) +
                            ".png",
                        alt: "Some DP",
                        title: c.userAddress,
                        subtitle: c?.messages ? c?.messages[c.messages.length - 1]?.message : c.lastMessage?.message || null,
                        photoUrl:c?.messages ? c?.messages[c.messages.length - 1]?.photoUrl : c.lastMessage?.photoUrl || null,
                        date: new Date(c?.messages ? c?.messages[c.messages.length - 1]?.timestamp : c?.lastMessage?.timestamp),
                        unread: c.unread != null ? c.unread : 0,
                        tag: c?.tag,
                        status: c?.status,
                        assignedTo: c?.assignedTo
                    };
                }
            });
        return list;
    }
};

export const ChannelProvider = ({ children }) => {
    return <ChannelContext value={{}}>{children}</ChannelContext>;
};

export const useChannels = () => {
    const context = useContext(ChannelContext);

    if (context) {
        throw new Error("Please wrapp <App /> component with <ChannelProvider>");
    }

    return context;
};
