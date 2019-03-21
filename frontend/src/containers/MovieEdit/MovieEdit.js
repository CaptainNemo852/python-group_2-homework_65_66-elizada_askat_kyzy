import React, {Component, Fragment} from 'react';
import {MOVIES_URL} from "../../urls";
import MovieForm from "../../components/MovieForm/MovieForm";
import axios from 'axios';

class MovieEdit extends Component {
    state = {
        movie: null,
        errors: {},
    };

    componentDidMount() {

        fetch(MOVIES_URL + this.props.match.params.id)
            .then(response => {
                return response.json();
            }).then(movie => {
                this.setState(prevState => {
                    const newState = {...prevState};
                    newState.movie = movie;
                    newState.movie.categories = movie.categories.map(category => category.id);
                    return newState;
                });
            }).catch(error => {
                console.log(error);
                console.log(error.response);
            });
    }


    gatherFormData = (movie) => {
        let formData = new FormData();
        Object.keys(movie).forEach(key => {
            const value = movie[key];
            if (value) {
                if(Array.isArray(value)) {
                    value.forEach(item => formData.append(key, item));
                } else {
                    formData.append(key, value);
                }
            }
        });
        return formData;
    };

    formSubmitted = (movie) => {
        const formData = this.gatherFormData(movie);
        return axios.put(MOVIES_URL + this.props.match.params.id + '/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Token ' + localStorage.getItem('auth-token')
            }
        })
            .then(response => {
                const movie = response.data;
                console.log(movie);
                this.props.history.replace('/movies/' + movie.id);
            })
            .catch(error => {
                console.log(error);
                console.log(error.response);
                this.setState({
                    ...this.state,
                    errors: error.response.data
                });
            });
    };

    render() {
        const {errors, movie} = this.state;
        return <Fragment>
            {movie ? <MovieForm onSubmit={this.formSubmitted} movie={movie} errors={errors}/> : null}
        </Fragment>
    }
}

export default MovieEdit;
