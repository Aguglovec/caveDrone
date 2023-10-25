import { API_URL } from './gameConfig';
import axios from 'axios';

export default axios.create({
    baseURL: API_URL,
});
    
