(function(window, undefined) {
	var DemoUtil = window.DemoUtil = function(cy) {
		this.cy = cy;
	};

	DemoUtil.prototype.Layouts = {
		COSE: 'cose',
		COSE_BILKENT: 'cose-bilkent',
		RANDOM: 'random',
		CIRCLE: 'circle',
		GRID: 'grid'
	};

	DemoUtil.prototype.changeShape = function(shapeName, selector) {
		selector = selector || 'node';
		this.cy.style().selector(selector).style({ 'shape' : shapeName }).update();
		return this;
	};

	DemoUtil.prototype.setStyle = function(style, selector) {
		selector = selector || 'node';
		this.cy.style().selector(selector).style(style).update();
		return this;
	};

	DemoUtil.prototype.animateLayout = function(layoutName, options) {
		layoutName = layoutName || 'random';
		options = options || { name: layoutName , animate: true };
		this.cy.layout(options).run();
		return this;
	};

	DemoUtil.prototype.addNode = function(id, nodeData) {
		id = id || "node" + (new Date().getTime());
		nodeData = nodeData || { id: id };
		this.cy.add({ id: id, data : nodeData });
		this.cy.resize();
		return this;
	};

	DemoUtil.prototype.allowSelect = function(isAllowed) {
		(isAllowed ? this.cy.selectify() : this.cy.unselectify());
		return this;
	};

	DemoUtil.prototype.allowDragView = function(isAllowed) {
		(isAllowed ? this.cy.selectify() : this.cy.unselectify());
		return this;
	};

	DemoUtil.prototype.highlightPath = function(algorithm, selector1, selector2, duration) {
		(duration === undefined && (duration = 3000));
		algorithm = algorithm || 'dijkstra';
		selector1 = selector1 || 'node[0]';
		selector2 = selector2 || 'node[1]';

		var pathTo = this.cy.elements()[algorithm](this.cy.$(selector1)).pathTo(this.cy.$(selector2));

		var nodesInPath = this.cy.$(pathTo);

		this.highlight(nodesInPath, duration);

		return this;
	};

	DemoUtil.clearHighlight = function(eles) {
		if(!eles || !eles.nonempty())
			eles = this.cy.$('.highlighted');
		
		eles.removeClass('highlighted');

		return this;
	};

	DemoUtil.prototype.highlight = function(eles, duration) {
		if(!eles || eles.empty()) return;

		if(duration) {
			eles.flashClass('highlighted', duration);				
		}
		eles.addClass('highlighted');

		return this;
	};

	DemoUtil.prototype.fit = function(eles, duration) {
		duration = duration || 1000;

		if(!eles || eles.empty()) eles = this.cy.$(':visible');

		this.cy.animate({
			fit: {
				eles: eles, padding: 50
			}
			}, {
				duration: duration
			});

			return this;
	};

}(window));
