var React = require('react');
var Router = require('director').Router;
var Palettes = require('./Palettes.react');

var App = React.createClass({
  getInitialState: function() {
    return {
      palettes: []
    }
  },

  componentDidMount: function() {
    this._getJSON('palettes.json', this._updatePalettes);
    this._initRouter();
    this._listenForClicks();
  },

  componentDidUpdate: function() {
    this._listenForClicks();
  },

  render: function() {
    return (
      <div>
        {this._loadHeader()}
        {this.state.view}
      </div>
    )
  },

  _getJSON: function(url, callback) {
    console.log('in _getJSON, AJAX request');
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = callback;
    request.send();
  },

  _updatePalettes: function(e) {
    var statePalettes = this.state.palettes;
    statePalettes.push(JSON.parse(e.target.responseText));
    this.setState({palettes: statePalettes});
  },

  _loadHeader: function() {
    return (
      <div className='header__container'>
        <h1>HexMex</h1>
        <h2>...live colourfully...</h2>
      </div>
    )
  },

  _initRouter: function() {
    var self = this;
    self.router = Router({
      '/': self._setIndex,
      '/palettes/:id': self._setDetails
    });
    self.router.configure({ html5history: true });
    self.router.init();
  },

  _setIndex: function() {
    console.log('in _setIndex');
    this.setState({view: this._renderIndex()});
  },

  _renderIndex: function() {
    console.log('in _renderIndex');
    return (
      <div>
        <Palettes palettes={this.state.palettes} listener={this._listenForClicks} />
      </div>
    )
  },

  _setDetails: function(id) {
    console.log('in _setDetails');
    this.setState({view: this._renderDetails(id)});
  },

  _renderDetails: function(id) {
    console.log('in _renderDetails');
    var justOnePalette = [];
    justOnePalette.push(this.state.palettes[0][id - 1]);
    var tempArr = [];
    tempArr.push(justOnePalette);
    return (
      <div>
        <Palettes palettes={tempArr} listener={this._listenForClicks} />
      </div>
    )
  },

  _listenForClicks: function() {
    var self = this;
    var titleHrefs = document.querySelectorAll("a");
    for (var i=0; i < titleHrefs.length; i++) {
      titleHrefs[i].addEventListener('click', function(e) {
        var targetHref = e.target.attributes.href.value;
        if (targetHref && targetHref[0] === '/') {
          e.preventDefault();
          self.router.setRoute(targetHref);
        };
      })
    }
  }

});

module.exports = App;
