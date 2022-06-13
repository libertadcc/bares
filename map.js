require(["esri/config", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/layers/support/FeatureEffect", "esri/views/layers/support/FeatureFilter"], function (esriConfig, Map, MapView, FeatureLayer, FeatureEffect, FeatureFilter) {

    esriConfig.apiKey = "AAPKb4d29806c3da4e6a8f2fe4dd3def3d2edtDPFIJvwdhKFNqYlGsgqkNmViTk4vhzkdv2oC1aNfxkUYbrrlTEPN76HTWBJgPu";

    const map = new Map({
        basemap: "arcgis-navigation" // Basemap layer service
    });

    const view = new MapView({
        map: map,
        center: [-3.677463, 40.190119], // Longitude, latitude
        zoom: 15, // Zoom level
        container: "divMap" // Div element
    });


    // ****  Capa de bares *****
    // -- Simbología
    var beerIcon = {
        type: "picture-marker",
        url: "https://www.iconpacks.net/icons/2/free-beer-icon-1786-thumb.png",
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
        "title": "Bar {Nombre}",
        "content": "{Cerveza} {Precio}€"
    }


    const barLayer = new FeatureLayer({

        url: "https://services5.arcgis.com/hZQQbQb2B2y1Wd2F/arcgis/rest/services/muestra_bares/FeatureServer/0",
        renderer: barRenderer,
        popupTemplate: barPopup
    });

    map.add(barLayer);

    let selectBrands = document.getElementById('selectBrand');
    selectBrands.addEventListener('change', selectBrand);

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

});