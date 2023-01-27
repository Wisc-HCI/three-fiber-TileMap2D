import React, { useRef, useState, useEffect, useMemo } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Canvas, useFrame } from "@react-three/fiber/native";
import {
  OrthographicCamera,
  Merged,
  Instances,
  Instance,
  Plane,
} from "@react-three/drei/native";
import * as THREE from "three";

import { load_json_map } from "./tools";
import { PlaneGeometry } from "three";

const __TileMap2D_slow = ({ mapData }) => {
  return mapData.map((row, i) => {
    return row.map((tile, j) => {
      return (
        <Plane
          args={[0.1, 0.1]}
          position={[i * 0.1 - 5, j * 0.1 - 5, 0]}
          key={i + " " + j}
        >
          <meshBasicMaterial
            color={tile == -1 ? "black" : tile == 100 ? "grey" : "yellow"}
          />
        </Plane>
      );
    });
  });
};

const __TileMap2D_Merged = ({ mapData }) => {
  const geometry = new THREE.PlaneGeometry(0.1, 0.1);
  const object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

  return (
    <Merged meshes={[object]}>
      {(Plane) => (
        // <>
        //   <Plane position={[0, 0, 0]} color={"yellow"} />
        //   <Plane position={[0, 0.1, 0]} color={"black"} />
        // </>

        <>
          {mapData.map((tileRow, i) => {
            return (
              <>
                {tileRow.map((tile, j) => {
                  return (
                    <Plane
                      position={[i * 0.1 - 5, j * 0.1 - 5, 0]}
                      color={
                        tile == -1 ? "black" : tile == 100 ? "grey" : "yellow"
                      }
                    />
                  );
                })}
              </>
            );
          })}
          <Plane position={[0, 0.1, 0]} color={"black"} />
          <Plane position={[0, 0, 0]} color={"yellow"} />
          <Plane position={[0, -0.1, 0]} color={"grey"} />
        </>
      )}
    </Merged>
  );

  // return mapData.map((row, i) => {
  //   return row.map((tile, j) => {
  //     return (
  //       <Plane
  //         args={[0.1, 0.1]}
  //         position={[i * 0.1 - 5, j * 0.1 - 5, 0]}
  //         key={i + " " + j}
  //       >
  //         <meshBasicMaterial
  //           color={tile == -1 ? "black" : tile == 100 ? "grey" : "yellow"}
  //         />
  //       </Plane>
  //     );
  //   });
  // });
};

function __PlaneInstance({ id, position, ...props }) {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;
    ref.current.position.copy(position);
    // ref.current.scale.set(10.0, 10.0, 10.0);
  }, [position]);

  return (
    <group {...props}>
      <Instance ref={ref} />
    </group>
  );
}

const __TileMap2D_Instances = ({ mapData }) => {
  // const objects = useMemo(() => Array.from({ length: count }).map(() => new THREE.Object3D()), [])
  // const [trees, setTrees] = useState([])
  // useEffect(() => {
  //   for (let i = 0; i < count; i++) {
  //     const tree = objects[i]

  //     tree.position.set(rand11() * 250.0, rand11() * 250.0, 0.0)
  //   }

  //   setTrees(objects)
  // }, [])

  let instances = useMemo(() => {
    console.log("creating instances list...");
    const res = [];

    for (let i = 0; i < mapData.length; i++) {
      const row = mapData[i];
      for (let j = 0; j < row.length; j++) {
        const tile = row[j];
        const color = tile == -1 ? "black" : tile == 100 ? "grey" : "yellow";
        res.push(
          <Instance
            key={`${i}-${j}`}
            position={[i * 0.1 - 5, j * 0.1 - 5, 0]}
            color={color}
          />
        );
      }
    }
    console.log("Instances list created!");
    return res;
  }, [mapData]);

  return (
    <group>
      <Instances limit={500 * 500} range={500 * 500}>
        <planeGeometry args={[0.1, 0.1]} />
        <meshBasicMaterial />
        {/* <Instance position={[0, 0.1, 0]} color={"black"} />
        <Instance position={[0, 0, 0]} color={"yellow"} />
        <Instance position={[0, -0.1, 0]} color={"grey"} /> */}

        {instances}
      </Instances>
    </group>
  );
};

