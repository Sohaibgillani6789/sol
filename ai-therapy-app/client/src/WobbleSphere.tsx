import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';

// --- GLSL Shaders ---
// NOTE: The GLSL code is extensive and has been kept the same as in your request.
// It is included here for completeness.

const SIMPLEX_NOISE_4D_GLSL = `
//  Simplex 4D Noise
//  by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

vec4 grad4(float j, vec4 ip){
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

  return p;
}

float simplexNoise4d(vec4 v){
  const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4
                        0.309016994374947451); // (sqrt(5) - 1)/4    F4
// First corner
  vec4 i  = floor(v + dot(v, C.yyyy) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

// Other corners

// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  vec4 i0;

  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
//  i0.x = dot( isX, vec3( 1.0 ) );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;

//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;

  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  // i0 now contains the unique values 0,1,2,3 in each channel
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  //  x0 = x0 - 0.0 + 0.0 * C
  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

// Permutations
  i = mod(i, 289.0);
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
// Gradients
// ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.

  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

// Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

// Mix contributions from the five corners
  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)          ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;
}
`;

const WOBBLE_VERTEX_SHADER = `
uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrength;
uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequency;
uniform float uWarpStrength;

attribute vec4 tangent;

varying float vWobble;

${SIMPLEX_NOISE_4D_GLSL} // Include the noise function directly

float getWobble(vec3 position)
{
    vec3 warpedPosition = position;
    warpedPosition += simplexNoise4d(
        vec4(
            position * uWarpPositionFrequency,
            uTime * uWarpTimeFrequency
        )
    ) * uWarpStrength;

    return simplexNoise4d(vec4(
        warpedPosition * uPositionFrequency, // XYZ
        uTime * uTimeFrequency            // W
    )) * uStrength;
}

void main()
{
    // csm_Position, csm_Normal, normal, tangent are provided by CustomShaderMaterial
    // Ensure the geometry has tangents computed for this to work correctly!
    vec3 biTangent = cross(normal, tangent.xyz);

    // Neighbours positions for normal recalculation
    float shift = 0.01;
    vec3 positionA = csm_Position + tangent.xyz * shift;
    vec3 positionB = csm_Position + biTangent * shift;

    // Apply wobble to current position and neighbor positions
    float wobble = getWobble(csm_Position);
    csm_Position += wobble * normal;
    positionA    += getWobble(positionA) * normal;
    positionB    += getWobble(positionB) * normal;

    // Recompute normal after position distortion
    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);
    csm_Normal = cross(toA, toB); // This new normal will be used by lighting

    // Pass the wobble value to the fragment shader for coloring
    vWobble = wobble / uStrength; // Normalize wobble to roughly -1 to 1 range
}
`;

const WOBBLE_FRAGMENT_SHADER = `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;

varying float vWobble;

void main()
{
    float t = smoothstep(-1.0, 1.0, vWobble);
    // Simulate a radiant gradient: blue to pink, with white radiance in the middle
    vec3 color = mix(uColorA, uColorB, t); // Blue to pink
    color = mix(color, uColorC, pow(abs(sin(vWobble * 3.1415)), 1.5)); // Add white radiance in the middle
    csm_DiffuseColor.rgb = color;
    csm_Roughness = 1.0 - t;
}
`;

const WobbleSphere = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // The main effect for setting up the Three.js scene.
    // This now depends on `isScriptLoaded` to ensure the library is available before running.
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const scene = new THREE.Scene();
        const clock = new THREE.Clock();
        let animationFrameId: number | null = null;

        // Responsive sizing
        function getSizes() {
            if (!canvas) {
                return {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    pixelRatio: Math.min(window.devicePixelRatio, 2)
                };
            }
            const parent = canvas.parentElement;
            const w = parent ? parent.clientWidth : window.innerWidth;
            const h = parent ? parent.clientHeight : window.innerHeight;
            return {
                width: w,
                height: h,
                pixelRatio: Math.min(window.devicePixelRatio, 2)
            };
        }
        let sizes = getSizes();

        const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
        camera.position.set(0, 0, 9);
        scene.add(camera);

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(sizes.pixelRatio);

        const uniforms = {
            uTime: new THREE.Uniform(0),
            uPositionFrequency: new THREE.Uniform(0.5),
            uTimeFrequency: new THREE.Uniform(0.4),
            uStrength: new THREE.Uniform(0.3),
            uWarpPositionFrequency: new THREE.Uniform(0.38),
            uWarpTimeFrequency: new THREE.Uniform(0.12),
            uWarpStrength: new THREE.Uniform(1.7),
            uColorA: new THREE.Uniform(new THREE.Color('#5b7fff')),
            uColorB: new THREE.Uniform(new THREE.Color('#e06c88')),
            uColorC: new THREE.Uniform(new THREE.Color('#ffffff')),
        };
        
        const wobbleMaterial = new CustomShaderMaterial({
            baseMaterial: THREE.MeshPhysicalMaterial,
            vertexShader: WOBBLE_VERTEX_SHADER,
            fragmentShader: WOBBLE_FRAGMENT_SHADER,
            uniforms: uniforms,
            metalness: 0,
            roughness: 0.5,
            transmission: 0,
            ior: 1.5,
            thickness: 1.5,
            transparent: true,
        });

        const depthMaterial = new CustomShaderMaterial({
            baseMaterial: THREE.MeshDepthMaterial,
            vertexShader: WOBBLE_VERTEX_SHADER,
            uniforms: uniforms,
            depthPacking: THREE.RGBADepthPacking
        });

        const geometry = new THREE.IcosahedronGeometry(2, 64);
        const wobbleSphere = new THREE.Mesh(geometry, wobbleMaterial);
        wobbleSphere.customDepthMaterial = depthMaterial;
        wobbleSphere.receiveShadow = true;
        wobbleSphere.castShadow = true;
        scene.add(wobbleSphere);

        const ambientLight = new THREE.AmbientLight('#ffffff', 1.9);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight('#ffffff', 6);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.set(1024, 1024);
        directionalLight.shadow.camera.far = 15;
        directionalLight.shadow.normalBias = 0.05;
        directionalLight.position.set(0.25, 2, -2.25);
        scene.add(directionalLight);

        // Responsive resize
        function onResize() {
            sizes = getSizes();
            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();
            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(sizes.pixelRatio);
        }
        window.addEventListener('resize', onResize);

        const tick = () => {
            const elapsedTime = clock.getElapsedTime();
            uniforms.uTime.value = elapsedTime;
            renderer.render(scene, camera);
            animationFrameId = window.requestAnimationFrame(tick);
        };
        tick();

        // Cleanup
        return () => {
            if (animationFrameId) {
                window.cancelAnimationFrame(animationFrameId);
            }
            window.removeEventListener('resize', onResize);
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach((mat) => mat.dispose());
                    } else if (object.material && typeof object.material.dispose === 'function') {
                        object.material.dispose();
                    }
                }
            });
            renderer.dispose();
        };
    }, []);

    return (
        <div
            className="wobble-sphere-container"
            style={{
                width: '100vw',
                maxWidth: 420,
                height: '100vw',
                maxHeight: 420,
                aspectRatio: '1/1',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <canvas ref={canvasRef} className="webgl" style={{ width: '100%', height: '100%', display: 'block' }}></canvas>
        </div>
    );
};

export default WobbleSphere;
