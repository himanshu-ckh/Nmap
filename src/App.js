/*added to remove error 'google' is not defined ----- https://github.com/tomchentw/react-google-maps/issues/434*/
/*global google*/
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
	state = {
		map:'',
		markers:[],
		infowindow:'',
		places:[
          {
            name:'Burger farm',
            type:'Restaurant',
            lat:26.9063,
            lng:75.7964
          },
          {
            name:'Cafe RJ14',
            type:'Restaurant',
            lat:26.9039,
            lng:75.7947
          },
          {
            name:'Laxmi Narayan Temple',
            type:'Temple',
            lat:26.8925,
            lng:75.8153
          },
          {
            name:'World Trade Park',
            type:'Shopping Mall',
            lat:26.8925,
            lng:75.8153
          },
          {
            name: 'Home Cafe by Mr.Beans',
            type:'Restaurant',
            lat:26.8538,
            lng:75.8052
          },
            {
            name:'Kanha Restaurant Jaipur',
            type:'Restaurant',
            lat:26.9123,
            lng:75.8006
          },
          {
            name:'Hawa Mahal',
            type:'Tourist Place',
            lat:26.9239,
            lng:75.8267
          },
          {
            name:'MGF Metropolitan Mall',
            type:'Shopping Mall',
            lat:26.9027,
            lng:75.7937
          },
          {
            name:'INOX Jaipur - C Scheme / Crystal Palm',
            type:'Shopping Mall',
            lat:26.9034,
            lng:75.7925
          },
          {
          	name:'Cafe F-32',
          	type:'Restaurant',
          	lat:26.9075,
          	lng:75.7956
          }
        ]
	}

	/*adapted from http://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/*/
	componentDidMount=()=> {
        // Connect the initMap() function within this class to the global window context,
        // so Google Maps can invoke it
        window.initMap = this.initMap;
        // Asynchronously load the Google Maps script, passing in the callback reference
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCPi0o_tjNjKYYDe_6nYg82r0leI7kKlOE&callback=initMap')
    }
    //Initializtion of Map
   initMap=()=> {
    //Constructor creates a new map - only center and zoom are required
      var map = new google.maps.Map(document.getElementById('map'),{
            center: {lat: 26.9123, lng: 75.8006},
            zoom: 13
      });
      this.setState({
        map:map
      })
     //Setting the bounds of the Map(It will autozoom and pan itself depending on screen size)
     var bounds  = new google.maps.LatLngBounds();
     var allLocations=[];
      this.state.places.forEach(loc=>{
         var  marker = new google.maps.Marker({
          position:{lat: loc.lat, lng: loc.lng},
          map:map,
          title:loc.name,
          animation:window.google.maps.Animation.DROP
        }) 
         allLocations.push(marker);
        google.maps.event.addListener(marker,'click',()=> {
         this.openInfoWindow(marker);
        })
    })
      var infowindow = new google.maps.InfoWindow({});
      this.setState({
        infowindow:infowindow
      })
      }

      openInfoWindow=(marker)=>{
         marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(function() {
          marker.setAnimation(null);
        }, 3000);
         var clientId = 'KM55HQZ3LWIOEHRQK2CT4IK0IYITFJ5LPCFHJO1G20OGPUMR'
         var clientSecret = 'MRHPXNTMHJHZUPXY5Z0JNWSYMOWM3DXWNRF2M3GCJK2EXRAK'
         var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng();
         this.state.infowindow.setContent("Loading Data..")
         fetch(url)
          .then((res)=>{
            if(res.status !==200)
            {
              this.state.infowindow.setContent('Error in fetching data');
              return;
            }
            res.json()
            .then((data)=>{
              var json=data.response.venues[0];

              fetch("https://api.foursquare.com/v2/venues/"+json.id+"/?client_id="+clientId+"&client_secret="+clientSecret+"&v=20180516")
                .then((resp)=>{
                  resp.json()
                    .then(data=>{
                      var d = data.response.venue;
                       var tipCount = 'Number of Tips: ' + d.stats.tipcount + '<br>';
                       var address = 'Address: ' + d.location.formattedAddress[0] + '<br>';
                      this.state.infowindow.setContent(tipCount + address)

                    })
                })
              //infowindow.setContent(json.name)
            })
          })

         this.state.infowindow.open(this.state.map,marker);
      }

  render() {
    return (
      <div className="App">
      	<div className="map-container" role="application" tabIndex="-1">
      {/*add the map with height of window.innerHeight*/}
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