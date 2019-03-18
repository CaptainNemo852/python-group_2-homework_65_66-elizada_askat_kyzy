import React, {Fragment, Component} from 'react';
import {MOVIES_URL, SHOWS_URL} from "../../urls";
import {NavLink} from 'react-router-dom';
import MovieCategories from "../../components/MovieCategories/MovieCategories";
import MovieShows from "../../components/MovieShows/MovieShows";
import moment from 'moment';


class MovieDetail extends Component {

    state = {
        movie: null,
        shows: []
    };

    componentDidMount() {
        const match = this.props.match;
        fetch(MOVIES_URL + match.params.id)
            .then(response => {
                if (response.ok) return response.json();
                throw new Error("Wrong network request")
            }).then(movie => this.setState({movie}))
            .catch(error => console.log(error));
        this.showsRequest(match.params.id)
    }

    showsRequest = (movieId) => {
        const startsAfter = moment().format('YYYY-MM-DD');
        const startsBefore = moment().add(3, 'days').format('YYYY-MM-DD');
        fetch(`${SHOWS_URL}?movie_id=${movieId}
        &hall_id=&starts_after=${startsAfter}&starts_before=${startsBefore}`)
            .then(response => {
                if (!response) throw new Error("No shows for this date range");
                if (response && response.ok) {
                    return response.json();
                } else {
                    throw new Error("Wrong network request")
                }
            }).then(shows => this.setState(prevState => {
                let newState = {...prevState};
                newState.shows = shows;
                return newState;
        })).catch(error => console.log(error))
    };

    render() {
        if (!this.state.movie) return null;
        return (
            <Fragment>
                <div className="col-4 m-auto">
                    <div className="card">
                        {this.state.movie.poster ?
                            <img className="card-img-top" src={this.state.movie.poster} alt="Movie's poster"/> : null}

                        <div className="card-body">
                            <h3>{this.state.movie.name}</h3>
                            {this.state.movie.categories.length > 0 ?
                                <MovieCategories categories={this.state.movie.categories}/> : null}
                                <p className="text-center m-2">Описание Фильма</p>
                            <p className="card-text">{this.state.movie.description}</p>
                            {this.state.shows.length > 0 ?
                                (<ul className="list-group">
                                    <p className="text-center m-1">Сеансы</p>
                                    <MovieShows shows={this.state.shows}/>
                                </ul>) : null}
                        </div>

                        <div className="card-footer">
                            <p>Дата выхода в прокат: {this.state.movie.release_date}</p>
                            {this.state.movie.finish_date ?
                                <p>Дата завершения: {this.state.movie.finish_date}</p> : null}
                        </div>

                        <NavLink to={'/movies/' + this.state.movie.id + '/edit'}
                                 className="btn btn-primary m-2">Edit</NavLink>

                    </div>
                </div>
            </Fragment>
        )
    }
}

export default MovieDetail;