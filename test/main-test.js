require.config({
    paths: {
        "goo": "src/goo",
        "test": "test"
    },
    waitSeconds: 5
  });
require([
    // Require does not allow us to add dependencies with wildcards...
    'test/math/MathUtils-test',
    'test/math/Matrix-test',
    'test/math/Matrix2x2-test',
    'test/math/Matrix3x3-test',
    'test/math/Matrix4x4-test',
    'test/math/Plane-test',
    'test/math/Quaternion-test',
    'test/math/Ray-test',
    'test/math/Transform-test',
    'test/math/Vector-test',
    'test/math/Vector2-test',
    'test/math/Vector3-test',
    'test/math/Vector4-test',
    'test/math/Versor-test',
    'test/noise/Noise-test',
    'test/shapes/Box-test',
    'test/shapes/Quad-test',
    'test/shapes/Sphere-test',
    'test/shapes/Torus-test',
    'test/entities/entities-test',
    'test/util/URLTools-test'
],
function(mathTest) {
  window.__testacular__.start();
});
