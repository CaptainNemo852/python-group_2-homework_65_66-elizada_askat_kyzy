import React, {Component, Fragment} from 'react';
import {HALLS_URL} from "../../urls";
import HallForm from "../../components/HallForm/HallForm";
import axios from 'axios';

class HallEdit extends Component {
    state = {
        hall: null,
        errors: {}
    };

    componentDidMount() {
        fetch(HALLS_URL + this.props.match.params.id)
            .then(response => {
                return response.json();
            }).then(hall => {
                this.setState(prevState => {
                    const newState = {...prevState};
                    newState.hall = hall;
                    return newState;
                });
            }).catch(error => {
                console.log(error);
                console.log(error.response);
            });
    }


    gatherFormData = (hall) => {
        let formData = new FormData();
        Object.keys(hall).forEach(key => {
            const value = hall[key];
            if (value) formData.append(key, value);
        });
        return formData;
    };

    formSubmitted = (hall) => {
        const formData = this.gatherFormData(hall);
        return axios.put(HALLS_URL + this.props.match.params.id + '/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Token ' + localStorage.getItem('auth-token')
            }
        })
            .then(response => {
                const hall = response.data;
                console.log(hall);
                this.props.history.replace('/halls/' + hall.id);
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
        const {errors, hall} = this.state;
        return <Fragment>
            {hall ? <HallForm onSubmit={this.formSubmitted} hall={hall} errors={this.state.errors}/> : null}
        </Fragment>
    }
}

export default HallEdit;