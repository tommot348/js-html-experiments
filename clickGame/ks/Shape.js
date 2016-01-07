function Shape() {
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.angle = 0;
	this.translate = function(x, y) {
		this.x += x;
		this.y += y;
	};
	this.rotate = function(angle) {
		this.angle += angle;
	};
	this.scale = function(width, height) {
		this.height += height;
		this.width += width;
	};
	this.drawit = function(ctx) {
	};
	this.draw = function(ctx) {
		ctx.save();
		ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
		ctx.rotate(Math.PI / 180 * this.angle);
		this.drawit(ctx);
		ctx.restore();
	};
}

function Rect() {
	this.color = "";
	this.borderColor = "";
	this.borderWidth = 0;
	this.init = function(x, y, width, height, angle, color) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.angle = angle;
		this.color = color;
	};
	this.setBorder = function(width, color) {
		this.borderWidth = width;
		this.borderColor = color;
	}

	this.drawit = function(ctx) {
		if (this.borderWidth > 0) {
			ctx.fillStyle = this.borderColor;
			ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
		}
		ctx.fillStyle = this.color;
		ctx.fillRect(-(this.width / 2 ) + this.borderWidth, -(this.height / 2 ) + this.borderWidth, this.width - this.borderWidth*2, this.height - this.borderWidth*2);
	};
}

Rect.prototype = new Shape;

function Sprite() {
	this.image = null;
	this.newWidth = 0;
	this.newHeight = 0;
	this.init = function(x, y, angle, path) {
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.image = new Image();
		this.image.src = path;
		this.width = this.image.width;
		this.height = this.image.height;
		this.newWidth = this.width;
		this.newHeight = this.height;
	};
	this.scale = function(width, height) {
		this.newHeight += height;
		this.newWidth += width;
	};
	this.drawit = function(ctx) {
		ctx.scale(this.newWidth / this.width, this.newHeight / this.height);
		ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
	};
}

Sprite.prototype = new Shape;

function RoundBorderedRect() {
	this.drawit = function(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
	}
}

RoundBorderedRect.prototype = new Rect;

