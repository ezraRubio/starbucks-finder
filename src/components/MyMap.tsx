import { useEffect, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Fill, Icon, Stroke, Style } from "ol/style";
import { LocationType } from "../shared/types";
import GeoJSON, { GeoJSONGeometry } from "ol/format/GeoJSON";
import * as turf from "@turf/turf";
import { Geometry } from "ol/geom";

export interface MyMapProps {
  locations: LocationType[];
  selectedCountryPolygon: GeoJSONGeometry;
}

export const MyMap: React.FC<MyMapProps> = ({
  locations,
  selectedCountryPolygon,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (locations.length > 0) {
      let center = fromLonLat([-98.5795, 39.8283]);
      const vectorSource = new VectorSource({
        features: locations.map((location) => {
          const feature = new Feature({
            geometry: new Point(
              fromLonLat([location.longitude, location.latitude])
            ),
            name: location.name,
          });
          feature.setStyle(
            new Style({
              image: new Icon({
                src: "https://openlayers.org/en/latest/examples/data/icon.png",
                scale: 0.5,
              }),
            })
          );
          return feature;
        }),
      });

      const layers: Array<
        | VectorLayer<Feature<Geometry>>
        | TileLayer<OSM>
        | VectorLayer<Feature<Point>>
      > = [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: vectorSource,
        }),
      ];

      if (Object.keys(selectedCountryPolygon).length !== 0) {
        center = fromLonLat(
          turf.centerOfMass(selectedCountryPolygon).geometry.coordinates
        );

        const polygonFeature = new GeoJSON().readFeature(
          selectedCountryPolygon,
          {
            featureProjection: "EPSG:3857",
          }
        );

        polygonFeature.setStyle(
          new Style({
            stroke: new Stroke({
              color: "blue",
              width: 2,
            }),
            fill: new Fill({
              color: "rgba(0, 0, 255, 0.1)",
            }),
          })
        );

        layers.push(
          new VectorLayer({
            source: new VectorSource({
              features: [polygonFeature],
            }),
          })
        );
      }

      const map = new Map({
        target: mapRef.current!,
        layers: layers,
        view: new View({
          center: center,
          zoom: 4,
        }),
      });

      return () => map.setTarget(undefined);
    }
  }, [locations, selectedCountryPolygon]);

  return <div ref={mapRef} style={{ width: "600px", height: "600px" }} />;
};
