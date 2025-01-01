import axios from 'axios';

const API_URL = '/api/communications';

export const fetchCommunications = () => axios.get(API_URL);

export const logCommunication = (data) => axios.post(API_URL, data);

export const getOverdueCommunications = () => axios.get(`${API_URL}/overdue`);

export const getTodaysCommunications = () => axios.get(`${API_URL}/dueToday`);
