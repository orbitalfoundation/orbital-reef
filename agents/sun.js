
const config = globalThis.config
const size = config.size
const sundist = size + 20
const moondist = size
const slightlydifferentspeed = 1.1

function resolve(blob) {
	if(!blob.time) return
	const time = blob.time
	const sys = blob._sys
	const db = sys.db

	db.query({uuid:'/light/sun'},(sunEntity)=>{
		const node = sunEntity.volume.node // @todo hack - improve position setter
		const radius = sundist
		const sunAngle = time.seconds / time.secondsPerDay * Math.PI * 2 - Math.PI / 2
		// @todo it breaks separation of concerns and is a hack to peek at node directly
		node.position.x = sunEntity.position.x = Math.cos(sunAngle) * radius / 2 + radius / 2
		node.position.y = sunEntity.position.y = Math.sin(sunAngle) * radius / 2
		node.position.z = sunEntity.position.z = radius / 2
	})

	db.query({uuid:'/light/moon'},(moonEntity)=>{
		const node = moonEntity.volume.node
		const radius = moondist
		const sunAngle = time.seconds / time.secondsPerDay * Math.PI * 2 - Math.PI / 2
		const moonAngle = sunAngle * slightlydifferentspeed + Math.PI/8 
		node.position.x = moonEntity.position.x = Math.cos(moonAngle) * radius / 2 + radius / 2
		node.position.y = moonEntity.position.y = Math.sin(moonAngle) * radius / 2
		node.position.z = moonEntity.position.z = radius / 2
		node.rotation.y = node.y = moonAngle
	})
}

export const sunLight = {
	uuid: '/light/sun',
	position: { x: 0, y: 0, z: 0 },
	volume: {
		geometry: 'directionalLight',
		color: 0xffffff,
		intensity: 1,
		distance: sundist,
		decay: 1,
		material: {
			kind: 'basic',
			color: 0xffffcc,
		}
	},
	resolve
}

var textureURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg"; 
var displacementURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg"; 
var worldURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/hipp8_s.jpg"
var textureLoader = new THREE.TextureLoader();
var texture = textureLoader.load( textureURL );
var displacementMap = textureLoader.load( displacementURL );
var worldTexture = textureLoader.load( worldURL );

export const moonLight = {
	uuid: '/light/moon',
	position: { x: 0, y: 0, z: 0 },
	volume: {
		geometry: 'pointLight',
		color: 0xaaaaff,
		intensity: 0.3,
		distance: 600,
		decay: 2,
		material: {
			color: 0xffffff ,
			map: texture ,
			displacementMap: displacementMap,
			displacementScale: 0.06,
			bumpMap: displacementMap,
			bumpScale: 0.04,
		}
	},
}

const pointLight = {
	uuid: '/light/point',
	position: { x: size/2 , y: 100, z: size/2 },
	rotation: { x: 0, y: 0, z: 0 },
	volume: {
		geometry: 'pointLight',
		color: 0xffffff,
		intensity: 0.5,
		material: {
			kind: 'basic',
			color: 0xffff00,
			opacity: 0.5,
			transparent: true,
			side: THREE.DoubleSide
		}
	}
}

export const ambientLight = {
	uuid: '/light/ambient',
	position: { x: size/2, y: 0, z: size/2 },
	volume: {
		geometry: 'ambientLight',
		color: 0xffffff,
		intensity: 0.4,
		material: {
			kind: 'basic',
			color: 0xffff00,
			opacity: 0.5,
			transparent: true,
			side: THREE.DoubleSide
		}
	}
}
