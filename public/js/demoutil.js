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
		DIJKSTRA: 'dijkstra',
		ASTAR: 'aStar'
	};

	DemoUtil.Classes = {
		HIGHLIGHTED: 'highlighted'
	}

	DemoUtil.prototype.changeShape = function(shapeName, selector) {
		selector = selector || 'node';
		this.cy.style().selector(selector).style({ 'shape' : shapeName }).update();
		return this;
	};

	DemoUtil.prototype.setStyle = function(selector, style) {
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

	DemoUtil.prototype.getNodeAndNeighbors = function(selector) {
		var result = this.cy.$(selector || 'node');
		result = result.union(result.neighborhood());
		return result;
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
		else {
			eles.addClass(DemoUtil.Classes.HIGHLIGHTED);
		}

		return this;
	};

	function pickOne (selector) {
		var result = null;
		var matches = this.cy.$(selector);
		if(matches && matches.length) {
			result = matches[Math.floor(Math.random() * matches.length)];
		}
		
		return function(ele) {
			return ele === result;
		};
	}

	DemoUtil.prototype.pickOne = pickOne;

	DemoUtil.prototype.randomizeData = function(selector, options){
		var defaultRandomCeiling = 30;
		var iterations = 0;
		var iterationHandle;
		var randomizeOptions = this.randomizeOptions = Object.assign({ selector: selector, interval: 2000, ceiling: 100, iterations: 50, valueAttribute: 'value', valueFunc: function(ele) { return Math.ceil(Math.random() * defaultRandomCeiling); } }, (options || {}));
		randomizeOptions.intervalHandle = iterationHandle = setInterval(function() {
			++iterations;
			console.log('Running ' + iterations + '...');
			this.cy.$(pickOne(randomizeOptions.selector)).data(randomizeOptions.valueAttribute, randomizeOptions.valueFunc());
			if(iterations > randomizeOptions.iterations) {
				clearInterval(iterationHandle);
				delete randomizeOptions.iterationHandle;
				return;
			}
		},
			randomizeOptions.interval);
		return this;
	};

	DemoUtil.prototype.stopRandomizing = function() {
		var randomizeOptions = this.randomizeOptions;
		if(!randomizeOptions || !randomizeOptions.intervalHandle) return;
		clearInterval(randomizeOptions.intervalHandle);
		delete randomizeOptions.iterationHandle;
		return this;
	};

	function downloadData(href, downloadName) {
		var downloadLink = document.createElement('a');
		downloadLink.setAttribute('href', href);
		downloadLink.setAttribute('download', downloadName);
		downloadLink.setAttribute('style', 'visibility: hidden; height: 1px; width: 1px;');
		var body = document.querySelector('body');
		body.appendChild(downloadLink);
		downloadLink.click();
		body.removeChild(downloadLink);
	}

	DemoUtil.prototype.downloadImage = function() {
		var canvas = document.querySelector('[data-id="layer2-node"]');
		var imageDataUrl = canvas.toDataURL('image/png');
		downloadData(imageDataUrl, 'diagram.png');
	}

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
