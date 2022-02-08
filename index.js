import Controls from './Controls.js'
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
	const controls = new Controls()

	function animate() {
		requestAnimationFrame(animate)
		c.fillStyle = 'black'
		c.fillRect(0, 0, canvas.width, canvas.height)
		player.update()
		controls.handleKeyPress(canvas, player)
	}

	addEventListener('resize', () => {
		player.redrawOnResize()
	})
	animate()
})()