const TileMap2D_hardcoding = ({ mapData }) => {
  const dummyObj = new THREE.Object3D();
  const count = mapData.length * mapData[0].length;
  const blackColor = new THREE.Color("black");
  const greyColor = new THREE.Color("grey");
  const yellowColor = new THREE.Color("yellow");

  const ref = useRef();
  useEffect(() => {
    // set position & color
    for (let i = 0; i < mapData.length; i++) {
      const row = mapData[i];
      for (let j = 0; j < 150; j++) {
        const tile = row[j];
        const color =
          tile == -1 ? blackColor : tile == 100 ? greyColor : yellowColor;
        dummyObj.position.set(i * 0.1 - 10, j * 0.1 - 20, 0);
        dummyObj.updateMatrix();
        ref.current.setMatrixAt(i * mapData.length + j, dummyObj.matrix);
        ref.current.setColorAt(i * mapData.length + j, color);
      }
    }

    // update instance
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.instanceColor.needsUpdate = true;
    // ref.current.material.needsUpdate = true;
  }, [mapData]);

  const ref2 = useRef();
  useEffect(() => {
    // set position & color
    for (let i = 0; i < mapData.length; i++) {
      const row = mapData[i];
      for (let j = 150; j < 300; j++) {
        const tile = row[j];
        const color =
          tile == -1 ? blackColor : tile == 100 ? greyColor : yellowColor;
        dummyObj.position.set(i * 0.1 - 10, j * 0.1 - 20, 0);
        dummyObj.updateMatrix();
        ref2.current.setMatrixAt(i * mapData.length + j, dummyObj.matrix);
        ref2.current.setColorAt(i * mapData.length + j, color);
      }
    }

    // update instance
    ref2.current.instanceMatrix.needsUpdate = true;
    ref2.current.instanceColor.needsUpdate = true;
    // ref2.current.material.needsUpdate = true;
  }, [mapData]);

  const ref3 = useRef();
  useEffect(() => {
    // set position & color
    for (let i = 0; i < mapData.length; i++) {
      const row = mapData[i];
      for (let j = 300; j < row.length; j++) {
        const tile = row[j];
        const color =
          tile == -1 ? blackColor : tile == 100 ? greyColor : yellowColor;
        dummyObj.position.set(i * 0.1 - 10, j * 0.1 - 23, 0);
        dummyObj.updateMatrix();
        ref3.current.setMatrixAt(i * mapData.length + j, dummyObj.matrix);
        ref3.current.setColorAt(i * mapData.length + j, color);
      }
    }

    // update instance
    ref3.current.instanceMatrix.needsUpdate = true;
    ref3.current.instanceColor.needsUpdate = true;
    // ref3.current.material.needsUpdate = true;
  }, [mapData]);

  return (
    <>
      {/* <instancedMesh ref={ref} args={[null, null, count]}>
        <planeGeometry />
        <meshBasicMaterial />
      </instancedMesh>

      <instancedMesh ref={ref2} args={[null, null, count]}>
        <planeGeometry />
        <meshBasicMaterial />
      </instancedMesh> */}

      <instancedMesh ref={ref3} args={[null, null, count]}>
        <planeGeometry />
        <meshBasicMaterial />
      </instancedMesh>
    </>
  );
};

const TileMap2D = ({ mapData }) => {
  const dummyObj = new THREE.Object3D();
  const blackColor = new THREE.Color("black");
  const greyColor = new THREE.Color("grey");
  const yellowColor = new THREE.Color("yellow");
  const whiteColor = new THREE.Color("white");

  const nrow = mapData.length;
  const ncol = mapData[0].length;
  const nrowSeg = Math.ceil(nrow / 100);
  const ncolSeg = Math.ceil(ncol / 100);
  console.log(`rows: ${nrowSeg} columns: ${ncolSeg}`);
  // const nrowSeg = 2;
  // const ncolSeg = 1;

  const refs = [];
  for (let i = 0; i < nrowSeg; i++) {
    const t = [];
    for (let j = 0; j < ncolSeg; j++) {
      const tempRef = useRef();
      t.push(tempRef);
    }
    refs.push(t);
  }

  useEffect(() => {
    // set position & color
    for (let rowSeg = 0; rowSeg < nrowSeg; rowSeg++) {
      for (let colSeg = 0; colSeg < ncolSeg; colSeg++) {
        const rowOffset = rowSeg * 100;
        const colOffset = colSeg * 100;
        const rowBoundary = rowSeg == nrowSeg - 1 ? nrow : rowOffset + 100;
        const colBoundary = colSeg == ncolSeg - 1 ? ncol : colOffset + 100;
        // const colBoundary = 100;
        // console.log(`colBoundary: ${colBoundary} rowBoundary: ${rowBoundary}`);
        
        let id = 0;
        for (let i = rowOffset; i < rowBoundary; i++) {
          for (let j = colOffset; j < colBoundary; j++) {
            const tile = mapData[i][j];
            const color =
              tile == -1 ? blackColor : tile == 100 ? greyColor : yellowColor;
            dummyObj.position.set(i * 0.1 - 9, j * 0.1 - 22, 0);
            dummyObj.updateMatrix();
            // const id = (i - rowOffset) * (rowBoundary - rowOffset) + (j - colOffset);
            refs[rowSeg][colSeg].current.setMatrixAt(id, dummyObj.matrix);
            refs[rowSeg][colSeg].current.setColorAt(id, color);
            // refs[rowSeg][colSeg].current.material.needsUpdate = true;

            id++;
          }
        }
      }
    }

    
  }, [mapData]);

  const instanceMeshes = [];
  for (let i = 0; i < nrowSeg; i++) {
    for (let j = 0; j < ncolSeg; j++) {
      let nInstances = 100 * 100;
      if (i == nrowSeg-1 && j == ncolSeg-1) {
        nInstances = (nrow % 100) * (ncol % 100);
      } else if (i == nrowSeg-1 && j != ncolSeg-1) {
        nInstances = (nrow % 100) * 100;
      } else if (i != nrowSeg-1 && j == ncolSeg-1) {
        nInstances = 100 * (ncol % 100);
      }
      // console.log(`i: ${i}; j: ${j}; nInstances: ${nInstances};`);

      const tempMesh = (
        <instancedMesh
          ref={refs[i][j]}
          args={[null, null, nInstances]}
          key={`${i}-${j}`}
        >
          <planeGeometry/>
          <meshBasicMaterial />
        </instancedMesh>
      );
      instanceMeshes.push(tempMesh);
    }
  }

  return <>{instanceMeshes}</>;
};

export default function App() {
  // get tilemap from the json file
  const json = require("./data/map_default.json");
  const mapData = load_json_map(json);
  console.log(`${mapData.length} x ${mapData[0].length}`);

  return (
    <View style={styles.container}>
      <View style={styles.canvasContainer}>
        <Canvas>
          <OrthographicCamera position={[0, 0, 5]} zoom={15} makeDefault />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />

          <TileMap2D mapData={mapData} />
          {/* <TileMap2D_hardcoding mapData={mapData} /> */}
          {/* <TileMap2D_slow mapData={mapData} /> */}
        </Canvas>
      </View>

      {/* <StatusBar style="auto" /> */}
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
