(function(window, undefined) {
	function DemoUtil(cy) {
		this.cy = cy;
	}

	DemoUtil.Layouts = {
		COSE: 'cose',
		COSE_BILKENT: 'cose-bilkent',
		RANDOM: 'random',
		CIRCLE: 'circle',
		GRID: 'grid'
	};

	DemoUtil.Algorithms = {
		DIJKSTRA: 'dijkstra'
	};

	DemoUtil.Classes = {
		HIGHLIGHTED: 'highlighted'
	}

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

	DemoUtil.prototype.setImage = function(imagePath, selector) {
		selector = selector || 'node';
		this.cy.$(selector).data('image', imagePath);
		this.setStyle({
			'background-color': 'rgba(255, 255, 255, 0)',
			'background-image': 'data(image)',
			'background-height': 'auto',
			'background-width': 'auto',
			'background-clip': 'none',
			'background-fit': 'contain',
			'background-repeat': 'no-repeat',
			'background-image-opacity': 1.0
		}, selector);
		return this;
	}

	DemoUtil.prototype.animateLayout = function(layoutName, options) {
		options = options || { };
		layoutName = layoutName || DemoUtil.Layouts.RANDOM;
		var options = Object.assign({ name: layoutName , animate: true, fit: true }, options);
		this.cy.layout(options).run();
		return this;
	};

	DemoUtil.prototype.addNode = function(id, nodeData) {
		nodeData.id = id || "node" + (new Date().getTime());
		nodeData = nodeData || { };
		nodeData.id = id;
		this.cy.add({ id: id, data : nodeData });
		this.cy.resize();
		return this;
	};

	DemoUtil.prototype.allowSelect = function(isAllowed, selector) {
		var selector = selector || '*';
		(isAllowed ? this.cy.$(selector).selectify() : this.cy.$(selector).unselectify());
		return this;
	};

	DemoUtil.prototype.$ = function(selector) {
		return this.cy.$(selector);
	}

	DemoUtil.prototype.allowDragView = function(isAllowed) {
		(isAllowed ? this.cy.selectify() : this.cy.unselectify());
		return this;
	};

	DemoUtil.prototype.highlightPath = function(algorithm, selector1, selector2, duration) {
		(duration === undefined && (duration = 3000));
		algorithm = algorithm || DemoUtil.Algorithms.DIJKSTRA;
		selector1 = selector1 || 'node[0]';
		selector2 = selector2 || 'node[1]';

		var pathTo = this.cy.elements()[algorithm](this.cy.$(selector1)).pathTo(this.cy.$(selector2));

		var nodesInPath = this.cy.$(pathTo);

		this.highlight(nodesInPath, duration);

		return this;
	};

	DemoUtil.clearHighlight = function(eles) {
		if(!eles || !eles.nonempty())
			eles = this.cy.$(`.${ DemoUtil.Classes.HIGHLIGHTED }`);
		
		eles.removeClass(DemoUtil.Classes.HIGHLIGHTED);

		return this;
	};

	DemoUtil.prototype.highlight = function(eles, duration) {
		if(!eles || eles.empty()) return;

		if(duration) {
			eles.flashClass(DemoUtil.Classes.HIGHLIGHTED, duration);				
		}
		eles.addClass(DemoUtil.Classes.HIGHLIGHTED);

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

	window.DemoUtil = DemoUtil;

}(window));
