import Board from './js/Board.js'
import Player from './js/Player.js'
import Grid from './js/Grid.js'
import Particle from './js/Particle.js'

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
	const particles = []

	addEventListener('resize', () => {
		player.redrawOnResize(canvas)
	})

	let frames = 0
	let randomInterval = Math.floor(Math.random() * 500 + 500)

	function createParticles({ object, color = '#BAA0DE' }) {
		for (let i = 0; i < 15; i++) {
			particles.push(
				new Particle({
					position: {
						x: object.position.x + object.width / 2,
						y: object.position.y + object.height / 2,
					},
					velocity: {
						x: (Math.random() - 0.5) * 2,
						y: (Math.random() - 0.5) * 2,
					},
					radius: Math.random() * 3,
					color,
				}),
			)
		}
	}

	function animate() {
		requestAnimationFrame(animate)
		c.fillStyle = 'black'
		c.fillRect(0, 0, canvas.width, canvas.height)

		player.update(c)

		// remove particles
		particles.forEach((particle, idx) => {
			if (particle.opacity <= 0) {
				setTimeout(() => {
					particles.splice(idx, 1)
				}, 0)
			} else {
				particle.update(c)
			}
		})

		invaderProjectiles.forEach((invaderProjectile, index) => {
			// remove invaders that go off screen
			if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
				setTimeout(() => {
					invaderProjectiles.splice(index, 1)
				}, 0)
			} else invaderProjectile.update(c)

			// projectile hits player
			if (
				invaderProjectile.position.y + invaderProjectile.height >= player.position.y &&
				invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
				invaderProjectile.position.x <= player.position.x + player.width
			) {
				setTimeout(() => {
					invaderProjectiles.splice(index, 1)
				}, 0)
				// Show player ship explosion
				createParticles({ object: player, color: 'white' })
			}
		})

		controls.handleKeyPress(canvas, player)

		// remove projectiles
		projectiles.forEach((projectile, index) => {
			if (projectile.position.y + projectile.radius <= 0) {
				setTimeout(() => {
					projectiles.splice(index, 1)
				}, 0)
			} else {
				// update projectile position
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

			// start grid loop
			grid.invaders.forEach((invader, iIdx) => {
				invader.update(c, { velocity: grid.velocity })

				// projectiles hit enemy
				projectiles.forEach((projectile, pIdx) => {
					if (
						projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
						projectile.position.x + projectile.radius >= invader.position.x &&
						projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
						projectile.position.y + projectile.radius > invader.position.y
					) {
						setTimeout(() => {
							// check if invader and projectile can be found in array
							const invaderFound = grid.invaders.find((invader2) => invader2 === invader)
							const projectileFound = projectiles.find((projectile2) => projectile2 === projectile)

							// remove invader and projectile
							if (invaderFound && projectileFound) {
								// set off explosion for invader hit
								createParticles({
									object: invader,
								})

								grid.invaders.splice(iIdx, 1)
								projectiles.splice(pIdx, 1)

								// update the grid width when invaders are removed, so back and forth movement matches with the grid width
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
