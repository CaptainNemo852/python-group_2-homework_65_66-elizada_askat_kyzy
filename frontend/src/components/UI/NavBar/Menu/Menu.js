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
        const username = localStorage.getItem('username');
        const userId = localStorage.getItem('id');
        const isAdmin = localStorage.getItem('is_admin');
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
                <ul className="navbar-nav">
                    {username ? [
                        <MenuItem to={"/users/" + userId} key="username">{username}</MenuItem>,
                        <MenuItem to="/logout" key="logout">Выйти</MenuItem>]:[
                        <MenuItem to="/login" key="login">Войти</MenuItem>,
                        <MenuItem to="/register" key="register">Зарегистрироваться</MenuItem>
                    ]}
                </ul>
            </div>
        </Fragment>
    }
}


export default Menu;