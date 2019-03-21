import React, {Fragment, Component} from 'react';
import {HALLS_URL, SHOWS_URL} from "../../urls";
import {NavLink} from 'react-router-dom';
import moment from "moment";
import HallShows from "../../components/HallShows/HallShows";

class HallDetail extends Component {

    state = {
        hall: null,
        shows: []
    };

    componentDidMount() {
        const match = this.props.match;
        fetch(HALLS_URL + match.params.id)
            .then(response => {
                if (response.ok) return response.json();
                throw new Error("Wrong network request")
            }).then(hall => this.setState({hall}))
            .catch(error => console.log(error));
        this.showsRequest(match.params.id);
    }

    showsRequest = (hallId) => {
        const startsAfter = moment().format('YYYY-MM-DD');
        const startsBefore = moment().add(3, 'days').format('YYYY-MM-DD');
        fetch(`${SHOWS_URL}?movie_id=&hall_id=${hallId}&starts_after=${startsAfter}&starts_before=${startsBefore}`)
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
        if (!this.state.hall) return null;
        return <Fragment>
            <div className="col-4 m-auto">
                <div className="card text-center mt-2">
                    <div className="card-body">
                        <h3>{this.state.hall.name}</h3>
                        {this.state.hall.seat.length > 0 ? <p>Места в зале: </p> : null}
                        {this.state.hall.seat.length > 0 ?
                            this.state.hall.seat.map(seat => {
                                return (
                                    <div key={seat.id}>
                                        <span>Ряд: {seat.row}</span> <span>Место: {seat.seat}</span>
                                    </div>
                                );
                            }) : null}
                        {this.state.shows.length > 0 ?
                            <div className="card-footer">
                                <HallShows shows={this.state.shows}/>
                            </div>
                            : null}
                        <NavLink to={'/halls/' + this.state.hall.id + '/edit'}
                                 className="btn btn-primary w-50 mt-2">Edit Hall</NavLink>
                    </div>
                </div>
            </div>
        </Fragment>
    }
}
export default HallDetail;