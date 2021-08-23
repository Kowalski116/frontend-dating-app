import React from 'react'
import './style.scss'
import '../../icons/themify-icons/themify-icons.css'


const Card = ({ name, age, img }) => {
    return (
        <div className="card">
            <img src={img} alt="img" className="card-img" />

            <div className="card-content">
                <span className="name">{name}</span>
                <span className="age">{age}</span>
            </div>
            <div className="card-action">
                <div className="card-btn card-btn--cancel "><i className="ti-close"></i></div>
                <div className="card-btn card-btn--accept"><i className="ti-heart"></i></div>
            </div>
        </div>
    )
}

export default Card