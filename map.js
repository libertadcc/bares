var map, view;

require(["esri/config", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/layers/support/FeatureEffect", "esri/views/layers/support/FeatureFilter", "esri/widgets/Search", "esri/widgets/Locate",
"esri/Graphic",

"esri/symbols/SimpleFillSymbol",
"esri/symbols/SimpleLineSymbol",
"esri/symbols/SimpleMarkerSymbol",
"esri/rest/support/Query",

"esri/geometry/Circle",
"esri/renderers/SimpleRenderer",

], function (esriConfig, Map, MapView, FeatureLayer, FeatureEffect, FeatureFilter, Search, Locate,
    
    Graphic,
    SimpleFillSymbol,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    Query,
    
    Circle,
    SimpleRenderer) {

    esriConfig.apiKey = "AAPKb4d29806c3da4e6a8f2fe4dd3def3d2edtDPFIJvwdhKFNqYlGsgqkNmViTk4vhzkdv2oC1aNfxkUYbrrlTEPN76HTWBJgPu";

    map = new Map({
        basemap: "arcgis-navigation" // Basemap layer service
    });

    view = new MapView({
        map: map,
        center: [-3.677463, 40.190119], // Longitude, latitude
        zoom: 15, // Zoom level
        container: "divMap" // Div element
    });

    const search = new Search({  //Add Search widget
        view: view
    });
  
    view.ui.add(search, "top-right");


    function createBuffer() {
        var lineCircle = new SimpleLineSymbol();
        lineCircle.setWidth(2.75);
        lineCircle.setStyle(SimpleLineSymbol.STYLE_DASHDOTDOT);
        lineCircle.setColor(new Color([26, 26, 26, 1]));
        var circleSymbol = new SimpleFillSymbol();
        circleSymbol.setOutline(lineCircle);

        const distance = dom.byId('distance').value;

        circle = new Circle({
          center: {
            x: evt.x,
            y: evt.y,
            spatialReference: evt.spatialReference
          },
          geodesic: true,
          radius: distance,
          radiusUnit: "esriMeters"
        });

        mapMain.graphics.clear();

        var graphic = new Graphic(circle, circleSymbol);

        mapMain.graphics.add(graphic);

    }

    function showRadioForm() {
        console.log('buscado', map);
        console.log('view', view);
        var formRadio = document.getElementById('radio-filter');
        formRadio.classList.remove('hide');
        createBuffer();
    }


    
    search.on('search-complete', showRadioForm);

    // Lo trae el propio geocoder
    // const locate = new Locate({
    //     view: view,
    //     useHeadingEnabled: false,
    //     goToOverride: function(view, options) {
    //       options.target.scale = 1500;
    //       return view.goTo(options.target);
    //     }
    //   });
    //   view.ui.add(locate, "top-left");

    // ****  Capa de bares *****
    // -- Simbología
    var beerIcon = {
        type: "picture-marker",
        // url: "https://www.iconpacks.net/icons/2/free-beer-icon-1786-thumb.png",
        url: "images/beer.png",
        width: 20,
        height: 20
    };

    // -- Renderer
    const barRenderer = {
        "type": "simple",
        "symbol": beerIcon
    };


    // -- Popup
    const barPopup = {
        "title": "Bar {name} // {objectid}",
        "content": "{brand} <br> {addr_street} {addr_city}"
        // datos invent
        // "title": "Bar {Nombre}",
        // "content": "{marca} {precio}€"
    }

    // Popup v2
    const popupOpenspaces = {
        "title": "{Name}",
        "content": [{
          "type": "fields",
          "fieldInfos": [
            {
              "fieldName": "amenity",
              "label": "Establecimiento",
              "visible": true,
              "format": null,
              "stringFieldOption": "text-box"
            },
            {
                "fieldName": "addr_street",
                "label": "Calle",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
            },
            {
                "fieldName": "addr_city",
                "label": "Ciudad/Municipio",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
              {
                "fieldName": "brand",
                "label": "Marca",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
              {
                "fieldName": "objectid",
                "label": "objectid",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
          ]
        }]
      }


    const barLayer = new FeatureLayer({

        url: "https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/ArcGIS/rest/services/OSM_Amenities_EU/FeatureServer/0/",
        // url: "https://services5.arcgis.com/hZQQbQb2B2y1Wd2F/arcgis/rest/services/muestra_bares/FeatureServer/0",
        renderer: barRenderer,
        // popupTemplate: barPopup,
        popupTemplate: popupOpenspaces,
        definitionExpression: "amenity = 'restaurant'",
        outFields: [ "addr_street", "addr_city", "name", "brand", "objectid", "amenity"]
    });


    map.add(barLayer);

    let selectBrands = document.getElementById('selectBrand');
    // selectBrands.addEventListener('change', selectBrand);

    function selectBrand() {
        let selectedBrand = selectBrands.options[selectBrands.selectedIndex].text;
        console.log('hola', selectedBrand)
        if (selectedBrand !== 'todas') {
            const featureFilter = new FeatureFilter({
                where: "Cerveza = " + "'" + selectedBrand + "'"
            });
            barLayer.featureEffect = new FeatureEffect({
                filter: featureFilter,
                includedEffect: "drop-shadow(3px, 3px, 3px, yellow)",
                excludedEffect: "blur(1px) brightness(65%)"
            });
        }

    }


    // Buscar por radio
    var btnRadio = document.getElementById('btnRadio');
    // btnRadio.addEventListener('click', searchRadio);

    function searchRadio(){
        var inputValue = document.getElementById('radioMeters').value;
        console.log('inputValue', inputValue);

        var nullSymbol = new SimpleMarkerSymbol().setSize(0);
        barLayer.setRenderer(new SimpleRenderer(nullSymbol));
    }

});