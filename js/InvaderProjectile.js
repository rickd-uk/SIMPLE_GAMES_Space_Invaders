class InvaderProjectile {
	constructor({ position, velocity }) {
		this.position = position
		this.velocity = velocity
		this.width = 3
		this.height = 10
	}

	spawn() {}

	draw(c) {
		c.fillStyle = 'green'
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
	update(c) {
		this.draw(c)
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}
}

export default InvaderProjectile
