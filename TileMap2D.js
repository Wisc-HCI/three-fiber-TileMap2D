import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const TileMap2D = ({ mapData }) => {
  const dummyObj = new THREE.Object3D();
  const blackColor = new THREE.Color("black");
  const greyColor = new THREE.Color("grey");
  const yellowColor = new THREE.Color("yellow");
  // const whiteColor = new THREE.Color("white");

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

export default TileMap2D;