var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([79, 25]),
    zoom: 4
  })
});
//

var utarray = [235,904,743,748,232,233,235,236,246,249,250,252,747,748,894,893,892,891,890,928,927,926,925,924,923,922,921,920,919,918,917,916,915,914,913,912,911,910,909,908,907,906,905,904,903,902,901,900,899,898,897,896,895,894];
var Hp = [225,228,229,230,231,232,234,237,238,239,240,241,242,243,244,245,247,248,251,253,254,255,256,257,258]
var jkarray = [225,226,228,229,237,271,280,289,290,291,292,293,294,295,296,298,299,300,304,305,306,307,308,310,312,313,314,864,886,888];
var himProv = [5,52,53,220,226,244,934,185,201,202,215,225,228,231,232,246,313,697,859,901,928,934,935,936,214,289,689,889,890,891,892,938,939,940,941,162,165,166,167,174,178,188,189,289];
var no_ofFaults = 0;
var allData = [];
document.addEventListener('click',function(){
  if(allData.length==0){
    $.get('https://geodata-server.herokuapp.com/api/fault_data',function (data,stauts) {
      if(allData.length==0){
        allData.push(JSON.parse(data));

      }

  })
  }
})

function createMap(){
  var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([79, 25]),
    zoom: 4
  })
});
}
var input = document.querySelector(".fault_name");
var error = document.querySelector('.faultError');
input.addEventListener("keypress", function(event) {
  if(event.which == 13){
    event.preventDefault();
    // document.querySelector(".ol-viewport").remove();
    // createMap();
    var faultName = input.value;
    console.log(faultName);
    console.log(typeof(faultName));
    console.log(faultName=="");
    if(faultName==""){
      error.textContent= "please fill the required input";
      return null;
    }
    error.textContent= "";

    var regex = new RegExp(faultName,'ig');
    var featureLength = allData[0].features.length-1;
    var rp;
    no_ofFaults = 0;
    for(rp=0;rp<featureLength;rp++){
      if(allData[0].features[rp].properties.Name.match(regex)){
          no_ofFaults++;
          console.log(rp);
        var coordinateLength = allData[0].features[rp].geometry.coordinates.length;
        var k,i;
        if(allData[0].features[rp].geometry.coordinates[0].length>2){
          var innerCoordinateLength = coordinateLength;
          for(k=0;k<innerCoordinateLength;k++){
            for(i=0;i<allData[0].features[rp].geometry.coordinates[k].length-1;i++){
            var lonlat = ol.proj.fromLonLat([allData[0].features[rp].geometry.coordinates[k][i][0], allData[0].features[rp].geometry.coordinates[k][i][1]]);
                    var location2 = ol.proj.fromLonLat([allData[0].features[rp].geometry.coordinates[k][i+1][0], allData[0].features[rp].geometry.coordinates[k][i+1][1]]);
      
                    //create the line's style
                    var linieStyle = [
                                // linestring
                                new ol.style.Style({
                                  stroke: new ol.style.Stroke({
                                    color: 'red',
                                    width: 2
                                  })
                                })
                              ];
      
                    //create the line       
                    var linie = new ol.layer.Vector({
                            source: new ol.source.Vector({
                            features: [new ol.Feature({
                                geometry: new ol.geom.LineString([lonlat, location2]),
                                name: 'Line',
                                prop :allData[0].features[k].properties
                            })]
                        })
                    });
      
                    //set the style and add to layer
                    linie.setStyle(linieStyle);
                    map.addLayer(linie);
            }         
            }    
        }
        for(k=rp;k<rp+1;k++){
        for(i=0;i<allData[0].features[k].geometry.coordinates.length-1;i++){
        var lonlat = ol.proj.fromLonLat([allData[0].features[k].geometry.coordinates[i][0], allData[0].features[k].geometry.coordinates[i][1]]);
                var location2 = ol.proj.fromLonLat([allData[0].features[k].geometry.coordinates[i+1][0], allData[0].features[k].geometry.coordinates[i+1][1]]);
  
                //create the line's style
                var linieStyle = [
                            // linestring
                            new ol.style.Style({
                              stroke: new ol.style.Stroke({
                                color: 'red',
                                width: 2
                              })
                            })
                          ];
  
                //create the line       
                var linie = new ol.layer.Vector({
                        source: new ol.source.Vector({
                        features: [new ol.Feature({
                            geometry: new ol.geom.LineString([lonlat, location2]),
                            name: 'Line',
                            prop :allData[0].features[k].properties
                        })]
                    })
                });
  
                //set the style and add to layer
                linie.setStyle(linieStyle);
                map.addLayer(linie);
        }         
        }
    }
    }
    var faultNum = document.querySelector('.fault_num');
    var faultDesc = document.querySelector('.found_faults');
    var serachfault = document.querySelector('.searchfaultname');
    if(no_ofFaults>0){
      faultDesc.classList.remove('importNofoundClass');
      faultDesc.classList.add('importFounfClass');
    }
    else{
      faultDesc.classList.remove('importFounfClass')
      faultDesc.classList.add('importNofoundClass');
    }
    serachfault.textContent = `(${faultName})`
    faultNum.textContent = no_ofFaults;
  }
  // function scrollWin() {
  //   window.scrollTo(0, 100);
  // }
  // scrollWin();
    // setTimeout(()=>{
    // console.log("time over");
    // $(document).ready(function() {
 
    //  $('#map_section').animate({
    //     scrollTop: -(document.getElementById('map_section').offsetHeight),                       
    //     }, 1000);        
    // });
      
    // },2000);

});

