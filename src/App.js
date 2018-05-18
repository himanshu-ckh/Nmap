/*global google*/
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
	state = {
		map:''
	}
	componentDidMount=()=> {
        // Connect the initMap() function within this class to the global window context,
        // so Google Maps can invoke it
        window.initMap = this.initMap;
        // Asynchronously load the Google Maps script, passing in the callback reference
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCp52sIKoRWI-CEztzGFakaIXW1mx8-3z4&callback=initMap')
    }
     initMap=()=> {
    //Constructor creates a new map - only center and zoom are required
      var map = new google.maps.Map(document.getElementById('map'),{
            center: {lat: 26.9124, lng: 75.7873},
            zoom: 14
      });
      this.setState({map:map})
  }
  render() {
    return (
      <div className="App">
      	<div className="map-container" role="application" tabIndex="-1">
      		<div id="map" style={{height: window.innerHeight + "px",}}>
      		</div>
      	</div>
      </div>
    );
  }
}

export default App;

function loadMapJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
}