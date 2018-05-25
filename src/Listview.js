import React, { Component } from 'react';

class Listview extends Component{
  state = {
    query: ''
  }
  /*filterPlaces function to filter the places when we type something in the filter box*/
      filterPlaces = (query)=> {
        this.props.infowindow.close();
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
        this.props.markers.forEach((marker)=>{
          /*we will first convert the marker to lower case and check if it matches the query ---> adapted from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_js_dropdown_filter*/
          if(marker.title.toLowerCase().indexOf(query)>-1) {
            /*if match set the visibility of that marker ----> only show the markers which match the query*/
            marker.setVisible(true);
            /*push the markers which match, to the newly created loca array*/
            loca.push(marker);
            /*open info window for that particular marker*/
            this.props.openInfoWindow(marker);
        } else
          {
            /*set the visibility of the marker to false ----> Hide the marker which do not match the query*/
            marker.setVisible(false);
          }
        })
    }

render = ()=> {
	/* this will return the location list*/
    var allLoc = this.props.markers.map((mark,index)=>{
    	/*added class instead of id */
            return(<li key={index} className="list_items" role="listbox" value={this.state.query} onClick={this.props.openInfoWindow.bind(this,mark)}><a href="#">{mark.title}</a></li>)
    })
	return (
		<div>
		<nav className="search" id="nav" role="navigation">
      		<label htmlFor="drop" className="toggle">Menu</label>
        		<input type="checkbox" id="drop"/>
          		<ul role="navigation" aria-label="placeList" id="ulist" className="menu">
            		{/*added tab index of 1 so that focus directly goes to the search*/}
                <input type="text" placeholder="Search..." role="search" aria-label="search filter" value={this.state.query} className="search_field" onChange={event =>this.filterPlaces(event.target.value)} tabIndex="1"/>
                    {allLoc}
          		</ul>
      	</nav>
      	</div>
		)
}
}

export default Listview;