var linieStyle = [
  // linestring
  new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'red',
      width: 2
    })
  })
];

document.querySelector(".showAllfaults").addEventListener('click',function(){
      var featureLength = allData[0].features.length-1;
      var k,i,m,linie,location2,lonlat,innerCoordinateLength,innerCoordinateLengthArray=[];
      // for(m=0;m<featureLength;m++){
      //   if(allData[0].features[m].geometry){
      //     innerCoordinateLengthArray.push(allData[0].features[m].geometry.coordinates.length);
      //   }
      // }
      // console.log(innerCoordinateLengthArray);
      // console.log(innerCoordinateLengthArray.length);
      // for(k=0;k<featureLength;k++){
      //    for(i=0;i<innerCoordinateLengthArray[k]-1;i++){
      //       lonlat = ol.proj.fromLonLat([allData[0].features[k].geometry.coordinates[i][0], allData[0].features[k].geometry.coordinates[i][1]]);
      //       location2 = ol.proj.fromLonLat([allData[0].features[k].geometry.coordinates[i+1][0], allData[0].features[k].geometry.coordinates[i+1][1]]);

      //         //create the line's style
      //         linieStyle = linieStyle;
      //         //create the line       
      //         linie = new ol.layer.Vector({
      //                 source: new ol.source.Vector({
      //                 features: [new ol.Feature({
      //                     geometry: new ol.geom.LineString([lonlat, location2]),
      //                     name: 'Line',
      //                     prop :allData[0].features[k].properties
      //                 })]
      //             })
      //         });

      //         //set the style and add to layer
      //         linie.setStyle(linieStyle);
      //         map.addLayer(linie);
      // }         
      // }
      var raster = new ol.layer.Tile({
        source: new ol.source.OSM(),
      });
      
      var style = new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'black',
          width: 2,
        }),
      });
      var Point;
      for(k=0;k<featureLength;k++){
        for(i=0;i<innerCoordinateLengthArray[k]-1;i++){
          console.log('ok');
            Point = [];
            Point.push([allData[0].features[k].geometry.coordinates[i][0], allData[0].features[k].geometry.coordinates[i][1]]);
            Point.push([allData[0].features[k].geometry.coordinates[i+1][0], allData[0].features[k].geometry.coordinates[i+1][1]]);
            console.log(Point);
            MakeLine(Point);
        }
      }

      function MakeLine(point){
        var feature = new ol.Feature(
          new ol.geom.LineString(point)
        );
        
        var vector = new ol.layer.Vector({
          source: new ol.source.Vector({
            features: feature,
          }),
          style: style,
        });
        
        map.addLayer(vector);        
      }
        
})
document.getElementById('search').addEventListener('click', function(){
  if(document.getElementById('country_name').value==='India'){
  if(document.getElementById('province_name').value==="Himalaya"){

    for (var k=0;k<himProv.length-1;k++){
      for(var i=0;i<allData[0].features[himProv[k]].geometry.coordinates.length-1;i++){
      var lonlat = ol.proj.fromLonLat([allData[0].features[himProv[k]].geometry.coordinates[i][0], allData[0].features[himProv[k]].geometry.coordinates[i][1]]);
              var location2 = ol.proj.fromLonLat([allData[0].features[himProv[k]].geometry.coordinates[i+1][0], allData[0].features[himProv[k]].geometry.coordinates[i+1][1]]);

              //create the line's style
              var linieStyle = [
                          // linestring
                          new ol.style.Style({
                            stroke: new ol.style.Stroke({
                              color: 'red',
                              width: 2
                            })
                          })
                        ];

              //create the line       
              var linie = new ol.layer.Vector({
                      source: new ol.source.Vector({
                      features: [new ol.Feature({
                          geometry: new ol.geom.LineString([lonlat, location2]),
                          name: 'Line',
                      })]
                  })
              });

              //set the style and add to layer
              linie.setStyle(linieStyle);
              map.addLayer(linie);
    }         
      }

         
  }

 }
if(document.getElementById('state_name').value=='Uttarakhand'){
      for (var k=0;k<utarray.length-1;k++){
      for(var i=0;i<allData[0].features[utarray[k]].geometry.coordinates.length-1;i++){
      var lonlat = ol.proj.fromLonLat([allData[0].features[utarray[k]].geometry.coordinates[i][0], allData[0].features[utarray[k]].geometry.coordinates[i][1]]);
              var location2 = ol.proj.fromLonLat([allData[0].features[utarray[k]].geometry.coordinates[i+1][0], allData[0].features[utarray[k]].geometry.coordinates[i+1][1]]);

              //create the line's style
              var linieStyle = [
                          // linestring
                          new ol.style.Style({
                            stroke: new ol.style.Stroke({
                              color: 'red',
                              width: 2
                            })
                          })
                        ];

              //create the line       
              var linie = new ol.layer.Vector({
                      source: new ol.source.Vector({
                      features: [new ol.Feature({
                          geometry: new ol.geom.LineString([lonlat, location2]),
                          name: 'Line',
                      })]
                  })
              });

              //set the style and add to layer
              linie.setStyle(linieStyle);
              map.addLayer(linie);
    }         
      }

      
  }

if(document.getElementById('state_name').value==='Himachal Pradesh'){

      for(var k=0;k<Hp.length-1;k++){
      for(var i=0;i<allData[0].features[Hp[k]].geometry.coordinates.length-1;i++){
      var lonlat = ol.proj.fromLonLat([allData[0].features[Hp[k]].geometry.coordinates[i][0], allData[0].features[Hp[k]].geometry.coordinates[i][1]]);
              var location2 = ol.proj.fromLonLat([allData[0].features[Hp[k]].geometry.coordinates[i+1][0], allData[0].features[Hp[k]].geometry.coordinates[i+1][1]]);

              //create the line's style
              var linieStyle = [
                          // linestring
                          new ol.style.Style({
                            stroke: new ol.style.Stroke({
                              color: 'red',
                              width: 2
                            })
                          })
                        ];

              //create the line       
              var linie = new ol.layer.Vector({
                      source: new ol.source.Vector({
                      features: [new ol.Feature({
                          geometry: new ol.geom.LineString([lonlat, location2]),
                          name: 'Line',
                      })]
                  })
              });

              //set the style and add to layer
              linie.setStyle(linieStyle);
              map.addLayer(linie);
      }         
      }
    }
    if(document.getElementById('state_name').value==='Jammu kashmir'){
      for(var k=0;k<jkarray.length-1;k++){
      for(var i=0;i<allData[0].features[jkarray[k]].geometry.coordinates.length-1;i++){
      var lonlat = ol.proj.fromLonLat([allData[0].features[jkarray[k]].geometry.coordinates[i][0], allData[0].features[jkarray[k]].geometry.coordinates[i][1]]);
              var location2 = ol.proj.fromLonLat([allData[0].features[jkarray[k]].geometry.coordinates[i+1][0], allData[0].features[jkarray[k]].geometry.coordinates[i+1][1]]);

              //create the line's style
              var linieStyle = [
                          // linestring
                          new ol.style.Style({
                            stroke: new ol.style.Stroke({
                              color: 'red',
                              width: 2
                            })
                          })
                        ];

              //create the line       
              var linie = new ol.layer.Vector({
                      source: new ol.source.Vector({
                      features: [new ol.Feature({
                          geometry: new ol.geom.LineString([lonlat, location2]),
                          name: 'Line',
                      })]
                  })
              });

              //set the style and add to layer
              linie.setStyle(linieStyle);
              map.addLayer(linie);
      }         
      }   
    }
})

