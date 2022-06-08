import React from 'react';
import {Nav} from "react-bootstrap";
import { ChannelList } from './ChannelList';
import './chat.scss';
import { MessagesPanel } from './MessagesPanel';
import socketClient from "socket.io-client";
const SERVER = "http://127.0.0.1:3000";
export class Chat extends React.Component {

    state = {
        channels: null,
        socket: null,
        channel: null
    }
    socket;
    componentDidMount() {
        this.loadChannels();
        this.configureSocket();
    }

    configureSocket = () => {
        var socket = socketClient();
        socket.on('connection', () => {
            if (this.state.channel) {
                this.handleChannelSelect(this.state.channel.id);
            }
        });

        socket.on('message', message => {
            console.log('message', message);
            let channels = this.state.channels
            channels.forEach(c => {
                if (c.userAddress === message.address) {
                    if (!c.messages) {
                        c.messages = [message];
                    } else {
                        c.messages.push(message);
                    }
                }
            });
            this.setState({ channels });
        });

        socket.on('new-account', data => {
            let channels = this.state.channels;
            channels.push(data);
            this.setState({ channels });
        })

        this.socket = socket;
    }

    loadChannels = async () => {
        fetch('/getUsers?accessToken=some-token').then(async response => {
            let data = await response.json();
            this.setState({ channels: data.users });
        })
    }

    handleChannelSelect = address => {
        let channel = this.state.channels.find(c => {
            return c.userAddress === address;
        });
        fetch('/getMessages?address='+address+'&accessToken=some-token').then(async response => {
            let data = await response.json();
            channel.messages = data.messages;
            this.setState({ channel });
        });
        // this.socket.emit('create-account', {'address':'0xe96', accessToken: "some-token"});
    }


    handleSendMessage = (address, text) => {
        this.socket.emit('send-message', { id: Date.now(), address: address, accessToken:"some-token", message:text, to:"0xe97", from:"support"});
    }

    render() {

        return (
            <div className='chat-app'>
                <ChannelList channels={this.state.channels} onSelectChannel={this.handleChannelSelect} />
                <MessagesPanel onSendMessage={this.handleSendMessage} channel={this.state.channel} />
            </div>
            
        );
    }
}