import { Box } from '@chakra-ui/react';
import React from 'react'
import { useRef } from 'react';
import { format } from 'timeago.js';
import Reciever from './Reciever';
import Sender from './Sender';

const MessageBox = ({list, channel}) => {
	const containerRef = useRef(null)
	
	React.useEffect(() => {
		containerRef.current?.scrollIntoView({behavior: 'smooth'});
		//bottomRef.current
		if(containerRef && containerRef.current) {
			const element = containerRef.current;
			element.scroll({
				top: element.scrollHeight,
				left: 0,
				behavior: "smooth"
			})
		}
 }, [list]);

	return (
		<Box
		className='chat-ref'
		ref={containerRef}
			height={"60vh"}
			marginTop="20px"
			sx={{
				"&::-webkit-scrollbar": {
					width: "10px",
					borderRadius: "8px",
					backgroundColor: `rgba(0, 0, 0, 0.05)`,
				},
				"&::-webkit-scrollbar-thumb": {
					backgroundColor: `rgba(255, 255, 255, 1)`,
				},
			}}
			overflowY={"scroll"}
		>
			{list.map((messageInfo) => {
				return (
					<>
						{messageInfo.position === "incoming" && (
							<Reciever
								src={
									"https://storage.googleapis.com/opensea-static/opensea-profile/" +
									((parseInt(channel.userAddress) % 30) + 1) +
									".png"
								}
								message={messageInfo.text}
								sentTime={format(messageInfo.date)}
								userName={channel.userAddress}
							/>
						)}
						{messageInfo.position === "outgoing" && (
							<Sender 
							src={
								"https://storage.googleapis.com/opensea-static/opensea-profile/" +
								((parseInt('10') % 30) + 1) +
								".png"
							}
							message={messageInfo.text}
							sentTime={format(messageInfo.date)}
							userName={channel.userAddress} />
						)}
					</>
				);
			})}
		</Box>
	)
}

export default MessageBox