import React from 'react';
import {NavLink} from 'react-router-dom';


const Card = props => {
    return (
        <div className={"bg-light card text-center text-sm-left " + (props.className ? props.className : "")}>
            {props.image ? <img style={{width: '250px', height: '300px'}}
                                className="card-img-top m-auto" src={props.image} alt="Movie's poster"/> : null}
            <div className="card-body bg-light">
                <h5 className="card-title text-center">{props.header}</h5>
                {props.description ? <p className="card-text">{props.text}</p> : null}
                <div className="card-footer">
                    <span>Дата выхода: {props.release_date}</span>
                    {props.finish_date ?
                        <span> Дата завершения: {props.finish_date}</span>
                        : null}
                </div>
                <div className="block text-center m-3">
                    <NavLink className="nav-link" to={props.link}>{props.link_text}</NavLink>
                </div>
                <button type="button" className="btn btn-primary" onClick={props.deleteMovie}>Удалить</button>
            </div>
        </div>

    )
};

export default Card;