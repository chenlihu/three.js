import { NoToneMapping } from '../constants.js';
import { Object3D } from '../core/Object3D.js';
import { Vector3 } from '../math/Vector3.js';
import { PerspectiveCamera } from './PerspectiveCamera.js';

const fov = 90, aspect = 1;

class CubeCamera extends Object3D {

	constructor( near, far, renderTarget ) {

		super();

		this.type = 'CubeCamera';

		this.renderTarget = renderTarget;

		const cameraPX = new PerspectiveCamera( fov, aspect, near, far );
		cameraPX.layers = this.layers;
		cameraPX.up.set( 0, - 1, 0 );
		cameraPX.lookAt( new Vector3( 1, 0, 0 ) ); // 看向右
		this.add( cameraPX );

		const cameraNX = new PerspectiveCamera( fov, aspect, near, far );
		cameraNX.layers = this.layers;
		cameraNX.up.set( 0, - 1, 0 );
		cameraNX.lookAt( new Vector3( - 1, 0, 0 ) ); // 看向左
		this.add( cameraNX );

		const cameraPY = new PerspectiveCamera( fov, aspect, near, far );
		cameraPY.layers = this.layers;
		cameraPY.up.set( 0, 0, 1 );
		cameraPY.lookAt( new Vector3( 0, 1, 0 ) );　// 看向上
		this.add( cameraPY );

		const cameraNY = new PerspectiveCamera( fov, aspect, near, far );
		cameraNY.layers = this.layers;
		cameraNY.up.set( 0, 0, - 1 );
		cameraNY.lookAt( new Vector3( 0, - 1, 0 ) );　// 看向下
		this.add( cameraNY );

		const cameraPZ = new PerspectiveCamera( fov, aspect, near, far );
		cameraPZ.layers = this.layers;
		cameraPZ.up.set( 0, - 1, 0 );
		cameraPZ.lookAt( new Vector3( 0, 0, 1 ) );　// 看向后
		this.add( cameraPZ );

		const cameraNZ = new PerspectiveCamera( fov, aspect, near, far );
		cameraNZ.layers = this.layers;
		cameraNZ.up.set( 0, - 1, 0 );
		cameraNZ.lookAt( new Vector3( 0, 0, - 1 ) );　// 看向前
		this.add( cameraNZ );

	}

	update( renderer, scene ) {

		if ( this.parent === null ) this.updateMatrixWorld();

		const renderTarget = this.renderTarget;

		const [ cameraPX, cameraNX, cameraPY, cameraNY, cameraPZ, cameraNZ ] = this.children;

		const currentRenderTarget = renderer.getRenderTarget();

		const currentToneMapping = renderer.toneMapping;
		const currentXrEnabled = renderer.xr.enabled;

		renderer.toneMapping = NoToneMapping;
		renderer.xr.enabled = false;

		const generateMipmaps = renderTarget.texture.generateMipmaps;

		renderTarget.texture.generateMipmaps = false;

		renderer.setRenderTarget( renderTarget, 0 );
		renderer.render( scene, cameraPX );

		renderer.setRenderTarget( renderTarget, 1 );
		renderer.render( scene, cameraNX );

		renderer.setRenderTarget( renderTarget, 2 );
		renderer.render( scene, cameraPY );

		renderer.setRenderTarget( renderTarget, 3 );
		renderer.render( scene, cameraNY );

		renderer.setRenderTarget( renderTarget, 4 );
		renderer.render( scene, cameraPZ );

		renderTarget.texture.generateMipmaps = generateMipmaps;

		renderer.setRenderTarget( renderTarget, 5 );
		renderer.render( scene, cameraNZ );

		renderer.setRenderTarget( currentRenderTarget );

		renderer.toneMapping = currentToneMapping;
		renderer.xr.enabled = currentXrEnabled;

		renderTarget.texture.needsPMREMUpdate = true;

	}

}

export { CubeCamera };
