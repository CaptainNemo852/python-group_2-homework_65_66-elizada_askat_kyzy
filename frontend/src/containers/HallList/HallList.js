import React, {Fragment, Component} from 'react';
import {HALLS_URL} from "../../urls";
import HallCard from '../../components/HallCard/HallCard';


class HallList extends Component {
    state = {
        halls: []
    };

    componentDidMount() {
        fetch(HALLS_URL)
            .then(response => {
                if (response.ok) return response.json();
                throw new Error("Something wrong with your network request");
            }).then(halls =>
            this.setState({halls: halls}))
            .catch(error => console.log(error))
    }


    hallDelete = (hallId) => {
        fetch(HALLS_URL + hallId + '/', {
            method: "DELETE", headers: {
                'Authorization': 'Token ' + localStorage.getItem('auth-token')
            }
        });
        this.setState(prevState => {
            let newState = {...prevState};
            let halls = [...newState.halls];
            let movieIndex = halls.findIndex(hall => hall.id === hallId);
            halls.splice(movieIndex, 1);
            newState.halls = halls;
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
                    {this.state.halls.map(hall => {
                        return <div className='col-xs-12 col-sm-6 col-lg-4 mt-3' key={hall.id}>
                            <HallCard onDelete={localStorage.getItem('auth-token') ?
                                () => this.hallDelete(hall.id) : () => this.redirectTo()}
                                      hall={hall}/>
                        </div>
                    })}
                </div>
            </Fragment>
        )
    }
}

export default HallList;