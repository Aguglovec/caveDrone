import { userScore } from '../../../types/types';

export default function UserList (props:  {list: userScore[]}) {


        return (
        <> 
            <div className="overflow-x-auto">
            <table className="table">
                <thead>
                <tr>
                <th>#</th>
                <th>Name</th>
                <th>Score</th>
                </tr>
            </thead>
            <tbody>
            {props.list.map((user,index) => (
            <tr className='hover' key={index}>
            <td className="position">{index+1}</td>
            <td className="userName">{user.name}</td>
            <td className="score">{user.score}</td>
            </tr>
            ))}
            </tbody>
            </table>
        </div>
        </>

        );
    
}

