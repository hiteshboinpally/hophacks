import React, {Component} from 'react';
import './App.css';
import CarInformation from "./CarInformation";
import RouteInputs from "./RouteInputs";

class App extends Component {

  constructor(props) {
    super(props);

  }

/*
  render() {
      async getRouteStoppages(){
          var routes=[
              { label:'Erkner',
                  request:{
                      origin: new google.maps.LatLng(52.524268, 13.406290000000013),
                      destination: new google.maps.LatLng(52.4244119, 13.749783200000024),
                      travelMode: google.maps.DirectionsTravelMode.DRIVING},
                  rendering:{marker:{icon: 'http://labs.google.com/ridefinder/images/mm_20_blue.png'},draggable:true}
              },
              { label:'Potsdam',
                  request:{
                      origin: new google.maps.LatLng(52.524268, 13.406290000000013),
                      destination: new google.maps.LatLng(52.3941887, 13.072690999999963),
                      travelMode: google.maps.DirectionsTravelMode.DRIVING},
                  rendering:{marker:{icon: 'http://labs.google.com/ridefinder/images/mm_20_red.png'},draggable:true}
              },
              { label:'Bernau',
                  request:{
                      origin: new google.maps.LatLng(52.524268, 13.406290000000013),
                      destination: new google.maps.LatLng(52.683483, 13.587553999999955),
                      travelMode: google.maps.DirectionsTravelMode.DRIVING},
                  rendering:{marker:{icon: 'http://labs.google.com/ridefinder/images/mm_20_yellow.png'},draggable:true}
              }
          ];
          var bounds=new google.maps.LatLngBounds();

          var dists=[5000,3000,1000];
          var selects=document.createElement('select');
          list=document.getElementsByTagName('ul')[0];
          for(var d=0;d<dists.length;++d)
          {
              selects.options[selects.options.length]=new Option(dists[d],dists[d],d==0,d==0);
          }

          for(var r=0;r<routes.length;++r)
          {
              bounds.extend(routes[r].request.destination);
              routes[r].rendering.routeId='r'+r+new Date().getTime();
              routes[r].rendering.dist=dists[0];
              var select=selects.cloneNode(true);
              select.setAttribute('name',routes[r].rendering.routeId);
              select.onchange=function(){directions[this.name].renderer.dist=this.value;setMarkers(this.name)};
              list.appendChild(document.createElement('li'));
              list.lastChild.appendChild(select);
              list.lastChild.appendChild(document.createTextNode(routes[r].label));

              requestRoute(routes[r],map);
          }
          map.fitBounds(bounds) ;
      }

     */
    render(){

      return (
        <div className="App">
          <div>
            <h1>
              EVgas
            </h1>
          </div>
          <link href="https://fonts.googleapis.com/css?family=Be+Vietnam|Nunito|Quicksand&display=swap"
                rel="stylesheet"/>
          <header className="App-header">
            <p>
              Please choose the make and model type of two cars you wish to compare.
            </p>
          <CarInformation/>
              <p>
              Now input your origin and destination addresses.
              </p>
          <RouteInputs/>
          </header>
        </div>
    );
  }
}

export default App;




