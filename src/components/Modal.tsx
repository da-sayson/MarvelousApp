import * as React from 'react'
import './Modal.css'

type ModalProps = {
    modalOpenSetter: (modalOpen: boolean) => void;
    modalTaskDeleter: () => void;
}

export const Modal = (props: ModalProps) => {
    return (
        <div className="modalBackground">
            <div className="modalContainer">
                <div className="titleCloseButton">
                    <button className="modalClose" onClick={() => props.modalOpenSetter(false)}>X</button>
                </div>
                <div className="header">
                    <h1>Are you Sure you Want to Delete All Tasks?</h1>
                </div>
                <div className="body">
                    <button onClick={() => props.modalOpenSetter(false)}>Cancel</button>
                    <button onClick={() => props.modalTaskDeleter()}>Confirm Delete</button>
                </div>
            </div>
        </div>
    );
}
