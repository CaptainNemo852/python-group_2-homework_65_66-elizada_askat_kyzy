import React, {Component} from 'react'
import DatePicker from "react-datepicker/es";
import Select from "react-select";
import {CATEGORIES_URL} from "../../urls";


class MovieForm extends Component {
    constructor(props) {
        super(props);


        const newMovie = {
            name: "",
            description: "",
            release_date: "",
            finish_date: "",
            poster: null,
            categories: []
        };


        this.state = {
            categories: [],
            submitEnabled: true,
            movie: newMovie,
            posterFileName: "",
        };
        if (this.props.movie) {
            this.state.posterUrl = this.props.movie.poster;
            this.state.movie = this.props.movie;


            this.state.movie.poster = null;

        }
    }

    componentDidMount() {
        fetch(CATEGORIES_URL)
            .then(response => {
                if (response.ok) return response.json();
                throw new Error("Something wrong with your network request");
            }).then(categories => this.setState(prevState => {
            let newState = {...prevState};
            newState.categories = categories;
            return newState;
        }))
            .catch(error => {
                console.log(error)
            })
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

    dateToObject = (date) => {
        return date ? new Date(date) : null;

    };

    getCategoryOptions = () => {
        return this.state.categories.map(category => {
            return {value: category.id, label: category.name}
        })
    };

    getCategoryValue = () => {
        if (this.state.categories.length > 0) {
            return this.state.movie.categories.map(id => {
                const category = this.state.categories.find(category => category.id === id);
                return {value: id, label: category.name}
            })
        }

        return [];
    };

    updateMovieState = (fieldName, value) => {
        this.setState(prevState => {
            let newState = {...prevState};
            let movie = {...prevState.movie};
            movie[fieldName] = value;
            newState.movie = movie;
            return newState;
        })
    };

    inputChanged = (event) => {
        const value = event.target.value;
        const fieldName = event.target.name;
        this.updateMovieState(fieldName, value);
    };

    dateChanged = (field, date) => {
        this.updateMovieState(field, date.toISOString().slice(0, 10));

    };

    selectChanged = (value, fieldName) => {
        const category_value = value.map(item => item.value);
        this.updateMovieState(fieldName, category_value);

    };


    fileChanged = (event) => {
        const fileName = event.target.value;
        const fieldName = event.target.name;
        const fileObject = event.target.files.length > 0 ? event.target.files[0] : null;
        this.updateMovieState(fieldName, fileObject);
        this.setState(prevState => {
            let newState = {...prevState};
            newState[fieldName + 'FileName'] = fileName;
            return newState;
        });
    };

    submitForm = (event) => {
        if (this.state.submitEnabled) {
            event.preventDefault();
            this.disableSubmit();
            this.props.onSubmit(this.state.movie)
                .then(this.enableSubmit);
        }
    };

    showErrors = (name) => {
        if(this.props.errors && this.props.errors[name]) {
            return this.props.errors[name].map((error, index) => <p className="text-danger" key={index}>{error}</p>);
        }
        return null;
    };


    render() {
        if (this.state.movie) {

            const {name, description, release_date, finish_date} = this.state.movie;
            const {posterFileName, submitEnabled} = this.state;

            const releaseDateSelected = this.dateToObject(release_date);
            const finishDateSelected = this.dateToObject(finish_date);

            const selectOptions = this.getCategoryOptions();
            const selectValue = this.getCategoryValue();
            return <div>
                <form onSubmit={this.submitForm}>
                    <div className="form-group">
                        <label className="font-weight-bold">Название</label>
                        <input className="form-control" type="text" name="name" value={name}
                               onChange={this.inputChanged}/>
                        {this.showErrors('name')}
                    </div>
                    <div className="form-group">
                        <label>Описание</label>
                        <input className="form-control" type="text" name="description" value={description}
                               onChange={this.inputChanged}/>
                        {this.showErrors('description')}
                    </div>
                    <div className="form-group">
                        <label className="font-weight-bold">Дата выхода в прокат:</label>
                        <DatePicker dateFormat="yyyy-MM-dd" selected={releaseDateSelected} name="release_date"
                                    className="form-control"
                                    onChange={(date) => this.dateChanged('release_date', date)}/>
                        {this.showErrors('release_date')}
                    </div>
                    <div className="form-group">
                        <label>Дата завершения проката:</label>
                        <DatePicker dateFormat="yyyy-MM-dd" selected={finishDateSelected} className="form-control"
                                    name="finish_date"
                                    onChange={(date) => this.dateChanged('finish_date', date)}/>
                        {this.showErrors('finish_date')}
                    </div>


                    <div className="form-group">
                        <label>Постер</label>
                        <div>
                            <input type="file" name="poster" value={posterFileName} onChange={this.fileChanged}/>
                            {this.state.posterUrl ? <a href={this.state.posterUrl}>Текущий файл</a> : null}
                            {this.showErrors('poster')}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Категории</label>
                        <Select options={selectOptions}
                                value={selectValue}
                                isMulti={true} onChange={(value) => this.selectChanged(value, 'categories')}
                                name="categories"/>
                        {this.showErrors('categories')}
                    </div>
                    <button disabled={!submitEnabled}
                            className="btn btn-primary" type="submit">Сохранить
                    </button>
                </form>
            </div>;
        }
    }
}

export default MovieForm;