var Content = React.createClass({
    loadDictionariesFromServer: function() {
        $.ajax({
            url: this.props.url + '?type=getDictionaries',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    dictionaries: data,
                });
                // If no dictionary selected, select the first one
                if (this.state.currentDictionaryId == '' && this.state.dictionaries[0]) {
                    this.state.currentDictionaryId = this.state.dictionaries[0].id;
                    this.loadWordsFromServer();
                    console.log('Initial dictionary set to', this.state.currentDictionaryId);
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadWordsFromServer: function() {
        if (this.state.currentDictionaryId) {
            $.ajax({
                url: this.props.url + '?type=getWords',
                dataType: 'json',
                cache: false,
                type: 'POST', 
                data: { currentDictionaryId: this.state.currentDictionaryId },
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
        }
    },
    handleWordSubmit: function(word) {
        console.log('Adding word:', word);
        $.ajax({
            url: this.props.url + '?type=addWord',
            dataType: 'json',
            type: 'POST',
            data: { word: word.word,
                    definition: word.definition,
                    currentDictionaryId: this.state.currentDictionaryId },
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleWordDelete: function(id) {
        console.log('Deleting word:', id);
        $.ajax({
            url: this.props.url + '?type=deleteWord',
            dataType: 'json',
            type: 'POST',
            data: {currentDictionaryId: this.state.currentDictionaryId, id: id.id},
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleWordEdit: function(word) {
        console.log('Editing word:', word);
        $.ajax({
            url: this.props.url + '?type=editWord',
            dataType: 'json',
            type: 'POST',
            data: {id: word.id,
                   word: word.word,
                   definition: word.definition,
                   currentDictionaryId: this.state.currentDictionaryId },
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleDictionaryChange: function(id) {
        console.log('Changing dictionary to', id);
        this.state.currentDictionaryId = id;
        this.loadWordsFromServer();
    },
    getInitialState: function() {
        return {
            data: [],
            dictionaries: [],
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
        this.loadWordsFromServer();
        setInterval(this.loadWordsFromServer, this.props.pollInterval);
        //$('.ui.dropdown').dropdown();
    },
    render: function() {
        return (
            <main className="ui page grid">
                <div className="row">
                    <div className="column">
                        <NavBar />
                        <DictionarySelector data={this.state.dictionaries} onDictionaryChange={this.handleDictionaryChange} />
                        <SearchBar filterText={this.state.filterText} onFilterChange={this.handleFilterChange} />
                        <VocabTable data={this.state.data} filterText={this.state.filterText} onWordSubmit={this.handleWordSubmit} onWordDelete={this.handleWordDelete} onWordEdit={this.handleWordEdit} />
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
                <a href="index.php" className="item active">Home</a>
                <a href="dictionaries.php" className="item">Dictionaries</a>
            </nav>
        );
    }
});

var DictionarySelector = React.createClass({
    setDictionaryList: function() {
        var self = this;
        var dictionaryNodes = [];
        var valueCounter = 0;
        $.each(self.props.data, function (index, obj) {
            dictionaryNodes.push(
                <option value={valueCounter} id={obj.id}>{obj.name}</option>
            );
            ++valueCounter;
        });
        return dictionaryNodes;
    },
    getInitialState: function() {
        return {value: ""};
    },
    handleChange: function(e) {
        this.setState({value: e.target.value});
        this.props.onDictionaryChange($(e.target).find('option:selected').attr('id'));
        return;
    },
    render: function() {
        return (
            <div className="ui form" style={{marginTop:'60px'}}>
                <div className="field">
                    <select className="ui dropdown" onChange={this.handleChange} value={this.state.value}>
                        {this.setDictionaryList()}
                    </select>
                </div>
            </div>
        );
    }
});

var SearchBar = React.createClass({
    handleChange: function() {
        this.props.onFilterChange(React.findDOMNode(this.refs.filterText).value);
    },
    render: function() {
        return (
            <div className="ui search" style={{marginTop:'25px'}}>
                <div className="ui icon input">
                    <input className="prompt" type="text" placeholder="Search..." value={this.props.filterText} ref="filterText" onChange={this.handleChange} />
                    <i className="search icon"></i>
                </div>
            </div>
        );
    }
});

var VocabTable = React.createClass({
    setData: function() {
        var self = this;
        var wordNodes = [];
        $.each(self.props.data, function (index, obj) {
            // Check for filterText
            if (obj.word.toLowerCase().indexOf(self.props.filterText.toLowerCase()) !== -1 || obj.definition.toLowerCase().indexOf(self.props.filterText.toLowerCase()) !== -1) {
                wordNodes.push(
                    <Word id={obj.id} word={obj.word} definition={obj.definition} onWordDelete={self.handleWordDelete} onWordEdit={self.handleWordEdit} />
                );
            }
        });
        return wordNodes;
    },
    handleWordSubmit: function(word) {
        this.props.onWordSubmit(word);
    },
    handleWordDelete: function(id) {
        this.props.onWordDelete(id);
    },
    handleWordEdit: function(data) {
        this.props.onWordEdit(data);
    },
    render: function() {
        return (
            <div className="vocabTable container" style={{marginTop:'25px'}}>
                <table className="ui table">
                    <thead>
                        <tr>
                            <th>Word</th>
                            <th>Definition</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="type-1">
                        {this.setData()}
                        <tr>
                            <WordForm onWordSubmit={this.handleWordSubmit} />
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
});

var externalFocusEvent;
var Word = React.createClass({
    toggleEditMode() {
        this.state.editMode = !this.state.editMode;
        if (!this.state.editMode) {
            this.state.editEnterEventBound = false;
        }
        this.forceUpdate();
    },
    handleDelete: function(e) {
        e.preventDefault();
        this.props.onWordDelete({id: this.props.id});
        return;
    },
    handleEditStart: function(e) {
        e.preventDefault();

        // Close any other active word edits
        if (externalFocusEvent) {
            window.dispatchEvent(externalFocusEvent);
        }

        this.toggleEditMode();
    },
    handleExternalFocus: function(e) {
        if (this.state.editMode) {
            this.state.wordEdit = this.props.word;
            this.state.definitionEdit = this.props.definition;
            this.toggleEditMode();
        }
    },
    handleWordChange: function(e) {
        this.setState({wordEdit: e.target.value});
    },
    handleDefinitionChange: function(e) {
        this.setState({definitionEdit: e.target.value});
    },
    handleEditSubmit: function(e) {
        if (e) {
            e.preventDefault();
        }
        this.props.onWordEdit({id:          this.props.id,
                               word:        this.state.wordEdit,
                               definition:  this.state.definitionEdit});
        this.toggleEditMode();
    },
    handleEditCancel: function(e) {
        e.preventDefault();
        this.state.wordEdit = this.props.word;
        this.state.definitionEdit = this.props.definition;
        this.toggleEditMode();
    },
    getInitialState: function() {
        return {editMode:               false,
                editEnterEventBound:    false,
                wordEdit:               this.props.word,
                definitionEdit:         this.props.definition};
    },
    componentDidMount: function() {
        externalFocusEvent = new Event('externalFocus');
        window.addEventListener('externalFocus', this.handleExternalFocus);
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
            // Highlight word input
            React.findDOMNode(this.refs.word).select();
        }
    },
    componentWillUnmount: function() {
        if (externalFocusEvent) {
            window.removeEventListener('externalFocus', this.handleExternalFocus);
        }
    },
    render: function() {
        var wordData = this.state.editMode ?
            (<div className="ui fluid input focus">
                <input className="input--edit" type="text" ref="word" style={{width:'100%'}} value={this.state.wordEdit} onChange={this.handleWordChange} />
            </div>) : this.props.word;
        var definitionData = this.state.editMode ?
            (<div className="ui fluid input focus">
                <input className="input--edit" type="text" ref="definition" style={{width:'100%'}} value={this.state.definitionEdit} onChange={this.handleDefinitionChange} />
            </div>) : this.props.definition;
        var buttonClasses1 = this.state.editMode ? 'ui positive basic button' : 'ui blue basic button';
        var buttonClasses2 = this.state.editMode ? 'ui yellow basic button' : 'ui negative basic button';
        return (
            <tr id={this.props.id}>
                <td>
                    {wordData}
                </td>
                <td>
                    {definitionData}
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

var WordForm = React.createClass({
    handleSubmit: function(e) {
        if (e) {
            e.preventDefault();
        }
        var word = React.findDOMNode(this.refs.word).value.trim();
        var definition = React.findDOMNode(this.refs.definition).value.trim();
        if (!word || !definition) {
            return;
        }
        this.props.onWordSubmit({word: word, definition: definition});
        this.handleClear();
        React.findDOMNode(this.refs.word).focus();
        return;
    },
    handleClear: function() {
        var word = React.findDOMNode(this.refs.word).value = '';
        var definition = React.findDOMNode(this.refs.definition).value = '';
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
            <form className="wordForm">
                <td>
                    <div className="ui fluid input focus">
                        <input className="input--submit" type="text" ref="word" style={{width:'100%'}} placeholder="New Word" />
                    </div>
                </td>
                <td>
                    <div className="ui fluid input focus">
                        <input className="input--submit" type="text" ref="definition" style={{width:'100%'}} placeholder="New Definition" />
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
