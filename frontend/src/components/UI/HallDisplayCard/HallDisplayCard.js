import React from 'react';
import {NavLink} from 'react-router-dom';

const HallDisplayCard = props => {
    return(
        <div className="card text-center">
            <div className="card-header">
                {props.name}
            </div>
            <div className="card-body">
                <NavLink className="nav-link" to={props.link}>{props.link_text}</NavLink>
                <button onClick={props.deleteHall} type="button" className="btn btn-danger">Удалить зал</button>
            </div>
        </div>
    )
};

export default HallDisplayCard;
