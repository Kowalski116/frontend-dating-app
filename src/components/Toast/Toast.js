import React from 'react'
import './style.scss'

const Toast = ({ type = "success", msg }) => {
    let classType = ''
    switch (type) {
        case "success":
            classType = 'fas fa-check-circle'
            break;
        case "error":
            classType = 'fas fa-times-circle'
            break;
        default:
    }
    return (
        <div className={`toast toast--${ type }`} >
            <div className="toast__icon">
                <i className={classType}></i>
            </div>
            <div className="toast__body">
                <p className="toast__msg">{msg} </p>
            </div>
        </div>
    )
}

export default React.memo(Toast)