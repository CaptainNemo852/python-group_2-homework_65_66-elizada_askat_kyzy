import React, {Fragment} from "react";



const formatDate = (dateString) => {
    return (dateString).format('YYYY-MM-DD HH:mm')
};

const MovieShows = props => {
    return (
        <Fragment>
            {props.shows.map(show => {
                return <div key={show.id}>
                    <li className="list-group-item mt-2 list-group-item-info">
                        <div>
                            <p className="card-header text-center">Зал: {show.hall_name}</p>
                            <p className="text-center m-2">Начало: {formatDate(show.begin_show_time)}</p>
                        </div>
                        <div>
                            <p className="text-center m-2">Окончание: {formatDate(show.finish_show_time)}</p>
                        </div>
                    </li>
                </div>
            })}
        </Fragment>
    );
};


export default MovieShows;