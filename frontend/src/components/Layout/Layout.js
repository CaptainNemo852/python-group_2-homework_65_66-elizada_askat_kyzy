import React, {Fragment} from 'react';
import NavBar from '../../components/UI/NavBar/NavBar';

class Layout extends React.Component {
    render() {
        return (
            <Fragment>
                <header>
                    <NavBar/>
                </header>
                <main className="container">
                    <div className="row">
                        <div className="col col-12">
                            {this.props.children}
                        </div>
                    </div>
                </main>
            </Fragment>
        )
    }
}

export default Layout;
