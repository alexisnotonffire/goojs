define([
	'goo/math/Vector3',
	'goo/scripts/ScriptUtils',
	'goo/math/MathUtils'
], function(
	Vector3,
	ScriptUtils,
	MathUtils
) {
	'use strict';

	/**
	 * @class
	 */
	function AxisAlignedCamControlScript() {

		function setup(params, env) {
			setupMouseControls(params, env);
			env.axis		= new Vector3(0, 0, 1);
			env.upAxis		= new Vector3(0, 1, 0);
			setView(params, env, params.view);
			//env.currentView = params.view;
			env.targetAxis	= new Vector3(0, 0, 1);
			env.lookAtPoint	= new Vector3(0, 0, 0);
			env.distance	= params.distance;
			env.smoothness	= Math.pow(MathUtils.clamp(params.smoothness, 0, 1), 0.3);
			env.axisAlignedDirty = true;
		}

		function setView(params, env, view){
			if(env.currentView === view){
				return;
			}
			env.currentView = view;
			switch(view){
				case 'XY':
					env.axis.setd(0, 0, 1);
					env.upAxis.setd(0, 1, 0);
					break;
				case 'ZY':
					env.axis.setd(1, 0, 0);
					env.upAxis.setd(0, 1, 0);
					break;
			}
			env.axisAlignedDirty = true;
		}

		function update(params, env) {
			if(params.view !== env.currentView){
				env.axisAlignedDirty = true;
			}
			if (!env.axisAlignedDirty) {
				return;
			}
			var entity = env.entity;
			var transform = entity.transformComponent.transform;

			var cameraPosition = Vector3.add(env.lookAtPoint, Vector3.mul(env.axis, env.distance));
			transform.translation.set(cameraPosition);
			transform.lookAt(env.lookAtPoint, env.upAxis);
			entity.transformComponent.setUpdated();

			env.axisAlignedDirty = false;

			//var delta = MathUtils.lerp(env.smoothness, 1, env.world.tpf);
			//size = env.size = MathUtils.lerp(delta, size, targetSize);
			//camera.setFrustum(1, AxisAlignedCamControlScript.LARGE_NUMBER, -size, size, size, -size, 1);
			/*if(Math.abs(targetSize-size) < 0.00001){
				env.twoDimDirty = false;
			} else {
				env.twoDimDirty = true;
			}*/
		}

		// Removes all listeners
		function cleanup(params, env) {
			for (var event in env.listeners) {
				env.domElement.removeEventListener(event, env.listeners[event]);
			}
		}

		// Attaches the needed mouse event listeners
		function setupMouseControls(params, env) {
			// Define listeners
			var listeners = env.listeners = {
			};

			// Attach listeners
			for (var event in listeners) {
				env.domElement.addEventListener(event, listeners[event]);
			}
		}

		return {
			setup: setup,
			update: update,
			cleanup: cleanup
		};
	}

	/**
	 * @static
	 * @type {Object}
	 */
	AxisAlignedCamControlScript.externals = {
		name: 'AxisAlignedCamControlScript',
		description: 'Aligns a camera along an axis, and enables switching between them.',
		parameters: [{
			key: 'whenUsed',
			'default': true,
			type: 'boolean'
		},{
			key: 'distance',
			name: 'Distance',
			type: 'float',
			description:'Camera distance from lookat point',
			control: 'slider',
			'default': 1e3,
			min: 1,
			max: 1e5
		},{
			key: 'view',
			type:'string',
			'default': 'XY',
			control:'select',
			options: ['XY', 'ZY']
		}]
	};

	return AxisAlignedCamControlScript;
});