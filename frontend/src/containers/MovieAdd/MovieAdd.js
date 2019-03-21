import React, {Component, Fragment} from 'react';
import {MOVIES_URL} from "../../urls";
import MovieForm from "../../components/MovieForm/MovieForm";
import axios from 'axios';

class MovieAdd extends Component {

    state = {
        errors: {}
    };

    gatherFormData = (movie) => {
        let formData = new FormData();
        Object.keys(movie).forEach(key => {
            const value = movie[key];
            if (value) {
                if (Array.isArray(value)) {
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
        return axios.post(MOVIES_URL, formData, {
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
                    errors: error.response.data
                })
            });
    };
    render() {
        return <Fragment>
            <MovieForm onSubmit={this.formSubmitted} errors={this.state.errors}/>
        </Fragment>
    }
}

export default MovieAdd;