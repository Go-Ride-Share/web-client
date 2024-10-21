export const isLoggedIn = () => {
	const logicToken = localStorage.getItem('logic_token');
	const dbToken = localStorage.getItem('db_token');
	const userId = localStorage.getItem('user_id');

	return logicToken && dbToken && userId;
};