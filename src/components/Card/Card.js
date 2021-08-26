import React from 'react'
import './style.scss'


const Card = ({ id, name, age, img, onSubmit, onCancel }) => {
    return (
        <div className="card" key={id}>
            <img src={img} alt="img" className="card-img" />

            <div className="card-content">
                <span className="name">{name}</span>
                <span className="age">{age}</span>
            </div>
            <div className="card-action">
                <div className="card-btn card-btn--cancel" onClick={onCancel}><i className="fas fa-times"></i></div>
                <div className="card-btn card-btn--accept" onClick={onSubmit}><i className="far fa-heart"></i></div>
            </div>
        </div>
    )
}

export default Card