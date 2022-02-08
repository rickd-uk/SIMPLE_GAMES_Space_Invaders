;(() => {
	const canvas = document.querySelector('canvas')
	const c = canvas.getContext('2d')

	canvas.width = innerWidth
	canvas.height = innerHeight

	class Player {
		constructor() {
			this.velocity = {
				x: 0,
				y: 0,
			}

			this.rotation = 0

			const image = new Image()
			image.src = './img/spaceship.png'
			image.onload = () => {
				const scale = 0.15
				this.image = image
				this.width = image.width * scale
				this.height = image.height * scale
				this.setPosition()
			}
		}

		setPosition() {
			this.position = {
				x: canvas.width / 2 - this.width / 2,
				y: canvas.height - this.height - 20,
			}
		}

		redrawOnResize() {
			canvas.width = innerWidth
			canvas.height = innerHeight
			this.setPosition()
		}

		draw() {
			c.save()
			c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
			c.rotate(this.rotation)

			c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2)
			// c.fillStyle = 'red'
			// c.fillRect(this.position.x, this.position.y, this.width, this.height)
			c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)

			c.restore()
		}

		update() {
			if (this.image) {
				this.draw()
				this.position.x += this.velocity.x
			}
		}
	}

	const player = new Player()
	const keys = {
		a: {
			pressed: false,
		},
		d: {
			pressed: false,
		},
		space: {
			pressed: false,
		},
	}

	function animate() {
		requestAnimationFrame(animate)
		c.fillStyle = 'black'
		c.fillRect(0, 0, canvas.width, canvas.height)
		player.update()

		if (keys.a.pressed && player.position.x > 0) {
			player.velocity.x = -7
			player.rotation = -0.1
		} else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
			player.velocity.x = 7
			player.rotation = 0.1
		} else {
			player.velocity.x = 0
			player.rotation = 0
		}
	}

	addEventListener('resize', () => {
		player.redrawOnResize()
	})
	animate()

	addEventListener('keydown', ({ key }) => {
		switch (key) {
			case 'a':
				keys.a.pressed = true
				break
			case 'd':
				keys.d.pressed = true
				break
			case ' ':
				keys.space.pressed = true
				break
		}
	})
	addEventListener('keyup', ({ key }) => {
		switch (key) {
			case 'a':
				keys.a.pressed = false
				break
			case 'd':
				keys.d.pressed = false
				break
			case ' ':
				keys.space.pressed = false
				break
		}
	})
})()
