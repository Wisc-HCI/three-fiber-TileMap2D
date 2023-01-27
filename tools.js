/**
 * Load a json format ROS OccupancyGrid message into 2D-array tilemap.
 * @augments json - eg. "require("./data/map_default.json")"
 * @returns the matrix format of the map
 */
export function load_json_map(json) {
  let width = json.width;
  let height = json.height;
  let data = json.data;

  // find boundaries
  let startx = height,
    starty = width;
  let endx = 0,
    endy = 0;
  for (let i = 0; i < height; i++) {
    let flag = false;
    for (let j = 0; j < width; j++) {
      if (data[i * width + j] != -1) {
        if (i < startx) startx = i;
        if (j < starty) starty = j;

        flag = true;
        break;
      }
    }

    if (!flag) continue;

    for (let j = width - 1; j >= 0; j--) {
      if (data[i * width + j] != -1) {
        if (i > endx) endx = i;
        if (j > endy) endy = j;
      }
    }
  }

  console.log(startx, starty, endx, endy);

  // covert the map data into a JS 2D array.
  let tilemap = [];
  for (let i = startx; i <= endx; i++) {
    tilemap.push([]);
    for (let j = starty; j <= endy; j++) {
      tilemap[i - startx].push(data[i * width + j]);
    }
  }

  return tilemap;
}
