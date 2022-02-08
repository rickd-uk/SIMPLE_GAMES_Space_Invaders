import Board from './js/Board.js'
import Player from './js/Player.js'
import Invader from './js/Invader.js'
import Grid from './js/Grid.js'

import Controls from './js/Controls.js'
;(() => {
	const canvas = document.querySelector('canvas')
	const c = canvas.getContext('2d')

	canvas.width = innerWidth
	canvas.height = innerHeight

	const player = new Player(canvas)
	const grids = []
	const projectiles = []
	const controls = new Controls(player, projectiles)
	const invaderProjectiles = []

	addEventListener('resize', () => {
		player.redrawOnResize(canvas)
	})

	let frames = 0
	let randomInterval = Math.floor(Math.random() * 500 + 500)

	function animate() {
		requestAnimationFrame(animate)
		c.fillStyle = 'black'
		c.fillRect(0, 0, canvas.width, canvas.height)

		player.update(c)
		invaderProjectiles.forEach((invaderProjectile, index) => {
			// remove invaders that go off screen
			if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
				setTimeout(() => {
					invaderProjectiles.splice(index, 1)
				}, 0)
			} else invaderProjectile.update(c)

			// Check for player hit
			if (
				invaderProjectile.position.y + invaderProjectile.height >= player.position.y &&
				invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
				invaderProjectile.position.x <= player.position.x + player.width
			) {
				console.log('You lose')
			}
		})
		controls.handleKeyPress(canvas, player)
		projectiles.forEach((projectile, index) => {
			if (projectile.position.y + projectile.radius <= 0) {
				setTimeout(() => {
					projectiles.splice(index, 1)
				}, 0)
			} else {
				projectile.update(c)
			}
		})

		// Updating enemy grids
		grids.forEach((grid, gridIdx) => {
			grid.update(canvas)

			// Spawning invader invaderProjectiles
			let randomInvader = Math.floor(Math.random() * grid.invaders.length)
			if (frames % 100 === 0 && grid.invaders.length > 0) {
				grid.invaders[randomInvader].shoot(invaderProjectiles)
			}

			grid.invaders.forEach((invader, iIdx) => {
				invader.update(c, { velocity: grid.velocity })

				// Collision detection for projectile firing at invader
				projectiles.forEach((projectile, pIdx) => {
					if (
						projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
						projectile.position.x + projectile.radius >= invader.position.x &&
						projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
						projectile.position.y + projectile.radius > invader.position.y
					) {
						setTimeout(() => {
							const invaderFound = grid.invaders.find((invader2) => invader2 === invader)
							const projectileFound = projectiles.find((projectile2) => projectile2 === projectile)

							// remove invader and projectile
							if (invaderFound && projectileFound) {
								grid.invaders.splice(iIdx, 1)
								projectiles.splice(pIdx, 1)

								if (grid.invaders.length > 0) {
									const firstInvader = grid.invaders[0]
									const lastInvader = grid.invaders[grid.invaders.length - 1]
									grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
									grid.position.x = firstInvader.position.x
								} else {
									grid.invaders.splice(gridIdx, 1)
								}
							}
						}, 0)
					}
				})
			})
		})

		// Spawing enemies
		if (frames % randomInterval === 0) {
			// Divisible by 1000
			grids.push(new Grid(canvas))
			randomInterval = Math.floor(Math.random() * 500 + 500)
			frames = 0
		}

		frames++
	}

	animate()
})()
