render(scene, camera) {
	// 处理要渲染的对象进 currentRenderList。 groupOrder, sortObjects 先不考虑
	projectObject( object, camera, groupOrder, sortObjects )  
  renderScene( currentRenderList, scene, camera );
}

function projectObject( object, camera, groupOrder, sortObjects ) {
	if ( object.isMesh || object.isLine || object.isPoints ) {
		// 获取 geometry material
		const geometry = objects.update( object );
		const material = object.material;
		// 放入 currentRenderList
	  currentRenderList.push( object, geometry, material);
	}
	// 处理子集
  const children = object.children;
	for ( let i = 0, l = children.length; i < l; i ++ ) {
		projectObject( children[ i ], camera);
	}
}

renderScene( currentRenderList, scene, camera, viewport ) {
	const opaqueObjects = currentRenderList.opaque;
	const transmissiveObjects = currentRenderList.transmissive;
	const transparentObjects = currentRenderList.transparent;
	if ( opaqueObjects.length > 0 ) renderObjects( opaqueObjects, scene,camera );
	if ( transmissiveObjects.length > 0 ) renderObject(transmissiveObjects, scene, camera );
	if ( transparentObjects.length > 0 ) renderObjects(transparentObjects, scene, camera );
}


renderObjects( renderList, scene, camera ) {
	for ( let i = 0, l = renderList.length; i < l; i ++ ) {
		const renderItem = renderList[ i ];
		const object = renderItem.object;
		const geometry = renderItem.geometry;
		const material = renderItem.material;
		const group = renderItem.group;
		renderObject( object, scene, camera, geometry, material, group );
	}
}

function renderObject( object, scene, camera, geometry, material, group ) {
	object.modelViewMatrix.multiplyMatrices( camera.matrixWorldInverse, object.matrixWorld );
	object.normalMatrix.getNormalMatrix( object.modelViewMatrix );
	_this.renderBufferDirect( camera, scene, geometry, material, object, group );
}


function renderBufferDirect ( camera, scene, geometry, material, object, group ) {
	const program = setProgram( camera, scene, geometry, material, object );
	state.setMaterial( material, frontFaceCW );
	if ( object.isMesh ) {
		if ( material.wireframe === true ) {
			state.setLineWidth( material.wireframeLinewidth * getTargetPixelRatio() );
			renderer.setMode( _gl.LINES );
		} else {
			renderer.setMode( _gl.TRIANGLES );
		}
	} else if ( object.isLine ) {
		let lineWidth = material.linewidth;
		if ( lineWidth === undefined ) lineWidth = 1; // Not using Line*Material
		state.setLineWidth( lineWidth * getTargetPixelRatio() );
		if ( object.isLineSegments ) {
			renderer.setMode( _gl.LINES );
		} else if ( object.isLineLoop ) {
			renderer.setMode( _gl.LINE_LOOP );
		} else {
			renderer.setMode( _gl.LINE_STRIP );
		}
	} else if ( object.isPoints ) {
		renderer.setMode( _gl.POINTS );
	} else if ( object.isSprite ) {
		renderer.setMode( _gl.TRIANGLES );
	}
	if ( object.isInstancedMesh ) {
		renderer.renderInstances( drawStart, drawCount, object.count );
	} else if ( geometry.isInstancedBufferGeometry ) {
		const instanceCount = Math.min( geometry.instanceCount, geometry._maxInstanceCount );
		renderer.renderInstances( drawStart, drawCount, instanceCount );
	} else {
		renderer.render( drawStart, drawCount );
	}
};