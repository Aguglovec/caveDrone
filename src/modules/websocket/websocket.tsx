
import { WS_API_URL} from '../../gameConfig';
import { token, userID } from '../../types/types';


export function initWebSocket (userID:userID,gameToken:token) {
    const ws = new WebSocket(WS_API_URL);

    ws.onopen = () => {
        console.log('Connected. player:'+userID.id+"-"+gameToken);
        ws.send('player:'+userID.id+"-"+gameToken);
    }

    ws.onerror = () => {
        console.log("Connection error");
    };


    return ws
};
