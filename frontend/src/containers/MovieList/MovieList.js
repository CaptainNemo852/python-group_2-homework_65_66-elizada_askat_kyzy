import React, {Fragment, Component} from 'react';
import {MOVIES_URL} from "../../urls";
import MovieCard from "../../components/MovieCard/MovieCard";


class MovieList extends Component {

    state = {
        movies: [],
    };

    componentDidMount() {
        fetch(MOVIES_URL)
            .then(response => {
                if (response.ok) return response.json();
                throw new Error("Something wrong with your network request");
            }).then(movies =>
            this.setState({movies: movies}))
            .catch(error => console.log(error))
    }

    movieDelete = (movieId) => {
        fetch(MOVIES_URL + movieId + '/', {
            method: "DELETE", headers: {
                'Authorization': 'Token ' + localStorage.getItem('auth-token')
            }
        });
        this.setState(prevState => {
            let newState = {...prevState};
            let movies = [...newState.movies];
            let movieIndex = movies.findIndex(movie => movie.id === movieId);
            movies.splice(movieIndex, 1);
            newState.movies = movies;
            return newState;
        })

    };

    redirectTo = () => {
        this.props.history.push('/login')
    };

    render() {
        return (
            <Fragment>
                <div className='row'>
                    {this.state.movies.map(movie => {
                        return <div className='col-xs-12 col-sm-6 col-lg-4 mt-3' key={movie.id}>
                            <MovieCard onDelete={localStorage.getItem('auth-token') ?
                                (() => this.movieDelete(movie.id)) : () => this.redirectTo()}
                                       movie={movie}/>
                        </div>
                    })}
                </div>
            </Fragment>
        )
    }
}

export default MovieList;