var popup = new ol.Overlay({
  element: document.getElementById('popup'),
});
map.addOverlay(popup); 
map.on('click', function(evt){
    var feature = map.forEachFeatureAtPixel(evt.pixel,
      function(feature, layer) {
        return feature;
      });
    console.log(feature);
    if(feature.values_.prop.Id.length>0){
        feature.values_.prop.Id = feature.values_.prop.Id;      
    }
    else{
        feature.values_.prop.Id = "";
    }
      if(feature.values_.prop.Name.length>0){
        feature.values_.prop.Name = feature.values_.prop.Name;      
    }
    else{
        feature.values_.prop.Name = "";
    }
      if(feature.values_.prop.Type.length>0){
        feature.values_.prop.Type = feature.values_.prop.Type;      
    }
    else{
        feature.values_.prop.Type = "";
    }
    var element = popup.getElement();
    var coordinate = evt.coordinate;
    var hdms = ol.coordinate.toStringHDMS(ol.proj.toLonLat(coordinate));  
    $(element).popover('dispose');
    popup.setPosition(coordinate);
    $(element).popover({
    container: element,
    placement: 'top',
    animation: false,
    html: true,
    content:'<p id="fault_id">'+'ID : '+feature.values_.prop.Id +'</p>'+'<p id="fault_name">'+'Name : '+feature.values_.prop.Name+'</p>'+'<p id="falut_type">'+'Type : '+feature.values_.prop.Type + '</p>'
        
    });
    $(element).popover('show');
});


 map.on("pointermove", function(event) {
  var lonlat = ol.proj.transform(event.coordinate, 'EPSG:3857',
  'EPSG:4326');
  document.getElementById('lat').textContent = lonlat[0];
  document.getElementById('long').textContent = lonlat[1];
 });

