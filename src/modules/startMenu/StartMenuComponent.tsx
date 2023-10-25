import React, { ChangeEvent, useEffect,  useState } from "react";
import { userID } from "../../types/types";
import { useCave, useGameState } from "../../store";
import api from "../../api";
import { tokenChunks } from "../../gameConfig";
import { initWebSocket } from "../websocket/websocket";
import { useNavigate } from "react-router-dom";

function StartMenu() {
    const [
        name,
        complexity,
        userID,
        token,
        setName,  
        setComplexity,  
        setUserID,  
        setToken, 
        resetGameState,
    ] = useGameState(state =>[
        state.name, 
        state.complexity,
        state.userID,
        state.token,
        state.setName,  
        state.setComplexity,  
        state.setUserID,  
        state.setToken,  
        state.resetGameState,     
    ]);
    const [
        setCaveName,  
        setCaveComplexity,  
        addCaveSegment,
        setCaveLoaded, 
        resetCaveState,
        addSegmentsCounter,
    ] = useCave((state)=> [
        state.setName,
        state.setComplexity,
        state.addCaveSegment,
        state.setCaveLoaded, 
        state.resetCaveState,
        state.addSegmentsCounter,
    ]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        resetGameState();
        resetCaveState();

        return () => {
            resetGameState();
        }
    }, [])   

    useEffect(() => {
        if (userID.id != 0) {	
        getUserToken(userID);
        }
    }, [userID])
    
    useEffect(() => {
        if (token) {	
            setCaveName(name);
            setCaveComplexity(Number(complexity));
            let counter = 0;
            initWebSocket(userID,token)
            .onmessage = (msg) => {
            // .addEventListener("message", (msg) =>{
                if (msg.data !== 'finished') {
                    addCaveSegment(msg.data);  
                    addSegmentsCounter;      
                    counter++;
                    if (counter === 80) {
                        console.log('80 segments received');
                        navigate('/game');
                    }
                } else {
                    console.log(counter +' segments total received');
                    setCaveLoaded();
                }
            };
        }
    }, [token])
    

    function onUserSubmit (e: React.FormEvent) {
        resetCaveState();
        e.preventDefault();
        if (isStringEmty(name)) {
            setError('Please enter your name.');
            return null
        };
        if (isStringEmty(complexity)) {
            setError('Please choose difficulty.');
            return null
        };
        setError('');
        getUserID ();
    
    }
    
    function getUserID () {
        return api.post('/init', {name,complexity})
                    .then((resp) => setUserID(resp.data))
                    .catch((error) => console.log(error));
    }
    
     function getUserToken (userID : userID) {
            const chunkPromises : Promise<void>[] = [];
            for (let i = 0; i < tokenChunks; i++) {
                chunkPromises[i]=api.get('/token/' + (i+1), {params:userID})
                .then((resp) => {
                    chunkPromises[resp.data.no-1]=resp.data.chunk;
                    })
                .catch((error) => console.log(error));
            }
            Promise.all(chunkPromises).then(() => {setToken(chunkPromises.reduce((accumulator, tokenChunk) => accumulator + tokenChunk, ''))}
            )
        
    }
    
    function onNameChange (e:ChangeEvent<HTMLInputElement>) {
        setName(e.currentTarget.value);
        setError('');
    }
    
    function onComplexityChange (e:ChangeEvent<HTMLInputElement>) {
        setComplexity(e.target.value);
        setError('');
    }
    
    function isStringEmty (string:string) {
        if (string.trim().length < 1) {
            return true;
        } 
        return false;
    }

  return (
      <div>
			<h1>Start new game</h1>
            <br/>
            <br/>
		<form onSubmit={onUserSubmit}>
			{error ? <p className="text-red-400 font-bold">{error}</p> :null}
		<input type="text" value={name} onChange={(e) => onNameChange(e)} placeholder="Your name" className="input input-bordered input-primary w-full max-w-xs m-4"/>
		<h3>Choose difficulty:</h3>
		<div className="rating rating-lg w-full max-w-xs m-1" onChange={(e:ChangeEvent<HTMLInputElement>) => onComplexityChange(e)}>
			<input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400"  value="1" />
			<input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" value="2" />
			<input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" value="3" />
			<input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" value="4" />
			<input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" value="5" />
			<input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" value="6" />
			<input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" value="7" />
			<input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" value="8" />
			<input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" value="9" />
			<input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" value="10" />
		</div>
		<button className="btn btn-primary w-full max-w-xs m-1" >start game</button>
		</form>
		</div>
  )
}

export default StartMenu