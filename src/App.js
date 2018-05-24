/*added global google to remove error 'google' is not defined ----- https://github.com/tomchentw/react-google-maps/issues/434*/
/*global google*/
import React, { Component } from 'react';
import './App.css';

class App extends Component {

  state = {
    map:'',
    markers:[],
    infowindow:'',
    query:'',
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
        // Connect the initMap() function within this class to the global window context,
        // so Google Maps can invoke it
        window.initMap = this.initMap;
        // Asynchronously load the Google Maps script, passing in the callback reference
        /*load the map with the API key provided by the google maps*/
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCPi0o_tjNjKYYDe_6nYg82r0leI7kKlOE&callback=initMap')
    }

    /*Init Map ----> to initiliaze the map*/
   initMap=()=> {
    /*New map is created*/
    var map = (document.getElementById('map'));
    /*set the map height to the height of the browser ---> adapted from https://stackoverflow.com/questions/17720202/set-div-height-to-window-innerheight-in-javascript*/
    map.style.height = window.innerHeight + "px";
    /*set the center and zoom for the map*/
      map = new google.maps.Map(map, {
            center: {lat: 12.9602, lng: 77.6469},
            zoom: 13
        });

      /*set map state to map*/
      this.setState({
        map:map
      })

     /*array of markers*/
     var allLocations=[];
     /*when listing are outside the intital zoom area we adjust the boundaries to fit everything inside this captures the south-west and north-east corners of the viewport*/
     var bounds = new google.maps.LatLngBounds();
      this.state.Locations.forEach(loc=>{
         var  marker = new google.maps.Marker({
          /*set the position of the markers to the latitude and longitude of the places*/
          position:{lat: loc.lat, lng: loc.lng},
          map:map,
          /*set the title of the map to the loaction name + location type*/
          title:loc.name + ", "+ loc.type,
          /*set animation of markers to drop*/
          animation:window.google.maps.Animation.DROP
        })
         /*fit the bounds of the map so that every marker is shown*/
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

      /*set the state for markers and set the filteresLocation to allLocation which the used further*/*
      this.setState({
        markers:allLocations,
        filteredLocations:allLocations
      })

      /*adapted from https://codepen.io/alexgill/pen/NqjMma ----> to reset the center and decrease the zoom size so that every marker is in the view*/
        window.onresize = () =>{
        /*get the current center of the map*/
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
        /*Add animation of bounce once the marker is clicked*/
         marker.setAnimation(window.google.maps.Animation.BOUNCE);

         /*set the marker animation to null after 3sec*/
         setTimeout(function() {
          marker.setAnimation(null)
          }, 3000);

         /*get the lat lng of the marker*/
         var latlng = marker.getPosition();
         /*set the marker as the center of the map*/
         this.state.map.setCenter(latlng);

         /*client Id as provided by foursquare*/
         var cId = 'KM55HQZ3LWIOEHRQK2CT4IK0IYITFJ5LPCFHJO1G20OGPUMR'
         /*client secret as provided by foursquare*/
         var cSecret = 'MRHPXNTMHJHZUPXY5Z0JNWSYMOWM3DXWNRF2M3GCJK2EXRAK'
         /*url to fetch the details of the above mentioned places*/
         var url = "https://api.foursquare.com/v2/venues/search?client_id=" + cId + "&client_secret=" + cSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng();
         fetch(url)
          .then((res)=>{
            /*if the response dosent return a valid result the info window content will be set accordingly*/
            if(res.status !==200)
            {
              this.state.infowindow.setContent('Try again after some time, :( now the data is not acailable');
              return;
            }
            /*https://developer.mozilla.org/en-US/docs/Web/API/Body/json ----> get response and add the details in the info window*/
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
                        /*get the 1st address line*/
                       var addressline1 = resp.location.formattedAddress[0];
                       /*if any value is not present in the box it will be handeled accordingly*/
                       /*get the 2nd address line*/
                       var addressline2 = resp.location.formattedAddress[1]? resp.location.formattedAddress[1] : " " ;
                       /*get the 3rd address line*/
                       var addressline3 = resp.location.formattedAddress[2]? resp.location.formattedAddress[2] : " " ;
                       /*get the rating of the location*/
                       var rating = resp.rating? resp.rating : "Rating not available right now :(" ;
                       /*get the pricing range of the location*/
                       var pricing = resp.price? resp.price.message? resp.price.message : "Price message not available right now :(" : "Price is not available right now :(" ;
                       /*get the contact info of the location*/
                       var contact = resp.contact.phone ? resp.contact.phone : "Contact details not available right now :(" ;
                       /*To get more info from foursquare*/
                       /*target  = _blank to open in a new tab as mentioned by project reviewer in Portfolio project*/
                       var more_info = '<a href="https://foursquare.com/v/'+ resp.id +'"target="_blank"><b>More Info</b></a>' + '<br>';
                       /*set the content of the marker*/
                      this.state.infowindow.setContent('<b>' + "Address: " + '</b>' + addressline1 + ', '+ addressline2 + ',' + addressline3 + '<br>' + '<b>' +  "Rating: " + '</b>' + rating  +  '<br>' + '<b>' + "Pricing Range: " + '</b>' + pricing + '<br>' + '<b>' +  "Contact Info: " + '</b>' + contact + '<br>' + more_info);
                      })
                    })
                })
            })
          /*set infowindow to open for thar particular marker*/
         this.state.infowindow.open(this.state.map, marker);
      }

      /*filterPlaces function to filter the places when we type something in the filter box*/
      filterPlaces = (query)=> {
        this.state.infowindow.close();
        /*set the query to lower case*/
        let q = query.toLowerCase();
        /*filter the list items so that it will only display the list items which match the query*/
        var filter = query.toUpperCase();
        /*get the list*/
        var ul = document.getElementById("ulist")
        /*get the list items*/
        var li = ul.getElementsByTagName("li");
        /*from aa the list items show only those items which match the query*/
        for (var i = 0; i < li.length; i++) {
            var a = li[i].getElementsByTagName("a")[0];
              if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                  li[i].style.display = "";
              } else {
                  li[i].style.display = "none";
              }
      }
        /*set the query to the value which is typed in the filter box*/
        this.setState({query:q})
        var loca=[];
        this.state.markers.forEach((marker)=>{
          /*we will first convert the marker to lower case and check if it matches the query ---> adapted from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_js_dropdown_filter*/
          if(marker.title.toLowerCase().indexOf(query)>-1) {
            /*if match set the visibility of that marker ----> only show the markers which match the query*/
            marker.setVisible(true);
            /*push the markers which match, to the newly created loca array*/
            loca.push(marker);
            /*open info window for that particular marker*/
            this.openInfoWindow(marker);
        } else
          {
            /*set the visibility of the marker to false ----> Hide the marker which do not match the query*/
            marker.setVisible(false);
          }
        })
    }

  render() {
    /* this will return the location list*/
    var allLoc = this.state.markers.map((mark,index)=>{
            return(<li key={index} id="list_items" value={this.state.query} onClick={this.openInfoWindow.bind(this,mark)}><a href="#">{mark.title}</a></li>)
    })

    return (
      <div className="App" role="main">
      <nav className="search" id="nav" role="navigation">
      <label htmlFor="drop" className="toggle">Menu</label>
        <input type="checkbox" id="drop"/>
          <ul role="navigation" aria-label="placeList" id="ulist" className="menu">
            {/*added tab index of 1 so that focus directly goes to the search*/}
                <input type="text" placeholder="Search..." role="search" aria-label="search filter" value={this.state.query} className="search_field" onChange={event =>this.filterPlaces(event.target.value)} tabIndex="1"/>
                    {allLoc}
          </ul>
      </nav>
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