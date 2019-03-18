import React, {Component, Fragment} from 'react';
import {HALLS_URL} from "../../urls";
import HallForm from "../../components/HallForm/HallForm";


class HallEdit extends Component {
    state = {
        hall: null,
        alert: null,
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

    showErrorAlert = (error) => {
        console.log(error);
        this.setState(prevState => {
            let newState = {...prevState};
            newState.alert = {type: 'danger', message: `Hall was not added!`};
            return newState;
        });
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
        return fetch(HALLS_URL + this.props.match.params.id + '/', {method: "PUT", body: formData})
            .then(response => {
                return response.json();
            }).then(hall => this.props.history.replace('/halls/' + hall.id)).catch(error => {
                console.log(error);
                this.showErrorAlert(error.response);
            });
    };

    render() {
        const {alert, hall} = this.state;
        return <Fragment>
            {alert ? <div className={"mb-2 alert alert-" + alert.type}>{alert.message}</div> : null}
            {hall ? <HallForm onSubmit={this.formSubmitted} hall={hall}/> : null}
        </Fragment>
    }
}

export default HallEdit;