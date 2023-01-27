// support `useLoader` and Drei abstractions like `useGLTF` and `useTexture`
module.exports = {
  resolver: {
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs'],
    assetExts: ['glb', 'gltf', 'png', 'jpg'],
  },
}