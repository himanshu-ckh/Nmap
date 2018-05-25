import React, { Component } from 'react';

class Listview extends Component{
render = ()=> {
	/* this will return the location list*/
    var allLoc = this.props.markers.map((mark,index)=>{
    	/*added class instead of id */
            return(<li key={index} class="list_items" value={this.props.query} onClick={this.props.openInfoWindow.bind(this,mark)}><a href="#">{mark.title}</a></li>)
    })
	return (
		<div>
		<nav className="search" id="nav" role="navigation">
      		<label htmlFor="drop" className="toggle">Menu</label>
        		<input type="checkbox" id="drop"/>
          		<ul role="navigation" aria-label="placeList" id="ulist" className="menu">
            		{/*added tab index of 1 so that focus directly goes to the search*/}
                <input type="text" placeholder="Search..." role="search" aria-label="search filter" value={this.props.query} className="search_field" onChange={event =>this.props.filterPlaces(event.target.value)} tabIndex="1"/>
                    {allLoc}
          		</ul>
      	</nav>
      	</div>
		)
}
}

export default Listview;