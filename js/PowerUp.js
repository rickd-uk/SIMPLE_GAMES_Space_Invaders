class PowerUp {
	constructor({ position, velocity }) {
		this.position = position
		this.velocity = velocity

		this.radius = 15
		this.color = 'yellow'
	}

	draw(c) {
		c.fillStyle = this.color
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

	static remove(c, canvas, powerUps) {
		// Remove powerUps
		for (let i = powerUps.length - 1; i >= 0; i--) {
			const powerUp = powerUps[i]
			if (powerUp.position.x - powerUp.radius >= canvas.width) {
				powerUps.splice(i, 1)
			} else {
				powerUp.update(c)
			}
		}
	}

	static activate(player, projectile, projectiles, powerUps, i) {
		for (let j = powerUps.length - 1; j >= 0; j--) {
			const powerup = powerUps[j]
			//	if projectile hits powerup
			if (
				Math.hypot(projectile.position.x - powerup.position.x, projectile.position.y - powerup.position.y) <
				projectile.radius + powerup.radius
			) {
				projectiles.splice(i, 1)
				powerUps.splice(j, 1)
				player.powerUp = 'machineGun'
				setTimeout(() => {
					player.powerUp = null
				}, 5000)
			}
		}
	}

	static spawn(frames, powerUps) {
		if (frames % 500 === 0) {
			powerUps.push(
				new PowerUp({
					position: {
						x: 0,
						y: 300,
					},
					velocity: {
						x: 5,
						y: 0,
					},
				}),
			)
		}
	}
}

export default PowerUp
