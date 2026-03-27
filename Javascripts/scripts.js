document.addEventListener('DOMContentLoaded', () => {
  const section8 = document.querySelector('.section8')
  const spinBtn2 = document.querySelector('.spinButton2')
  const whiteSquare = document.querySelector('.whiteSquare')

  // Собираем все SVG-иконки внутри spinButton2
  const icons = Array.from(spinBtn2.querySelectorAll('img[class*="icon"]'))

  // Создаём трек
  const track = document.createElement('div')
  track.className = 'roulette-track'
  icons.forEach((icon) => {
    icon.classList.add('roulette-icon')
    track.appendChild(icon)
  })
  spinBtn2.appendChild(track)

  // Дублируем для бесконечной прокрутки
  icons.forEach((icon) => {
    const clone = icon.cloneNode(true)
    clone.classList.add('roulette-icon', 'clone')
    track.appendChild(clone)
  })

  // --- Состояние ---
  let posX = 0
  let speed = 0
  let isSpinning = false
  let stopping = false
  const TARGET_SPEED = 3.5

  const iconWidth = () => {
    const el = track.querySelector('.roulette-icon')
    const gap = parseFloat(getComputedStyle(track).gap) || 0
    return el ? el.offsetWidth + gap : 96
  }

  const updateHighlight = () => {
    const sq = whiteSquare.getBoundingClientRect()
    track.querySelectorAll('.roulette-icon').forEach((icon) => {
      const ic = icon.getBoundingClientRect()
      const center = ic.left + ic.width / 2
      icon.classList.toggle(
        'over-white',
        center >= sq.left && center <= sq.right
      )
    })
  }

  const snapToGrid = (totalWidth) => {
    const iw = iconWidth()
    const sq = whiteSquare.getBoundingClientRect()
    const sb = spinBtn2.getBoundingClientRect()
    const whiteCenter = sq.left - sb.left + sq.width / 2
    const currentCenter = -posX + whiteCenter
    const nearest = Math.round(currentCenter / iw) * iw
    posX -= nearest - currentCenter
    if (Math.abs(posX) >= totalWidth) posX += totalWidth
    track.style.transform = `translateX(${posX}px)`
  }

  const animate = () => {
    if (!isSpinning && !stopping) return

    const totalWidth = iconWidth() * icons.length

    if (stopping) {
      speed *= 0.96
      if (speed < 0.3) {
        speed = 0
        stopping = false
        snapToGrid(totalWidth)
        updateHighlight()
        section8.classList.remove('section8--spinning')
        return
      }
    } else {
      if (speed < TARGET_SPEED) speed = Math.min(speed + 0.3, TARGET_SPEED)
    }

    posX -= speed
    if (Math.abs(posX) >= totalWidth) posX += totalWidth
    track.style.transform = `translateX(${posX}px)`
    updateHighlight()
    requestAnimationFrame(animate)
  }

  // --- Клик на section8 запускает рулетку ---
  const SPIN_DURATION_MIN = 1500
  const SPIN_DURATION_MAX = 3200

  section8.addEventListener('click', () => {
    if (isSpinning || stopping) return

    section8.classList.add('section8--spinning')
    track
      .querySelectorAll('.roulette-icon')
      .forEach((i) => i.classList.remove('over-white'))

    isSpinning = true
    stopping = false
    speed = 0
    requestAnimationFrame(animate)

    const duration =
      SPIN_DURATION_MIN +
      Math.random() * (SPIN_DURATION_MAX - SPIN_DURATION_MIN)
    setTimeout(() => {
      stopping = true
      isSpinning = false
    }, duration)
  })
})
