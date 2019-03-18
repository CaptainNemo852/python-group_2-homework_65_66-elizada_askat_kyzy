import React, {Component, Fragment} from 'react';
import MenuItem from '../Menu/MenuItem/MenuItem';


class Menu extends Component {

    state = {
      menuCollapse: true,
    };

    toggle = () => {
      this.setState({menuCollapse: !this.state.menuCollapse})
    };


    render() {
        return <Fragment>
            <button onClick={this.toggle}
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
            </button>
            <div className={(this.state.menuCollapse ? "collapse" : "") + " navbar-collapse"} id="navbarNav">
                <ul className="navbar-nav">
                    <MenuItem to="/">Фильмы</MenuItem>
                    <MenuItem to="/movies/create">Добавить фильм</MenuItem>
                    <MenuItem to='/halls/'>Залы</MenuItem>
                    <MenuItem to='/halls/create'>Добавить зал</MenuItem>
                </ul>
            </div>
        </Fragment>
    }
}


export default Menu;