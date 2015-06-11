var Content = React.createClass({
    render: function() {
        return (
            <div>
                <NavBar />
                <VocabTable />
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
                        <WordList />
                        <NewWordForm />
                    </tbody>
                </table>
            </div>
        );
    }
});

var WordList = React.createClass({
    render: function() {
        return (
            <tr>
                <td>Ruby</td>
                <td>Test</td>
                <td>!</td>
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
                        <button type="submit" className="btn btn-success" id="addButton">Add</button>
                        <button type="button" className="btn btn-warning" id="clearButton">Clear</button>
                    </div>
                </td>
            </tr>
        );
    }
});

React.render(
    <Content />,
    document.getElementById('content')
);

/*
*/
