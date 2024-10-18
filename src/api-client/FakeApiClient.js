export async function getAllConversations() {
	return getAllConversationsResponse; 
}

export function pollConversation(conversationId, timeStamp = null) {
	const conversation = getAllConversationsResponse.conversations.find(
		(conv) => conv.conversationId === conversationId
	);

	if (!conversation) {
		return null;
	}
	if (timeStamp) {
		const filteredMessages = conversation.messages.filter(
			(message) => new Date(message.timeStamp) > new Date(timeStamp)
		);
		return {
			...conversation,
			messages: filteredMessages,
		};
	}
	return conversation;
}

export async function postMessage(postMessageRequest) {
	return 0;
}

let getAllConversationsResponse = {
	conversations: [
		{
			conversationId: 'ccccc-cccccccccc-ccccc',
			user: {
				userId: 'bbbbb-bbbbbbbbbb-bbbbb',
				name: 'Bob',
				Profile: 'url/to/profile_image_bob.jpg',
			},
			postId: 'aaaaa-aaaaaaaaaa-aaaaa',
			messages: [
				{
					timeStamp: '2024-10-16T10:00:00Z',
					senderId: 'bbbbb-bbbbbbbbbb-bbbbb',
					contents: 'I would like to join you on the trip!',
				},
			],
		},
		{
			conversationId: 'ddddd-dddddddddd-ddddd',
			user: {
				userId: 'ccccc-cccccccccc-ccccc',
				name: 'Alice',
				Profile: 'url/to/profile_image_alice.jpg',
			},
			postId: 'fffff-ffffffffffff-fffff',
			messages: [
				{
					timeStamp: '2024-10-16T09:50:00Z',
					senderId: 'ccccc-cccccccccc-ccccc',
					contents: 'Is the meeting still on for today?',
				},
				{
					timeStamp: '2024-10-16T09:55:00Z',
					senderId: 'd5bac5a3-0855-436b-9adf-103e02287e20',
					contents: "Yes, it's at 3 PM. See you there!",
				},
			],
		},
		{
			conversationId: 'eeeee-eeeeeeeeee-eeeee',
			user: {
				userId: 'ddddd-dddddddddd-ddddd',
				name: 'Charlie',
				Profile: 'url/to/profile_image_charlie.jpg',
			},
			postId: 'ggggg-gggggggggggg-ggggg',
			messages: [
				{
					timeStamp: '2024-10-16T08:30:00Z',
					senderId: 'd5bac5a3-0855-436b-9adf-103e02287e20',
					contents: 'Hey Charlie, are you coming to the event?',
				},
				{
					timeStamp: '2024-10-16T08:45:00Z',
					senderId: 'ddddd-dddddddddd-ddddd',
					contents: "Yes, I'll be there!",
				},
			],
		},
	],
};
