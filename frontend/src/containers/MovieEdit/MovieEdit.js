import React, {Component, Fragment} from 'react';
import {MOVIES_URL} from "../../urls";
import MovieForm from "../../components/MovieForm/MovieForm";


class MovieEdit extends Component {
    state = {
        movie: null,

        alert: null,
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

    showErrorAlert = (error) => {
        console.log(error);
        this.setState(prevState => {
            let newState = {...prevState};
            newState.alert = {type: 'danger', message: `Movie was not added!`};
            return newState;
        });
    };

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
        return fetch(MOVIES_URL + this.props.match.params.id + '/', {method: "PUT", body: formData})
            .then(response => {
                return response.json();
            }).then(movie => this.props.history.replace('/movies/' + movie.id)).catch(error => {
                console.log(error);
                this.showErrorAlert(error.response);
            });
    };

    render() {
        const {alert, movie} = this.state;
        return <Fragment>
            {alert ? <div className={"mb-2 alert alert-" + alert.type}>{alert.message}</div> : null}
            {movie ? <MovieForm onSubmit={this.formSubmitted} movie={movie}/> : null}
        </Fragment>
    }
}

export default MovieEdit;
