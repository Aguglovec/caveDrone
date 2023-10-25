import { restoreFromStorage } from '../utils/utils';
import UserList from './UserList/UserList';


function HighscoreComponent() {

    const props = {list:restoreFromStorage(),};

    return (
        <>
        <h2>SCOREBOARD</h2>
        <UserList {...props} /> 
        </> )
}

export default HighscoreComponent