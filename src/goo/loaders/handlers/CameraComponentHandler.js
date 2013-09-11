define([
	'goo/loaders/handlers/ComponentHandler',
	'goo/entities/components/CameraComponent',
	'goo/renderer/Camera',
	'goo/util/rsvp',
	'goo/util/PromiseUtil',
	'goo/util/ObjectUtil'
], function(
	ComponentHandler,
	CameraComponent,
	Camera,
	RSVP,
	pu,
	_
) {
	function CameraComponentHandler() {
		ComponentHandler.apply(this, arguments);
	}

	CameraComponentHandler.prototype = Object.create(ComponentHandler.prototype);
	ComponentHandler._registerClass('camera', CameraComponentHandler);

	CameraComponentHandler.prototype._prepare = function(config) {
		return _.defaults(config, {
			fov: 45,
			aspect: 1,
			near: 1,
			far: 10000
		});
	};

	CameraComponentHandler.prototype._create = function(entity/*, config*/) {
		var camera = new Camera(45, 1, 1, 1000);
		var component = new CameraComponent(camera);
		entity.setComponent(component);
		return component;
	};

	CameraComponentHandler.prototype.update = function(entity, config) {
		var component = ComponentHandler.prototype.update.call(this, entity, config);
		component.camera.setFrustumPerspective(
			config.fov,
			config.aspect,
			config.near,
			config.far
		);
		return pu.createDummyPromise(component);
	};

	CameraComponentHandler.prototype.remove = function(entity) {
		// var _ref;
		// This removes the camera entity,
		// but there is still a visible view that isn't updated.
		// Perhaps change the engine so it draws just black if
		// there is no camera?
		if (entity && entity.cameraComponent && entity.cameraComponent.camera) {
			this.world.removeEntity(entity.cameraComponent.camera);
		}
		return ComponentHandler.prototype.remove.call(this, entity);
	};

	return CameraComponentHandler;
});
