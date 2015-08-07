var Content = React.createClass({
    loadDictionariesFromServer: function() {
        $.ajax({
            url: this.props.url + '?type=getDictionaries',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    data: data,
                    filterText: this.state.filterText
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleDictionarySubmit: function(dictionary) {
        console.log('Adding dictionary:', dictionary);
        $.ajax({
            url: this.props.url + '?type=addDictionary',
            dataType: 'json',
            type: 'POST',
            data: { name: dictionary.dictionary },
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleDictionaryDelete: function(id) {
        console.log('Deleting dictionary:', id);
        $.ajax({
            url: this.props.url + '?type=deleteDictionary',
            dataType: 'json',
            type: 'POST',
            data: {id: id.id},
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleDictionaryEdit: function(dictionary) {
        console.log('Editing dictionary:', dictionary);
        $.ajax({
            url: this.props.url + '?type=editDictionary',
            dataType: 'json',
            type: 'POST',
            data: {id: dictionary.id,
                   name: dictionary.dictionary },
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {
            data: [],
            currentDictionaryId: '',
            filterText: ''
        };
    },
    handleFilterChange: function(filterText) {
        this.setState({filterText: filterText});
    },
    componentDidMount: function() {
        this.loadDictionariesFromServer();
        setInterval(this.loadDictionariesFromServer, this.props.pollInterval);
        //$('.ui.dropdown').dropdown();
    },
    render: function() {
        return (
            <main className="ui page grid">
                <div className="row">
                    <div className="column">
                        <NavBar />
                        <SearchBar filterText={this.state.filterText} onFilterChange={this.handleFilterChange} />
                        <DictionaryTable data={this.state.data} filterText={this.state.filterText} onDictionarySubmit={this.handleDictionarySubmit} onDictionaryDelete={this.handleDictionaryDelete} onDictionaryEdit={this.handleDictionaryEdit} />
                    </div>
                </div>
            </main>
        );
    }
});

var NavBar = React.createClass({
    render: function() {
        return (
            <nav className="ui fixed menu inverted navbar">
                <a href="#" className="brand item">Vocabulary List</a>
                <a href="index.php" className="item">Home</a>
                <a href="dictionaries.php" className="item active">Dictionaries</a>
            </nav>
        );
    }
});

var SearchBar = React.createClass({
    handleChange: function() {
        this.props.onFilterChange(React.findDOMNode(this.refs.filterText).value);
    },
    render: function() {
        return (
            <div className="ui search" style={{marginTop:'60px'}}>
                <div className="ui icon input">
                    <input className="prompt" type="text" placeholder="Search..." value={this.props.filterText} ref="filterText" onChange={this.handleChange} />
                    <i className="search icon"></i>
                </div>
            </div>
        );
    }
});


var DictionaryTable = React.createClass({
    setData: function() {
        var self = this;
        var dictionaryNodes = [];
        $.each(self.props.data, function (index, obj) {
            // Check for filterText
            if (obj.name.toLowerCase().indexOf(self.props.filterText.toLowerCase()) !== -1) {
                dictionaryNodes.push(
                    <Dictionary id={obj.id} dictionary={obj.name} onDictionaryDelete={self.handleDictionaryDelete} onDictionaryEdit={self.handleDictionaryEdit} />
                );
            }
        });
        return dictionaryNodes;
    },
    handleDictionarySubmit: function(dictionary) {
        this.props.onDictionarySubmit(dictionary);
    },
    handleDictionaryDelete: function(id) {
        this.props.onDictionaryDelete(id);
    },
    handleDictionaryEdit: function(data) {
        this.props.onDictionaryEdit(data);
    },
    render: function() {
        return (
            <div className="dictionaryTable container" style={{marginTop:'25px'}}>
                <table className="ui table">
                    <thead>
                        <tr>
                            <th colSpan="2">Dictionary</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="type-1">
                        {this.setData()}
                        <tr>
                            <DictionaryForm onDictionarySubmit={this.handleDictionarySubmit} />
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
});

var Dictionary = React.createClass({
    toggleEditMode() {
        this.state.editMode = !this.state.editMode;
        if (!this.state.editMode) {
            this.state.editEnterEventBound = false;
        }
        this.forceUpdate();
    },
    handleDelete: function(e) {
        e.preventDefault();
        this.props.onDictionaryDelete({id: this.props.id});
        return;
    },
    handleEditStart: function(e) {
        e.preventDefault();

        // Close any other active word edits
        if (externalEditEvent) {
            window.dispatchEvent(externalEditEvent);
        }

        this.toggleEditMode();
    },
    handleExternalEdit: function(e) {
        if (this.props.id != e.excepted_id && this.state.editMode) {
            this.state.dictionaryEdit = this.props.dictionary;
            this.toggleEditMode();
        }
    },
    handleDictionaryChange: function(e) {
        this.setState({dictionaryEdit: e.target.value});
    },
    handleEditSubmit: function(e) {
        if (e) {
            e.preventDefault();
        }
        this.props.onDictionaryEdit({id:          this.props.id,
                                     dictionary:  this.state.dictionaryEdit});
        this.toggleEditMode();
    },
    handleEditCancel: function(e) {
        e.preventDefault();
        this.state.dictionaryEdit = this.props.dictionary;
        this.toggleEditMode();
    },
    getInitialState: function() {
        return {editMode:                    false,
                editEnterEventBound:         false,
                dictionaryEdit:              this.props.dictionary};
    },
    componentDidMount: function() {
        externalEditEvent = new Event('externalEdit', { 'detail': this.props.id });
        window.addEventListener('externalEdit', this.handleExternalEdit);
    },
    componentDidUpdate: function() {
        // If editing and enter event hasn't been bound yet
        if (this.state.editMode && !this.state.editEnterEventBound) {
            var self = this;
            // Submit on enter key
            $('.input--edit').keypress(function(e) {
                if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                    self.handleEditSubmit(e);
                    return false;
                } else {
                    return true;
                }
            });
            this.state.editEnterEventBound = true;
            // Highlight dictionary input
            React.findDOMNode(this.refs.dictionary).select();
        }
    },
    componentWillUnmount: function() {
        if (externalEditEvent) {
            window.removeEventListener('externalEdit', this.handleExternalEdit);
        }
    },
    render: function() {
        var dictionaryData = this.state.editMode ?
            (<div className="ui fluid input focus">
                <input className="input--edit" type="text" ref="dictionary" style={{width:'100%'}} value={this.state.dictionaryEdit} onChange={this.handleDictionaryChange} />
            </div>) : this.props.dictionary;
        var buttonClasses1 = this.state.editMode ? 'ui positive basic button' : 'ui blue basic button';
        var buttonClasses2 = this.state.editMode ? 'ui yellow basic button' : 'ui negative basic button';
        return (
            <tr id={this.props.id}>
                <td colSpan="2">
                    {dictionaryData}
                </td>
                <td>
                    <div className="ui buttons">
                        <div className={buttonClasses1} onClick={this.state.editMode ? this.handleEditSubmit : this.handleEditStart}>{this.state.editMode ? 'Done' : 'Edit'}</div>
                        <div className={buttonClasses2} onClick={this.state.editMode ? this.handleEditCancel : this.handleDelete}>{this.state.editMode ? 'Cancel' : 'Delete'}</div>
                    </div>
                </td>
            </tr>
        );
    }
});

var DictionaryForm = React.createClass({
    handleSubmit: function(e) {
        if (e) {
            e.preventDefault();
        }
        var dictionary = React.findDOMNode(this.refs.dictionary).value.trim();
        if (!dictionary) {
            return;
        }
        this.props.onDictionarySubmit({dictionary: dictionary});
        this.handleClear();
        React.findDOMNode(this.refs.dictionary).focus();
        return;
    },
    handleClear: function() {
        var dictionary = React.findDOMNode(this.refs.dictionary).value = '';
        return;
    }, 
    componentDidMount: function() {
        var self = this;
        // Submit on enter key
        $('.input--submit').keypress(function(e) {
            if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                self.handleSubmit();
                return false;
            } else {
                return true;
            }
        });
    },
    render: function() {
        return (
            <form className="dictionaryForm">
                <td colSpan="2">
                    <div className="ui fluid input focus">
                        <input className="input--submit" type="text" ref="dictionary" style={{width:'100%'}} placeholder="New Dictionary" />
                    </div>
                </td>
                <td>
                    <div className="ui buttons">
                        <div className="positive ui basic button" onClick={this.handleSubmit}>Add</div>
                        <div className="ui yellow basic button" onClick={this.handleClear}>Clear</div>
                    </div>
                </td>
            </form>
        );
    }
});

React.render(
    <Content url="php/dataManager.php" pollInterval={1000} />,
    document.getElementById('content')
);
