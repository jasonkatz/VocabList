var Content = React.createClass({
    render: function() {
        return (
            <div>
                <NavBar />
                <VocabTable data={this.props.data} />
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
    render: function() {
        return (
            <div className="container">
                <table className="table table-striped table-hover table-bordered" style={{marginTop:'90px'}}>
                    <thead>
                        <tr>
                            <td>Word</td>
                            <td>Definition</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        <WordList data={this.props.data} />
                        <NewWordForm />
                    </tbody>
                </table>
            </div>
        );
    }
});

var WordList = React.createClass({
    render: function() {
        var wordNodes = this.props.data.map(function (pair) {
            return (
                <Word word={pair.word} definition={pair.definition} />
            );
        });
        return (
            <div className="wordList">
                {wordNodes}
            </div>
        );
    }
});

var Word = React.createClass({
    render: function() {
        return (
            <tr>
                <td>{this.props.word}</td>
                <td>{this.props.definition}</td>
                <td>
                    <div className="form-group">
                        <button type="button" className="btn btn-default" id="editButton" style={{marginRight:'10px'}}>Edit</button>
                        <button type="button" className="btn btn-danger" id="deleteButton">Delete</button>
                    </div>
                </td>
            </tr>
        );
    }
});

var NewWordForm = React.createClass({
    render: function() {
        return (
            <tr>
                <td><input type="text" className="form-control" id="newWord" placeholder="New Word" /></td>
                <td><input type="text" className="form-control" id="newDefinition" placeholder="New Definition" /></td>
                <td>
                    <div className="form-group">
                        <button type="submit" className="btn btn-success" id="addButton" style={{marginRight:'10px'}}>Add</button>
                        <button type="button" className="btn btn-warning" id="clearButton">Clear</button>
                    </div>
                </td>
            </tr>
        );
    }
});

var data = [
    {word: "hello", definition: "world"},
    {word: "credential", definition: "helper"}
]

React.render(
    <Content data={data} url="words.json" />,
    document.getElementById('content')
);
