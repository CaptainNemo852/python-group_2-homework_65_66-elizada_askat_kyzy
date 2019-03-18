import React, {Fragment} from 'react';


const formatDate = (dateString) => {
    return (dateString).format('YYYY-MM-DD HH:mm')
};

const HallShows = (props) => {
  return <Fragment>
            {props.shows.map(show => {
                return <div key={show.id}>
                    <li className="list-group-item mt-2 p-2">
                        <div>
                            <span>Фильм: {show.movie_name}</span>
                            <p className="m-2">Начало: {formatDate(show.begin_show_time)}</p>
                        </div>
                        <div>
                            <p className="m-2">Завершение: {formatDate(show.finish_show_time)}</p>
                        </div>
                    </li>
                </div>
            })}
        </Fragment>
};

export default HallShows;