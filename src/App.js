/*added global google to remove error 'google' is not defined ----- https://github.com/tomchentw/react-google-maps/issues/434*/
/*global google*/
import React, { Component } from 'react';
import './App.css';
import Listview from './Listview'
class App extends Component {
  state = {
    map:'',
    markers:[],
    infowindow:'',
    filteredLocations: [],
    Locations:[
          {
            name:'Flechazo',
            type:'Restaurant',
            lat:12.9743,
            lng:77.6974
          },
          {
            name:'Church Street Social',
            type:'Bar',
            lat:12.9756,
            lng:77.6026
          },
          {
            name:'Arbor Brewing Company',
            type:'Restaurant',
            lat:12.9701,
            lng:77.6109
          },
          {
            name:'Toit Brew',
            type:'Pub',
            lat:12.9792514,
            lng:77.6405569
          },
          {
            name:'Brew Meister',
            type:'Restaurant',
            lat:12.9263987633,
            lng:77.5847934186
          },
          {
            name:'Echoes Koramangala',
            type:'Restaurant',
            lat:12.93409996450881,
            lng:77.6156990491299
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
        /*load the map with the API key provided by the google maps*/
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCPi0o_tjNjKYYDe_6nYg82r0leI7kKlOE&callback=initMap')
    }
    /*Init Map ----> to initiliaze the map*/
   initMap=()=> {
    /*New map is created*/
    var map = (document.getElementById('map'));
    /*set the map height to the height of the browser ---> adapted from https://stackoverflow.com/questions/17720202/set-div-height-to-window-innerheight-in-javascript*/
    map.style.height = window.innerHeight + "px";
      map = new google.maps.Map(map, {
            center: {lat: 12.9602, lng: 77.6469},
            zoom: 13
        });
      this.setState({
        map:map
      })
     /*array of markers*/
     var allLocations=[];
     /*when listing are outside the intital zoom area we adjust the boundaries to fit everything inside this captures the south-west and north-east corners of the viewport*/
     var bounds = new google.maps.LatLngBounds();
      this.state.Locations.forEach(loc=>{
         var  marker = new google.maps.Marker({
          position:{lat: loc.lat, lng: loc.lng},
          map:map,
          title:loc.name + ", "+ loc.type,
          animation:window.google.maps.Animation.DROP
        })
         map.fitBounds(bounds);
         /*push the marker to the array of markers*/
         allLocations.push(marker);
         /*extend the boundaries of the map for each marker*/
         bounds.extend(marker.position);
         /*Add event listener to the marker to open info window on that marker*/
        google.maps.event.addListener(marker,'click',()=> {
         this.openInfoWindow(marker);
        })
    })
      this.setState({
        markers:allLocations,
        filteredLocations:allLocations
      })
      /*adapted from https://codepen.io/alexgill/pen/NqjMma ----> to reset the center and decrease the zoom size so that every marker is in the view*/
        window.onresize = () =>{
        var currCenter = map.getCenter();
        google.maps.event.trigger(map, 'resize');
        map.setCenter(currCenter)
        map.fitBounds(bounds);
        map.panToBounds(bounds);
  };
    /*creating info window and set the state -------- set the max width of the infowindow also*/
      var infowindow = new google.maps.InfoWindow({ maxWidth: 120 });
      this.setState({
        infowindow:infowindow
      })
      /*add event listener to the close button in the marker to close the info window and set the map center again*/
      google.maps.event.addListener(infowindow, 'closeclick', ()=> {
          map.setCenter({lat:12.9602, lng:77.6469});
          infowindow.close();
        });
      /*when clicked on the map it will close the info window*/
      google.maps.event.addListener(map, 'click',()=>{
        this.state.map.setCenter({lat:12.9602, lng:77.6469});
        this.state.infowindow.close();
      })
      }
      /*open info window function to display the content using foursquare api*/
      openInfoWindow=(marker)=>{
         marker.setAnimation(window.google.maps.Animation.BOUNCE);
         /*set the marker animation to null after 1400ms so that it bounce for 2 times*/
         setTimeout(function() {
          marker.setAnimation(null)
          }, 1400);
         /*get the lat lng of the marker*/
         var latlng = marker.getPosition();
         /*set the marker as the center of the map*/
         this.state.map.setCenter(latlng);
         var cId = 'KM55HQZ3LWIOEHRQK2CT4IK0IYITFJ5LPCFHJO1G20OGPUMR'
         var cSecret = 'MRHPXNTMHJHZUPXY5Z0JNWSYMOWM3DXWNRF2M3GCJK2EXRAK'
         /*url to fetch the details of the above mentioned places*/
         var url = "https://api.foursquare.com/v2/venues/search?client_id=" + cId + "&client_secret=" + cSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng();
         fetch(url)
          .then((res)=>{
            if(res.status !==200)
            {
              this.state.infowindow.setContent('Try again after some time, :( now the data is not available');
              return;
            }
            res.json()
            .then((data)=>{
              /* get the first reponse*/
              var first_response=data.response.venues[0];
              /*fetch the url as mentioned in the foursquare api to display the result*/
              fetch("https://api.foursquare.com/v2/venues/"+first_response.id+"/?client_id="+cId+"&client_secret="+cSecret+"&v=20180516")
                .then((resp)=>{
                  resp.json()
                    .then(data=>{
                      /*resp is where all the content is stored for a particular location*/
                      var resp= data.response.venue;
                      /*Get the formatted address of the loacion*/
                       var addressline1 = resp.location.formattedAddress[0];
                       var addressline2 = resp.location.formattedAddress[1]? resp.location.formattedAddress[1] : " " ;
                       var addressline3 = resp.location.formattedAddress[2]? resp.location.formattedAddress[2] : " " ;
                       var rating = resp.rating? resp.rating : "Rating not available right now :(" ;
                       var pricing = resp.price? resp.price.message? resp.price.message : "Price message not available right now :(" : "Price is not available right now :(" ;
                       var contact = resp.contact.phone ? resp.contact.phone : "Contact details not available right now :(" ;
                       /*target  = _blank to open in a new tab as mentioned by project reviewer in Portfolio project*/
                       var more_info = '<a href="https://foursquare.com/v/'+ resp.id +'"target="_blank"><b>More Info</b></a>' + '<br>';
                       /*set the content of the marker*/
                      this.state.infowindow.setContent('<b>' + "Address: " + '</b>' + addressline1 + ', '+ addressline2 + ',' + addressline3 + '<br>' + '<b>' +  "Rating: " + '</b>' + rating  +  '<br>' + '<b>' + "Pricing Range: " + '</b>' + pricing + '<br>' + '<b>' +  "Contact Info: " + '</b>' + contact + '<br>' + more_info);
                      })
                    })
                    .catch(function (err) {
                      alert("Sorry Foursqare api is not available right now");
                    });
                })
            })
                .catch(function (err) {
                alert("Sorry Foursqare api is not available right now");
            });
          /*set infowindow to open for thar particular marker*/
         this.state.infowindow.open(this.state.map, marker);
      } 
  render =() => {
    return (
      <div className="App" role="main">
      {/*---Added new component beacuse its the best feature of react which makes it easy to use---*/}
      <Listview markers={this.state.markers} markers={this.state.markers} openInfoWindow={this.openInfoWindow} infowindow={this.state.infowindow} />
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
