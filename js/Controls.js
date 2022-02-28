import Projectile from './Projectile.js'
import { Sound } from './Sound.js'

class Controls {
	constructor(player, game) {
		this.playerShotSound = new Sound('./sound/playerShot.wav')
		this.playerShotSound.volume(0.1)
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
			if (game.over) return
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

	createBullets(player, projectiles, color = 'yellow') {
		projectiles.push(
			new Projectile({
				position: {
					x: player.position.x + player.width / 2,
					y: player.position.y - 5,
				},
				velocity: {
					x: 0,
					y: -10,
				},
				color,
			}),
		)
	}

	handleKeyPress(canvas, player) {
		if (this.keys.a.pressed && player.position.x > 0) {
			player.velocity.x = -12
			player.rotation = -0.2
		} else if (this.keys.d.pressed && player.position.x + player.width <= canvas.width) {
			player.velocity.x = 12
			player.rotation = 0.2
		} else {
			player.velocity.x = 0
			player.rotation = 0
		}
	}

	selectGun(frames, player, projectiles) {
		if (this.keys.space.pressed) {
			switch (player.powerUp) {
				case 'machineGun':
					if (frames % 2 === 0) {
						this.createBullets(player, projectiles, 'red')
					}
					break
				default:
					if (frames % 15 === 0) {
						this.createBullets(player, projectiles)
					}
					break
			}
			this.playerShotSound.getDuration
			this.playerShotSound.play()
		}
	}
}

export default Controls
