define([
	'goo/fsmpack/statemachine/actions/Action'
], function (
	Action
) {
	'use strict';

	function StopTimelineAction(/*id, settings*/) {
		Action.apply(this, arguments);
	}

	StopTimelineAction.prototype = Object.create(Action.prototype);
	StopTimelineAction.prototype.constructor = StopTimelineAction;

	StopTimelineAction.external = {
		name: 'Stop Timeline',
		type: 'timeline',
		description: 'Stops the timeline.',
		canTransition: true,
		parameters: [],
		transitions: []
	};

	StopTimelineAction.prototype.enter = function (fsm) {
		var entity = fsm.getOwnerEntity();

		if (!entity.hasComponent('TimelineComponent')) { return; }

		entity.timelineComponent.stop();
	};

	return StopTimelineAction;
});