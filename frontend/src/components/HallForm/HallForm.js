import React, {Component} from 'react'


class HallForm extends Component {
    constructor(props) {
        super(props);


        const newHall = {
            name: ""
        };

        this.state = {
            submitEnabled: true,
            hall: newHall

        };

        if (this.props.hall) {
            this.state.hall = this.props.hall
        }


    }

    disableSubmit = () => {
        this.setState(prevState => {
            let newState = {...prevState};
            newState.submitEnabled = false;
            return newState;
        })
    };

    enableSubmit = () => {
        this.setState(prevState => {
            let newState = {...prevState};
            newState.submitEnabled = true;
            return newState;
        })

    };


    updateHallState = (fieldName, value) => {
        this.setState(prevState => {
            let newState = {...prevState};
            let hall = {...prevState.hall};
            hall[fieldName] = value;
            newState.hall = hall;
            return newState;
        })
    };

    inputChanged = (event) => {
        const value = event.target.value;
        const fieldName = event.target.name;
        this.updateHallState(fieldName, value);

    };

    submitForm = (event) => {
        if (this.state.submitEnabled) {
            event.preventDefault();
            this.disableSubmit();
            this.props.onSubmit(this.state.hall)
                .then(this.enableSubmit);
        }
    };


    render() {
        if (this.state.hall) {

            const {name} = this.state.hall;
            const {submitEnabled} = this.state;


            return <div>
                <form onSubmit={this.submitForm}>
                    <div className="form-group">
                        <label className="font-weight-bold">Название зала</label>
                        <input className="form-control" type="text" name="name" value={name}
                               onChange={this.inputChanged}/>
                    </div>
                    <button disabled={!submitEnabled}
                            className="btn btn-primary" type="submit">Сохранить
                    </button>
                </form>
            </div>
        }
    }

}

export default HallForm;