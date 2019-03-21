import React, {Component, Fragment} from 'react';
import {HALLS_URL} from "../../urls";
import HallForm from "../../components/HallForm/HallForm";
import axios from 'axios';


class HallAdd extends Component {

    state = {
        errors: {}
    };


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
        return axios.post(HALLS_URL, formData, {
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
                    errors: error.response.data
                })

            });
    };

    render() {
        return <Fragment>
            <HallForm onSubmit={this.formSubmitted} errors={this.state.errors}/>
        </Fragment>
    }
}

export default HallAdd;