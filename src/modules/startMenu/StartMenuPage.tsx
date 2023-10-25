import { useRef } from 'react';
import StartMenuComponent from './StartMenuComponent'


function StartPage() {
    const modalRef = useRef<HTMLDialogElement>(null);


    return (
    <div className="tooltip" data-tip="Press it to start the game">
        <button className="btn w-full max-w-full" onClick={()=>{modalRef.current?.showModal()} }>Start new game</button>
        <dialog id="start_modal" ref={modalRef} className="modal">
            <div className="modal-box">
                <StartMenuComponent />
            </div>
            <form method="dialog" className="modal-backdrop">
            <button>close</button>
            </form>
        </dialog>
    </div>
    )
}

export default StartPage