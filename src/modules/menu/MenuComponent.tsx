import { useEffect } from 'react'
import StartMenuPage from '../startMenu/StartMenuPage'
import HighscoreComponent from '../highscore/HighscoreComponent'
import { useGameState } from '../../store'

function MenuComponent() {
    const resetGameState = useGameState(state => state.resetGameState);

    useEffect(() => {
        resetGameState();
    }, [])
    
    
    return (
        <>
        <div >
        <h1 className='text-info '>CAVE DRONE</h1>
        <br />
        <StartMenuPage />
        <br />
        <br />
        <br />
        <HighscoreComponent />
        </div>
        </>
    )
}

export default MenuComponent