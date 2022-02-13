class Projectile {
	constructor({ position, velocity }) {
		this.position = position
		this.velocity = velocity

		this.radius = 6
	}

	spawn() {}

	draw(c) {
		c.fillStyle = ' yellow'
		c.beginPath()
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)

		c.fill()
		c.closePath()
	}
	update(c) {
		this.draw(c)
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}
}

export default Projectile
