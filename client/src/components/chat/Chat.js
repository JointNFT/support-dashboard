import React from 'react';
import { ChannelList } from './ChannelList';
import { CreateAccountForm } from './CreateAccountForm';
import './chat.scss';
import { MessagesPanel } from './MessagesPanel';
import socketClient from "socket.io-client";
const SERVER = "https://support-dashboard-highfy.herokuapp.com";
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
        var socket = socketClient(SERVER);
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

        this.socket = socket;
    }

    loadChannels = async () => {
        let channels = [{userAddress: '', accessToken: 'some-token'}];
        this.setState({channels})
    }

    handleChannelSelect = address => {
        let channel = this.state.channels.find(c => {
            return c.userAddress === address;
        });
        fetch(SERVER+'/getMessages?address='+address+'&accessToken=some-token').then(async response => {
            let data = await response.json();
            channel.messages = data.messages;
            this.setState({ channel });
        });
        // this.socket.emit('create-account', {'address':'0xe96', accessToken: "some-token"});
    }


    handleSendMessage = (address, text) => {
        this.socket.emit('send-message', { id: Date.now(), address: address, accessToken:"some-token", message:text, to:"support", from:address});
    }

    handleCreateAccount = (address, accessToken) => {
        this.socket.emit('create-account', {userAddress: address, accessToken});
        let channels = this.state.channels;
        channels[0].userAddress = address;
        this.setState({channels});
    }

    render() {
        return (
            <div className='chat-app'>
                <CreateAccountForm createAccount={this.handleCreateAccount} />
                <ChannelList channels={this.state.channels} onSelectChannel={this.handleChannelSelect} />
                <MessagesPanel onSendMessage={this.handleSendMessage} channel={this.state.channel} />
            </div>
        );
    }
}