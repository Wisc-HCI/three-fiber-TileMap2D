import React from "react";
import { StyleSheet, View } from "react-native";
import { Canvas } from "@react-three/fiber/native";
import {
  OrthographicCamera,
} from "@react-three/drei/native";

import { load_json_map } from "./tools";
import TileMap2D from "./TileMap2D";

export default function App() {
  // Get tilemap from the json file
  const json = require("./data/map_default.json");

  // mapData is a 2D-list (-1: no data, 100: wall, 0: ground).
  const mapData = load_json_map(json); 

  console.log(`${mapData.length} x ${mapData[0].length}`);

  return (
    <View style={styles.container}>
      <View style={styles.canvasContainer}>

        <Canvas>
          <OrthographicCamera position={[0, 0, 5]} zoom={15} makeDefault />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />

          {/* Pass in the mapData to TileMap2D*/}
          <TileMap2D mapData={mapData} />

        </Canvas>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  canvasContainer: {
    width: "95%",
    height: "85%",
    backgroundColor: "#fff",
  },
});
