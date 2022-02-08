class Controls {
	constructor() {
		this.keys = {
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

		addEventListener('keydown', ({ key }) => {
			switch (key) {
				case 'a':
					this.keys.a.pressed = true
					break
				case 'd':
					this.keys.d.pressed = true
					break
				case ' ':
					this.keys.space.pressed = true
					break
			}
		})

		addEventListener('keyup', ({ key }) => {
			switch (key) {
				case 'a':
					this.keys.a.pressed = false
					break
				case 'd':
					this.keys.d.pressed = false
					break
				case ' ':
					this.keys.space.pressed = false
					break
			}
		})
	}

	handleKeyPress(canvas, player) {
		if (this.keys.a.pressed && player.position.x > 0) {
			player.velocity.x = -7
			player.rotation = -0.1
		} else if (this.keys.d.pressed && player.position.x + player.width <= canvas.width) {
			player.velocity.x = 7
			player.rotation = 0.1
		} else {
			player.velocity.x = 0
			player.rotation = 0
		}
	}
}

export default Controls
