var Content = React.createClass({
    loadWordsFromServer: function() {
        $.ajax({
            url: this.props.url + "?type=getWords",
            //url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
                //console.log(data);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleWordSubmit: function(word) {
        $.ajax({
            url: this.props.url + "?type=addWord",
            dataType: 'json',
            type: 'POST',
            data: word,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleWordDelete: function(id) {
        $.ajax({
            url: this.props.url + "?type=deleteWord",
            dataType: 'json',
            type: 'POST',
            data: id,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return { data: [] };
    },
    componentDidMount: function() {
        this.loadWordsFromServer();
        setInterval(this.loadWordsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div>
                <NavBar />
                <VocabTable data={this.state.data} onWordSubmit={this.handleWordSubmit} onWordDelete={this.handleWordDelete} />
            </div>
        );
    }
});

var NavBar = React.createClass({
    render: function() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#">Vocabulary List</a>
                    </div>
                    <div id="navbar" className="collapse navbar-collapse">
                        <ul className="nav navbar-nav">
                            <li className="active"><a href="#">Home</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
});

var VocabTable = React.createClass({
    setData: function() {
        var self = this;
        var wordNodes = [];
        $.each(self.props.data, function (index, obj) {
            wordNodes.push(
                <Word id={obj.id} word={obj.word} definition={obj.definition} onWordDelete={self.handleWordDelete} />
            );
        });
        return wordNodes;
    },
    handleWordSubmit: function(word) {
        this.props.onWordSubmit(word);
    },
    handleWordDelete: function(id) {
        this.props.onWordDelete(id);
    },
    render: function() {
        return (
            <div className="vocabTable container">
                <table className="table table-striped table-hover table-bordered" style={{marginTop:'90px'}}>
                    <thead>
                        <tr>
                            <td>Word</td>
                            <td>Definition</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
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

var Word = React.createClass({
    handleDelete: function(e) {
        e.preventDefault();
        this.props.onWordDelete(this.props.id);
        return;
    },
    render: function() {
        return (
            <tr>
                <td>{this.props.word}</td>
                <td>{this.props.definition}</td>
                <td>
                    <div className="form-group">
                        <button type="button" className="btn btn-default" id="editButton" style={{marginRight:'10px'}}>Edit</button>
                        <button type="button" className="btn btn-danger" id="deleteButton" onClick={this.handleDelete}>Delete</button>
                    </div>
                </td>
            </tr>
        );
    }
});

var WordForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var word = React.findDOMNode(this.refs.word).value.trim();
        var definition = React.findDOMNode(this.refs.definition).value.trim();
        if (!word || !definition) {
            return;
        }
        this.props.onWordSubmit({word: word, definition: definition});
        var word = React.findDOMNode(this.refs.word).value = '';
        var definition = React.findDOMNode(this.refs.definition).value = '';
        return;
    },
    render: function() {
        return (
            <form className="wordForm">
                <td><input type="text" className="form-control" ref="word" placeholder="New Word" /></td>
                <td><input type="text" className="form-control" ref="definition" placeholder="New Definition" /></td>
                <td>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" onClick={this.handleSubmit} style={{marginRight:'10px'}}>Add</button>
                        <button type="button" className="btn btn-warning">Clear</button>
                    </div>
                </td>
            </form>
        );
    }
});

var data = [
    {word: "hello", definition: "world"},
    {word: "credential", definition: "helper"}
]

React.render(
    <Content url="php/dataManager.php" pollInterval={1000} />,
    document.getElementById('content')
);
