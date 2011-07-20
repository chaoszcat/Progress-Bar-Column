Ext.define('Ext.ux.ProgressBar', {

	/**
	 * @cfg {Ext.Element|string} renderTo
	 * The element that this progress bar will be rendered to
	 */
	renderTo: '',

	/**
	 * @cfg {number} min
	 * The minumum of the progress bar (for use in normalization)
	 */
	min: 0,

	/**
	 * @cfg {number} max
	 * The maximum of the progress bar (normalization)
	 */
	max: 100,

	/**
	 * @cfg {number} padding
	 * px of padding to the parent element
	 */
	padding: 1,

	/**
	 * @cfg {string} font
	 * The string of font that will be used in context.
	 */
	font: '10px arial',
	
	constructor: function(cfg) {
		var me = this;
		Ext.apply(me, cfg);

		if (Ext.isString(me.renderTo)) {
			me.renderTo = Ext.fly(me.renderTo);
		}

		if (!Ext.isEmpty(me.renderTo)) {
			me.init();
		}
	},

	/**
	 * Resize this progress bar according to the w and h specified
	 * 
	 * @param {int} w The width
	 * @param {int} h The height
	 */
	resize: function(w, h) {
		var me = this;
		me.width = w;
		me.height = h-5;
		me.canvas.dom.width = me.width;
		me.canvas.dom.height = me.height;

		me.draw();
	},

	//Private
	init: function() {
		var me = this;
		me.el = me.renderTo;
		me.width = me.el.getWidth();
		me.height = me.el.getHeight()-2;
		
		//normalize
		me.value = me.value / (me.max - me.min);
		me.x = me.y = me.padding;

		me.el.clean();
		me.el.setStyle({padding: '0px'});

		me.canvas = Ext.get(document.createElement('canvas'));
		me.canvas.dom.width = me.width;
		me.canvas.dom.height = me.height;
		me.context = me.canvas.dom.getContext('2d');
		me.el.appendChild(me.canvas);
		me.context.font = me.font;

		me.draw();
	},

	//private
	draw: function() {
		var	me = this,
			w = me.width,
			h = me.height,
			p = me.padding,
			c = me.context,
			v = me.value,
			x = me.x,
			y = me.y;
		me.context.clearRect(0, 0, w, h);
		me.doBackground(c, x, y, w-p*2, h-p*2);
		me.doProgressBar(c, x, y, w-p*2, h-p*2, v);
		me.doText(c, x, y, w, h, p, v);
	},


	//Private
	doBackground: function(ctx, x, y, w, h) {
		var lingrad = ctx.createLinearGradient(0,h,0,0);
		lingrad.addColorStop(0, 'rgba(255,255,255, 1)');
		lingrad.addColorStop(1, 'rgba(237,237,237, 1)');
		ctx.fillStyle = lingrad;

		ctx.strokeStyle = '#aaa';

		ctx.beginPath();
		ctx.rect(x, y, w, h);
		ctx.stroke();
		ctx.fill();
	},

	//Private
	doProgressBar: function(ctx, x, y, w, h, v) {

		var me = this;

		//color, from and to
		var c1 = [207,4,4]; //dark red
		var c2 = [255,48,25]; //light red
		var c3 = [143,196,0]; //dark green
		var c4 = [143,196,0]; //light green
		var c5 = me.colorOffset(c3, c1, v).join(',');
		var c6 = me.colorOffset(c4, c2, v).join(',');

		var lingrad = ctx.createLinearGradient(0,h,0,0);
		lingrad.addColorStop(1, 'rgba('+c5+', 1)');
		lingrad.addColorStop(0, 'rgba('+c6+', 1)');
		ctx.fillStyle = lingrad;

		ctx.save();
		ctx.beginPath();
		ctx.rect(x+1, y+1, (w-2)*v, h-2);
		ctx.fill();
	},

	//private
	//calculate the color transforms
	colorOffset: function(a, b, v) {
		return [
			this.coffset(a[0], b[0], v),
			this.coffset(a[1], b[1], v),
			this.coffset(a[2], b[2], v)
		];
	},

	/**
	 * A linear formula to convert a color to another color
	 * according to the given normalized value
	 * 
	 * @private
	 * @params {number} a The "from" number
	 * @params {number} b The "to" number
	 */
	coffset: function(a, b, v) {
		return Math.floor(a + (b - a)*v);
	},

	//Private
	doText: function(ctx, x, y, w, h, p, v) {
		ctx.save();
		ctx.fillStyle = 'black';
		var text = Math.floor(v*this.max)+'%';
		var text_x = x + p + (w-p)/2 - ctx.measureText(text).width/2;
		var text_y = h/2+3;
		ctx.fillText(text, text_x, text_y);
		ctx.restore();
	}

});