//  var Point;
//  for(k=0;k<featureLength;k++){
//    for(i=0;i<innerCoordinateLengthArray[k]-1;i++){
//       Point = [];
//       Point.push([allData[0].features[k].geometry.coordinates[i][0], allData[0].features[k].geometry.coordinates[i][1]]);
//       Point.push([allData[0].features[k].geometry.coordinates[i+1][0], allData[0].features[k].geometry.coordinates[i+1][1]]);
//       MakeLine(Point);
//    }
//  }
//  // var points = [ [-89.8802, 32.5804], [-95.04286, 46.9235] ];
//  function MakeLine(points){
//    for (var i = 0; i < points.length; i++) {
//      points[i] = ol.proj.transform(points[i], 'EPSG:4326', 'EPSG:3857');
//  }

//  var featureLine = new ol.Feature({
//      geometry: new ol.geom.LineString(points)
//  });

//  var vectorLine = new ol.source.Vector({});
//  vectorLine.addFeature(featureLine);

//  var vectorLineLayer = new ol.layer.Vector({
//      source: vectorLine,
//      style: new ol.style.Style({
//          fill: new ol.style.Fill({ color: 'orange', weight: 2 }),
//          stroke: new ol.style.Stroke({ color: 'orange', width: 2 })
//      })
//  });

//  map.addLayer(vectorLineLayer);
//  }