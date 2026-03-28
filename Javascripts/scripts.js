initRainIconSlider()
initSubscriptionLevels()
initRouletteCasino()
initPixelGrid()
function initRainIconSlider() {
  /* RAIN ICONSLIDER */
  const slider = document.querySelector('.rainSlider')
  const btn = slider.querySelector('.rainButton')
  const items = slider.querySelectorAll('.rainIcon')

  function moveTo(item) {
    const sRect = slider.getBoundingClientRect()
    const iRect = item.getBoundingClientRect()
    const offset =
      iRect.left - sRect.left + iRect.width / 2 - btn.offsetWidth / 2
    btn.style.transform = `translateY(-50%) translateX(${offset}px)`
  }

  items.forEach((icon) => {
    icon.addEventListener('click', () => moveTo(icon))
  })
}
function initSubscriptionLevels() {
  /* УРОВНИ ПОДПИСКИ */
  const levelData = {
    1: { happiness: 40, income: 35, health: 45, luck: 30, wellbeing: 40 },
    2: { happiness: 55, income: 50, health: 60, luck: 45, wellbeing: 55 },
    3: { happiness: 70, income: 65, health: 75, luck: 60, wellbeing: 70 },
    4: { happiness: 85, income: 80, health: 85, luck: 75, wellbeing: 85 },
    5: { happiness: 100, income: 95, health: 100, luck: 90, wellbeing: 100 }
  }

  const MAX_BAR_HEIGHT_VW = 15

  const barElements = {
    happiness: document.getElementById('barHappiness'),
    income: document.getElementById('barIncome'),
    health: document.getElementById('barHealth'),
    luck: document.getElementById('barLuck'),
    wellbeing: document.getElementById('barWellbeing')
  }

  const valueElements = {
    happiness: document.getElementById('happinessValue'),
    income: document.getElementById('incomeValue'),
    health: document.getElementById('healthValue'),
    luck: document.getElementById('luckValue'),
    wellbeing: document.getElementById('wellbeingValue')
  }

  function updateMetric(metricName, percentValue) {
    const bar = barElements[metricName]
    const valueSpan = valueElements[metricName]
    if (!bar || !valueSpan) return

    let percent = Math.min(100, Math.max(0, percentValue))
    let heightInVw = (percent / 100) * MAX_BAR_HEIGHT_VW
    bar.style.height = `${heightInVw}vw`
    valueSpan.innerText = `${Math.round(percent)}%`
  }

  function applyLevel(levelNumber) {
    const data = levelData[levelNumber]
    if (!data) return

    updateMetric('happiness', data.happiness)
    updateMetric('income', data.income)
    updateMetric('health', data.health)
    updateMetric('luck', data.luck)
    updateMetric('wellbeing', data.wellbeing)
  }

  const buttons = document.querySelectorAll('.subscribitionLine .button')

  function setActiveButton(activeBtn) {
    buttons.forEach((btn) => btn.classList.remove('active'))
    activeBtn.classList.add('active')
  }

  buttons.forEach((btn) => {
    const levelAttr = btn.getAttribute('data-level')
    if (levelAttr) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const level = parseInt(levelAttr, 10)
        if (!isNaN(level) && level >= 1 && level <= 5) {
          applyLevel(level)
          setActiveButton(btn)
        }
      })
    }
  })

  const defaultLevel = 3
  const defaultButton = document.querySelector(
    `.button[data-level="${defaultLevel}"]`
  )
  if (defaultButton) {
    applyLevel(defaultLevel)
    setActiveButton(defaultButton)
  } else {
    applyLevel(3)
    const fallbackBtn = document.querySelector('.button[data-level="3"]')
    if (fallbackBtn) setActiveButton(fallbackBtn)
  }

  window.addEventListener('load', () => {
    const currentActive = document.querySelector(
      '.subscribitionLine .button.active'
    )
    if (currentActive && currentActive.getAttribute('data-level')) {
      const lvl = parseInt(currentActive.getAttribute('data-level'), 10)
      applyLevel(lvl)
    } else {
      applyLevel(3)
      const lvl3Btn = document.querySelector('.button[data-level="3"]')
      if (lvl3Btn) setActiveButton(lvl3Btn)
    }
  })

  setTimeout(() => {
    const anyActive = document.querySelector(
      '.subscribitionLine .button.active'
    )
    if (!anyActive) {
      const lvl3 = document.querySelector('.button[data-level="3"]')
      if (lvl3) {
        applyLevel(3)
        setActiveButton(lvl3)
      }
    }
  }, 100)
}
function initRouletteCasino() {
  /* РУЛЕТКА КАЗИНО */
  const section8 = document.querySelector('.section8')
  const spinBtn2 = document.querySelector('.spinButton2')
  const whiteSquare = document.querySelector('.whiteSquare')

  const icons = Array.from(spinBtn2.querySelectorAll('img'))

  const track = document.createElement('div')
  track.className = 'roulette-track'
  icons.forEach((icon) => track.appendChild(icon))
  spinBtn2.appendChild(track)

  icons.forEach((icon) => track.appendChild(icon.cloneNode(true)))

  let posX = 0
  let speed = 0
  let isSpinning = false
  let stopping = false

  const getStep = () => {
    const icon = track.querySelector('img')
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    return icon.offsetWidth + gap
  }

  // ВСЕГДА оба translate — X меняется, Y фиксирован -50%
  const setPos = (x) => {
    posX = x
    track.style.transform = `translateX(${x}px) translateY(-50%)`
  }

  const init = () => {
    const icon = track.querySelector('img')
    const iconWidth = icon.offsetWidth
    const step = getStep()
    const sqRect = whiteSquare.getBoundingClientRect()
    const sbRect = spinBtn2.getBoundingClientRect()
    const wCenter = sqRect.left - sbRect.left + sqRect.width / 2
    // Ставим среднюю иконку под whiteSquare — иконки заполняют обе стороны
    const midIdx = Math.floor(icons.length / 2)
    setPos(wCenter - (midIdx * step + iconWidth / 2))
  }

  requestAnimationFrame(() => requestAnimationFrame(init))

  const snap = () => {
    const step = getStep()
    const sqRect = whiteSquare.getBoundingClientRect()
    const sbRect = spinBtn2.getBoundingClientRect()
    const wCenter = sqRect.left - sbRect.left + sqRect.width / 2
    const coordUnder = wCenter - posX
    const nearest = Math.round((coordUnder - step / 2) / step) * step + step / 2
    setPos(wCenter - nearest)
  }

  const animate = () => {
    const step = getStep()
    const totalWidth = step * icons.length

    if (stopping) {
      speed *= 0.95
      if (speed < 0.2) {
        speed = 0
        stopping = false
        snap()
        section8.classList.remove('spinning')
        return
      }
    } else {
      speed = Math.min(speed + 0.3, 4)
    }

    let next = posX - speed
    if (next < -totalWidth) next += totalWidth
    if (next > totalWidth) next -= totalWidth
    setPos(next)

    requestAnimationFrame(animate)
  }

  section8.addEventListener('click', () => {
    if (isSpinning || stopping) return
    section8.classList.add('spinning')
    isSpinning = true
    speed = 0
    requestAnimationFrame(animate)

    const duration = 1800 + Math.random() * 1600
    setTimeout(() => {
      isSpinning = false
      stopping = true
    }, duration)
  })
}
function initPixelGrid() {
  const PIXEL_COLORS = [
    'B20D09',
    'E32407',
    'DB1E08',
    'E67322',
    'E46C1E',
    'E1671E',
    'D9601B',
    'F83B04',
    'EA4503',
    'CC5A35',
    'E77423',
    'E36E1F',
    'E1691D',
    'DE631D',
    'E53C03',
    'DD3504',
    'DE390B',
    'E93E06',
    'E77020',
    'E26A1E',
    'DE651C',
    'E54B01',
    'E53B0A',
    'E03700',
    'D63E15',
    'EF6213',
    'E46D1D',
    'DC661C',
    'F05C04',
    'E74400',
    'E94601',
    'EA8A4E',
    'E3894D',
    'F9A962',
    'DC671A',
    'D11D0C',
    'D52900',
    'AD0C04',
    'D68556',
    'D08254',
    '460607',
    'E0641E',
    'E02804',
    '7F0200',
    '5A0500',
    '7A0903',
    '7A0903',
    'A1250D',
    'DC6217'
  ]

  let pixelColors = [...PIXEL_COLORS]

  function shuffleArray(arr) {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  function renderPixelGrid() {
    const grid = document.getElementById('pixelGrid')
    if (!grid) return
    const cells = grid.querySelectorAll('.pixelCell')
    if (cells.length === 0) {
      pixelColors.forEach((color) => {
        const cell = document.createElement('div')
        cell.className = 'pixelCell'
        cell.style.backgroundColor = '#' + color
        grid.appendChild(cell)
      })
    } else {
      cells.forEach((cell, i) => {
        cell.classList.add('shuffling')
        cell.style.backgroundColor = '#' + pixelColors[i]
      })
      setTimeout(
        () => cells.forEach((c) => c.classList.remove('shuffling')),
        400
      )
    }
  }

  const grid = document.getElementById('pixelGrid')
  if (!grid) return

  renderPixelGrid()

  const pixelSquare = document.getElementById('pixelSquare')
  if (pixelSquare) {
    pixelSquare.addEventListener('click', () => {
      pixelColors = shuffleArray(pixelColors)
      renderPixelGrid()
    })
  }
}
