import React from 'react';
import WebView from 'react-native-webview';

function buildHtml(latitude, longitude, interactive) {
  const hasMarker = latitude != null && longitude != null;
  const lat = hasMarker ? latitude : -15.7942;
  const lng = hasMarker ? longitude : -47.8825;
  const zoom = hasMarker ? 15 : 5;

  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>* { margin:0; padding:0; } #map { width:100%; height:100vh; }</style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl:${interactive}, attributionControl:false })
      .setView([${lat},${lng}], ${zoom});

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19 }).addTo(map);

    var marker = ${hasMarker
      ? `L.marker([${lat},${lng}]${interactive ? ',{draggable:true}' : ''}).addTo(map)`
      : 'null'};

    function send(latlng) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ latitude:latlng.lat, longitude:latlng.lng }));
    }

    ${interactive ? `
    if (marker) marker.on('dragend', function() { send(marker.getLatLng()); });

    map.on('click', function(e) {
      if (!marker) {
        marker = L.marker(e.latlng, { draggable:true }).addTo(map);
        marker.on('dragend', function() { send(marker.getLatLng()); });
      } else {
        marker.setLatLng(e.latlng);
      }
      send(e.latlng);
    });
    ` : ''}
  </script>
</body>
</html>`;
}

export function LeafletMap({ latitude, longitude, interactive = false, onLocationChange, style }) {
  const html = React.useMemo(
    () => buildHtml(latitude, longitude, interactive),
    [],
  );

  const handleMessage = (event) => {
    if (!interactive || !onLocationChange) return;
    try {
      onLocationChange(JSON.parse(event.nativeEvent.data));
    } catch {}
  };

  return (
    <WebView
      style={[{ flex: 1 }, style]}
      originWhitelist={['*']}
      source={{ html }}
      onMessage={handleMessage}
      javaScriptEnabled
    />
  );
}
