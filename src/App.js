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
		query:'',
		Locations:[
          {
            name:'Flechazo',
            type:'Restaurant',
            lat:12.9743,
            lng:77.6974
          },
          {
            name:'Truffles',
            type:'Restaurant',
            lat:12.9334267140,
            lng:77.6143838838
          },
          {
            name:'The Black Pearl',
            type:'Restaurant',
            lat:12.9345,
            lng:77.6160
          },
          {
            name:'Big Pitcher',
            type:'Restaurant',
            lat:12.9602,
            lng:77.6469
          },
          {
            name:'The Hole In the Wall Cafe',
            type:'Restaurant',
            lat:12.9346,
            lng:77.6255
          }
        ]
	}

	/*adapted from http://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/ ------> add map async*/
	componentDidMount=()=> {
        window.initMap = this.initMap;
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCPi0o_tjNjKYYDe_6nYg82r0leI7kKlOE&callback=initMap')
    }
    /*Init Map*/
   initMap=()=> {
    /*New map is created*/
    var map = (document.getElementById('map'));
    map.style.height = window.innerHeight + "px";
      map = new google.maps.Map(map, {
            center: {lat: 12.9699177648, lng: 77.6473036408},
            zoom: 12
        });
      this.setState({
        map:map
      })
     var allLocations=[];
      this.state.Locations.forEach(loc=>{
         var  marker = new google.maps.Marker({
          position:{lat: loc.lat, lng: loc.lng},
          map:map,
          title:loc.name + ", "+ loc.type,
          animation:window.google.maps.Animation.DROP
        })
         allLocations.push(marker);
         /*Add event listener to the marker to open info window*/
        google.maps.event.addListener(marker,'click',()=> {
         this.openInfoWindow(marker);
        })
    })
      /*adapted from https://codepen.io/alexgill/pen/NqjMma ----> to reset the center and decrease the zoom size so that every marker is in the view*/
      	window.onresize = function() {
  		var currCenter = map.getCenter();
  		google.maps.event.trigger(map, 'resize');
  		map.setCenter(currCenter)
  		map.setZoom(11);
	};
      var infowindow = new google.maps.InfoWindow({});
      this.setState({
        infowindow:infowindow
      })
      this.setState({
      	markers:allLocations
      })
      }

      openInfoWindow=(marker)=>{
      	/*Add animation of bounce once the marker is clicked*/
         marker.setAnimation(window.google.maps.Animation.BOUNCE);
         /*client Id as provided by foursquare*/
         var cId = 'KM55HQZ3LWIOEHRQK2CT4IK0IYITFJ5LPCFHJO1G20OGPUMR'
         /*client secret as provided by foursquare*/
         var cSecret = 'MRHPXNTMHJHZUPXY5Z0JNWSYMOWM3DXWNRF2M3GCJK2EXRAK'
         var url = "https://api.foursquare.com/v2/venues/search?client_id=" + cId + "&client_secret=" + cSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng();
         fetch(url)
          .then((res)=>{
            if(res.status !==200)
            {
              this.state.infowindow.setContent('Try again after some time now the data is not acailable');
              return;
            }
            /*https://developer.mozilla.org/en-US/docs/Web/API/Body/json ----> get response and add the details in the info window*/
            res.json()
            .then((data)=>{
              var first_response=data.response.venues[0];
              fetch("https://api.foursquare.com/v2/venues/"+first_response.id+"/?client_id="+cId+"&client_secret="+cSecret+"&v=20180516")
                .then((resp)=>{
                  resp.json()
                    .then(data=>{
                      var resp= data.response.venue;
                       var name = resp.name;
                       console.log(resp);
                       var addressline1 = resp.location.formattedAddress[0];
                       var addressline2 = resp.location.formattedAddress[1]? resp.location.formattedAddress[1] : " " ;
                       var addressline3 = resp.location.formattedAddress[2]? resp.location.formattedAddress[2] : " ";
                       var rating = resp.rating? resp.rating : "Rating not available right now" ;
                       var pricing = resp.price.message? resp.price.message : "Price message not available right now";
                       var contact = resp.contact.phone ? resp.contact.phone : "Contact details not available right now";
                       /*target  = _blank to open in a new tab as mentioned by project reviewer in Portfolio project*/
                       var more_info = '<a href="https://foursquare.com/v/'+ resp.id +'"target="_blank"><b>More Info</b></a>' + '<br>';
                      this.state.infowindow.setContent('<b>' + "Address: " + '</b>' + addressline1 + ', '+ addressline2 + ',' + addressline3 + '<br>' + '<b>' +  "Rating: " + '</b>' + rating  +  '<br>' + '<b>' + "Pricing Range: " + '</b>' + pricing + '<br>' + '<b>' +  "Contact Info: " + '</b>' + contact + '<br>' + more_info)
                      })
                    })
                })
            })
         this.state.infowindow.open(this.state.map, marker);
         /*set the marker animation to null*/
         marker.setAnimation(null);
      }

  render() {
  	var locationlist = this.state.markers.map((mark,index)=>{
						return(<li key={index} id="list_items" value={this.state.query}>{mark.title}</li>)
  	})

    return (
      <div className="App">
      <div className="search" id="nav">
                <input role="search" aria-labelledby="filter" id="search-field" className="search-field" type="text" placeholder="Filter"
                       value={this.state.query} onChange={this.filterLocations}/>
                <ol>
                    {locationlist}
                </ol>
                </div>
      		<div id="map" role="application" tabIndex="-1">
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
    script.onerror = function () {
        document.write("Error in loading Google Map");
    };
    ref.parentNode.insertBefore(script, ref);
}