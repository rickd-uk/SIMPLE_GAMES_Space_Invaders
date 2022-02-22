import Board from './js/Board.js'
import Player from './js/Player.js'
import Grid from './js/Grid.js'
import Particle from './js/Particle.js'
import Controls from './js/Controls.js'
import { Sound } from './js/Sound.js'
;(() => {
	const canvas = document.querySelector('canvas')
	const c = canvas.getContext('2d')

	const scoreEl = document.getElementById('scoreEl')

	// canvas.width = innerWidth
	// canvas.height = innerHeight
	canvas.width = 1024
	canvas.height = 576

	let game = {
		over: false,
		active: true,
	}
	let score = 0

	const invaderHitSound = new Sound('./sound/invaderHit.wav')
	let shipExplosionSound = new Sound('./sound/ship-explosion.wav')

	const startSound = new Sound('./sound/start.wav')
	startSound.volume(0.4)
	startSound.play()

	const bgMusic = new Sound('./sound/bgMusic.wav')
	bgMusic.volume(0.1)
	bgMusic.loop()
	bgMusic.play()

	const player = new Player(canvas)
	const grids = []
	const projectiles = []
	const controls = new Controls(player, projectiles, game)
	const invaderProjectiles = []
	const particles = []

	// addEventListener('resize', () => {
	// 	player.redrawOnResize(canvas)
	// })

	addEventListener('timeupdate', function () {
		console.log(currentTime)
	})

	let frames = 0
	let randomInterval = Math.floor(Math.random() * 500 + 500)

	function createBGStars() {
		for (let i = 0; i < 100; i++) {
			particles.push(
				new Particle({
					position: {
						x: Math.random() * canvas.width,
						y: Math.random() * canvas.height,
					},
					velocity: {
						x: 0,
						y: 0.2,
					},
					radius: 1,
					color: 'white',
				}),
			)
		}
	}

	createBGStars()

	function createParticles({ object, fades, color = '#BAA0DE' }) {
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
					fades,
				}),
			)
		}
	}

	function animate() {
		if (!game.active) return
		requestAnimationFrame(animate)
		c.fillStyle = 'black'
		c.fillRect(0, 0, canvas.width, canvas.height)

		player.update(c)

		particles.forEach((particle, idx) => {
			// reuse background stars - those that reach the bottom of the canvas
			// are place back in the top with a random x pos
			if (particle.position.y - particle.radius >= canvas.height) {
				particle.position.x = Math.random() * canvas.width
				particle.position.y = -particle.radius
			}
			// remove particles to cleanup (for performance)
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
					player.opacity = 0
					game.over = true
				}, 0)

				setTimeout(() => {
					game.active = false
				}, 2000)

				// Show player ship explosion
				createParticles({ object: player, color: 'white', fades: true })

				shipExplosionSound.volume(0.2)
				shipExplosionSound.play()
				setTimeout(() => {
					shipExplosionSound = null
				}, 2000)

				bgMusic.stop()
			}
		})

		controls.handleKeyPress(canvas, player, game)

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

							// Hit Enemy! -> remove invader and projectile
							if (invaderFound && projectileFound) {
								// set off explosion for invader hit
								score += 8
								scoreEl.innerText = score

								// dynamic score labels
								const scoreLabel = document.createElement('label')
								scoreLabel.innerHTML = 100
								scoreLabel.style.position = 'absolute'
								scoreLabel.style.color = 'white'
								// set score position to invader that was destroyed
								scoreLabel.style.top = invader.position.y + 'px'
								scoreLabel.style.left = invader.position.x + 'px'
								scoreLabel.style.userSelect = 'none'

								// add score
								const gameBoard = document.querySelector('#game-board')
								gameBoard.appendChild(scoreLabel)

								gsap.to(scoreLabel, {
									opacity: 0,
									y: -30,
									duration: 0.9,
									onComplete: () => {
										gameBoard.removeChild(scoreLabel)
									},
								})

								createParticles({
									object: invader,
									fades: true,
								})

								// explosion sound

								invaderHitSound.volume(0.2)
								invaderHitSound.play()

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
			randomInterval = Math.floor(Math.random() * 150 + 100)
			console.log(randomInterval)
			frames = 0
		}

		frames++
	}

	animate()
})()
