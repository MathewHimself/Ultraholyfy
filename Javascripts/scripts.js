initRainIconSlider()
initSubscriptionLevels()
initRouletteCasino()
initPixelGrid()
initBatteryModule()
initMoneyRainModule()
initRainIconSlider()
initTypeTextModule()
initMemoGame()
initLabyrinth()
function initRainIconSlider() {
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
  const section8 = document.querySelector('.section8')
  const spinBtn2 = document.querySelector('.spinButton2')
  const whiteSquare = document.querySelector('.whiteSquare')
  const casinoPopup = document.querySelector('.casinoPopup')
  const popupIcon = document.querySelector('.popupIcon')
  const headerElement = document.querySelector('.Header')
  const quoteTextElement = document.querySelector('.quoteText')

  if (!section8 || !spinBtn2 || !whiteSquare) return

  function setAdaptivePositions() {
    const isMobile = window.innerWidth <= 767

    if (isMobile) {
      spinBtn2.style.top = '78.2vw'
      if (casinoPopup) {
        casinoPopup.style.top = '31.5vw'
      }
    } else {
      spinBtn2.style.top = '36.2vw'
      if (casinoPopup) {
        casinoPopup.style.top = ''
      }
    }
  }

  setAdaptivePositions()

  if (casinoPopup) {
    casinoPopup.style.display = 'none'
  }

  window.addEventListener('resize', () => {
    setAdaptivePositions()
  })

  const iconData = {
    'elevatoricon.svg': {
      header: 'реверс',
      quoteText: 'все негативные события становятся позитивными'
    },
    'plusicon.svg': {
      header: 'плюс',
      quoteText: 'в этот день произойдет на одно позитивное событие больше'
    },
    'circlearrowsicon.svg': {
      header: 'цикл',
      quoteText: 'вы проживете этот день еще раз'
    },
    'moonicon.svg': {
      header: 'МУУН',
      quoteText: 'вам приснится приятный сон'
    },
    'arrowsicon.svg': {
      header: 'СКИП',
      quoteText: 'дает право вырезать негативное событие из жизни'
    }
  }

  function getIconUnderWhiteSquare() {
    if (!whiteSquare || !spinBtn2) return null

    const track = spinBtn2.querySelector('.roulette-track')
    if (!track) return null

    const whiteSquareRect = whiteSquare.getBoundingClientRect()
    const spinBtnRect = spinBtn2.getBoundingClientRect()
    const trackRect = track.getBoundingClientRect()

    const centerX = whiteSquareRect.left + whiteSquareRect.width / 2
    const centerY = whiteSquareRect.top + whiteSquareRect.height / 2

    const icons = track.querySelectorAll('img')

    for (let icon of icons) {
      const iconRect = icon.getBoundingClientRect()

      if (
        centerX >= iconRect.left &&
        centerX <= iconRect.right &&
        centerY >= iconRect.top &&
        centerY <= iconRect.bottom
      ) {
        const src = icon.getAttribute('src')
        const iconName = src.split('/').pop()
        return iconName
      }
    }
    return null
  }

  function updatePopup(iconName) {
    if (!casinoPopup || !popupIcon || !headerElement || !quoteTextElement)
      return

    const data = iconData[iconName]
    if (data) {
      popupIcon.src = `Images/${iconName}`
      popupIcon.style.display = 'block'

      headerElement.textContent = data.header
      quoteTextElement.textContent = data.quoteText

      casinoPopup.style.display = 'flex'
    }
  }

  function hidePopup() {
    if (casinoPopup) {
      casinoPopup.style.display = 'none'
    }
  }

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

    const midIdx = Math.floor(icons.length / 2)
    setPos(wCenter - (midIdx * step + iconWidth / 2))

    track.style.top = '50%'
    track.style.position = 'absolute'
  }

  setTimeout(() => {
    init()
  }, 100)

  const snap = () => {
    const step = getStep()
    const sqRect = whiteSquare.getBoundingClientRect()
    const sbRect = spinBtn2.getBoundingClientRect()
    const wCenter = sqRect.left - sbRect.left + sqRect.width / 2
    const coordUnder = wCenter - posX
    const nearest = Math.round((coordUnder - step / 2) / step) * step + step / 2
    setPos(wCenter - nearest)

    const iconName = getIconUnderWhiteSquare()
    if (iconName) {
      updatePopup(iconName)
    }
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

    hidePopup()

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
function initBatteryModule() {
  const batteryContainer = document.querySelector('.battery')
  const batteryCover = document.getElementById('batteryCover')
  const percentElement = document.getElementById('percentValue')
  const lightIcon = document.getElementById('lightIcon')

  let currentBatteryLevel = 0

  function animateLightIcon() {
    if (!lightIcon) return

    const originalWidth = lightIcon.offsetWidth
    const originalHeight = lightIcon.offsetHeight

    lightIcon.style.transform = 'translate(-50%, -50%) scale(1.3)'
    lightIcon.style.transition =
      'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'

    setTimeout(() => {
      lightIcon.style.transform = 'translate(-50%, -50%) scale(1)'
    }, 200)
  }

  function updateBatteryLevel(percent) {
    let newLevel = Math.min(100, Math.max(0, percent))
    let previousLevel = currentBatteryLevel
    currentBatteryLevel = newLevel

    if (batteryCover) {
      batteryCover.style.height = `${newLevel}%`
    }

    if (percentElement) {
      percentElement.textContent = `${newLevel}%`
    }

    if (newLevel === 100 && previousLevel !== 100) {
      if (lightIcon) {
        lightIcon.classList.add('bright')

        animateLightIcon()
      }
      if (percentElement) {
        percentElement.classList.add('bright')
      }
      if (batteryContainer) {
        batteryContainer.style.filter =
          'drop-shadow(0 0 6px rgba(255,255,200,0.6))'
      }

      if (batteryContainer) {
        batteryContainer.style.transform = 'scale(1.02)'
        setTimeout(() => {
          if (batteryContainer) batteryContainer.style.transform = ''
        }, 200)
      }
    } else if (newLevel !== 100) {
      if (lightIcon) {
        lightIcon.classList.remove('bright')
      }
      if (percentElement) {
        percentElement.classList.remove('bright')
      }
      if (batteryContainer) {
        batteryContainer.style.filter = ''
      }
    }
  }

  function increaseBattery(step = 10) {
    let newLevel = currentBatteryLevel + step
    if (newLevel > 100) newLevel = 100
    updateBatteryLevel(newLevel)
    return newLevel
  }

  function resetBattery() {
    updateBatteryLevel(0)
  }

  if (lightIcon) {
    lightIcon.style.position = 'absolute'
    lightIcon.style.top = '50%'
    lightIcon.style.left = '50%'
    lightIcon.style.transform = 'translate(-50%, -50%)'
    lightIcon.style.zIndex = '10'
    lightIcon.style.pointerEvents = 'none'
    lightIcon.style.transition =
      'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.25s ease'
  }

  if (batteryCover) {
    batteryCover.style.position = 'absolute'
    batteryCover.style.bottom = '0'
    batteryCover.style.left = '0'
    batteryCover.style.zIndex = '1'
  }

  if (percentElement) {
    percentElement.style.position = 'absolute'
    percentElement.style.zIndex = '10'
    percentElement.style.bottom = '1.5vw'
  }

  if (batteryContainer) {
    batteryContainer.addEventListener('click', (e) => {
      e.stopPropagation()
      increaseBattery(10)

      batteryContainer.style.transform = 'scale(0.97)'
      setTimeout(() => {
        if (batteryContainer) batteryContainer.style.transform = ''
      }, 120)
    })
  }
  updateBatteryLevel(0)

  window.batteryAPI = {
    increase: increaseBattery,
    setLevel: updateBatteryLevel,
    reset: resetBattery,
    getLevel: () => currentBatteryLevel
  }
}
function initRainIconSlider() {
  const slider = document.querySelector('.rainSlider')
  const btn = slider.querySelector('.rainButton')
  const items = slider.querySelectorAll('.rainIcon')

  function moveTo(item, index) {
    const sRect = slider.getBoundingClientRect()
    const iRect = item.getBoundingClientRect()
    const offset =
      iRect.left - sRect.left + iRect.width / 2 - btn.offsetWidth / 2
    btn.style.transform = `translateY(-50%) translateX(${offset}px)`

    if (window.moneyRainAPI && typeof index !== 'undefined') {
      window.moneyRainAPI.setLevel(index)
    }
  }

  function initButtonPosition() {
    if (items.length > 0) {
      let activeIndex = 0
      if (window.moneyRainAPI) {
        activeIndex = window.moneyRainAPI.getLevel()
      }

      activeIndex = Math.min(activeIndex, items.length - 1)
      moveTo(items[activeIndex], activeIndex)
    }
  }

  items.forEach((icon, index) => {
    icon.addEventListener('click', () => {
      moveTo(icon, index)

      icon.style.transform = 'scale(0.9)'
      setTimeout(() => {
        icon.style.transform = ''
      }, 150)
    })
  })

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initButtonPosition)
  } else {
    initButtonPosition()
  }

  window.addEventListener('resize', () => {
    if (items.length > 0) {
      let activeIndex = 0
      if (window.moneyRainAPI) {
        activeIndex = window.moneyRainAPI.getLevel()
      }
      activeIndex = Math.min(activeIndex, items.length - 1)
      moveTo(items[activeIndex], activeIndex)
    }
  })
}
function initMoneyRainModule() {
  const rainConfig = {
    0: {
      count: 8,
      interval: 600,
      speed: 'slow',
      durationMin: 2.5,
      durationMax: 4.0
    },
    1: {
      count: 15,
      interval: 350,
      speed: 'medium',
      durationMin: 1.8,
      durationMax: 3.0
    },
    2: {
      count: 30,
      interval: 180,
      speed: 'fast',
      durationMin: 1.2,
      durationMax: 2.2
    }
  }

  let currentRainLevel = 0
  let rainInterval = null
  let activeFallingElements = 0
  let maxActiveElements = 50

  let fallingContainer = null
  let rainIcons = null
  let rainButton = null
  let originalDollar = null

  function createFallingDollar() {
    if (!fallingContainer || !originalDollar) return null

    if (activeFallingElements > maxActiveElements) return null

    const dollar = originalDollar.cloneNode(true)
    dollar.classList.add('fallingDollar')
    dollar.style.display = 'block'
    dollar.style.position = 'absolute'

    const containerWidth = fallingContainer.parentElement.clientWidth
    const dollarWidth = parseFloat(getComputedStyle(dollar).width) || 50
    const randomLeft = Math.random() * (containerWidth - dollarWidth)
    dollar.style.left = `${randomLeft}px`

    const randomDelay = Math.random() * 0.5
    dollar.style.animationDelay = `${randomDelay}s`

    const config = rainConfig[currentRainLevel]
    const duration =
      config.durationMin +
      Math.random() * (config.durationMax - config.durationMin)
    dollar.style.animationDuration = `${duration}s`

    const randomScale = 0.7 + Math.random() * 0.8
    dollar.style.width = `${4.896 * randomScale}vw`
    dollar.style.height = 'auto'

    const randomRotate = Math.random() * 360
    dollar.style.transform = `rotate(${randomRotate}deg)`

    fallingContainer.appendChild(dollar)
    activeFallingElements++

    dollar.addEventListener('animationend', () => {
      if (dollar && dollar.remove) {
        dollar.remove()
        activeFallingElements--
      }
    })

    return dollar
  }

  function createBatchOfDollars(count) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        createFallingDollar()
      }, i * 50)
    }
  }

  function startRain(level) {
    if (rainInterval) {
      clearInterval(rainInterval)
      rainInterval = null
    }

    if (fallingContainer) {
      const existingDollars =
        fallingContainer.querySelectorAll('.fallingDollar')
      existingDollars.forEach((dollar) => dollar.remove())
      activeFallingElements = 0
    }

    const config = rainConfig[level]
    if (!config) return

    createBatchOfDollars(config.count)

    rainInterval = setInterval(() => {
      if (fallingContainer && activeFallingElements < maxActiveElements) {
        createFallingDollar()
      }
    }, config.interval)

    isRaining = true
  }

  function stopRain() {
    if (rainInterval) {
      clearInterval(rainInterval)
      rainInterval = null
    }
    if (fallingContainer) {
      const dollars = fallingContainer.querySelectorAll('.fallingDollar')
      dollars.forEach((d) => d.remove())
      activeFallingElements = 0
    }
    isRaining = false
  }

  function setRainLevel(level) {
    if (level === currentRainLevel) return

    currentRainLevel = level

    startRain(currentRainLevel)

    const moneyRainContainer = document.querySelector('.moneyRain')
    if (moneyRainContainer) {
      moneyRainContainer.style.transition = 'box-shadow 0.2s ease'
      moneyRainContainer.style.boxShadow = '0 0 15px rgba(242, 98, 46, 0.5)'
      setTimeout(() => {
        moneyRainContainer.style.boxShadow = ''
      }, 300)
    }
  }

  function updateSliderButtonPosition(level) {
    if (!rainButton) return

    rainButton.classList.remove('pos-0', 'pos-1', 'pos-2')

    switch (level) {
      case 0:
        rainButton.classList.add('pos-0')
        break
      case 1:
        rainButton.classList.add('pos-1')
        break
      case 2:
        rainButton.classList.add('pos-2')
        break
    }
  }

  function init() {
    fallingContainer = document.getElementById('fallingContainer')
    rainIcons = document.querySelectorAll('.rainIcon')
    rainButton = document.querySelector('.rainButton')
    originalDollar = document.querySelector('.karmaDollar')

    if (!fallingContainer) {
      const moneyRain = document.querySelector('.moneyRain')
      if (moneyRain) {
        const newContainer = document.createElement('div')
        newContainer.id = 'fallingContainer'
        newContainer.className = 'fallingContainer'
        moneyRain.appendChild(newContainer)
        fallingContainer = newContainer
      }
    }

    if (fallingContainer) {
      fallingContainer.style.position = 'absolute'
      fallingContainer.style.top = '0'
      fallingContainer.style.left = '0'
      fallingContainer.style.width = '100%'
      fallingContainer.style.height = '100%'
      fallingContainer.style.overflow = 'hidden'
      fallingContainer.style.pointerEvents = 'none'
      fallingContainer.style.zIndex = '10'
    }

    if (rainIcons && rainIcons.length > 0) {
      rainIcons.forEach((icon, index) => {
        icon.addEventListener('click', (e) => {
          e.stopPropagation()

          const newLevel = index
          if (newLevel !== currentRainLevel) {
            setRainLevel(newLevel)
            updateSliderButtonPosition(newLevel)

            icon.style.transform = 'scale(0.9)'
            setTimeout(() => {
              icon.style.transform = ''
            }, 150)

            if (navigator.vibrate) navigator.vibrate(50)
          }
        })
      })
    }
    updateSliderButtonPosition(0)
    startRain(0)

    const moneyRainContainer = document.querySelector('.moneyRain')
    if (moneyRainContainer) {
      moneyRainContainer.addEventListener('mouseenter', () => {
        moneyRainContainer.style.filter = 'brightness(1.02)'
      })
      moneyRainContainer.addEventListener('mouseleave', () => {
        moneyRainContainer.style.filter = ''
      })
    }
  }

  init()

  window.moneyRainAPI = {
    setLevel: setRainLevel,
    stop: stopRain,
    start: startRain,
    getLevel: () => currentRainLevel
  }
}
function initTypeTextModule() {
  const typingElement = document.querySelector('.typing')
  const typeTextContainer = document.querySelector('.typeText')

  if (!typingElement) return

  let originalText = typingElement.textContent || 'Напечатать текст'
  let isTypingMode = true
  let randomTextInterval = null

  const randomChars = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?/~'
  }

  function getRandomChar() {
    const allChars =
      randomChars.lowercase +
      randomChars.uppercase +
      randomChars.numbers +
      randomChars.symbols
    return allChars[Math.floor(Math.random() * allChars.length)]
  }

  function generateRandomString(length) {
    let result = ''
    for (let i = 0; i < length; i++) {
      result += getRandomChar()
    }
    return result
  }

  function addRandomErrors(text, errorCount) {
    if (errorCount <= 0) return text

    let textArray = text.split('')
    const positions = []

    for (let i = 0; i < errorCount && i < textArray.length; i++) {
      let pos
      do {
        pos = Math.floor(Math.random() * textArray.length)
      } while (positions.includes(pos))
      positions.push(pos)
    }

    positions.forEach((pos) => {
      textArray[pos] = getRandomChar()
    })

    return textArray.join('')
  }

  function startRandomSymbols() {
    if (randomTextInterval) clearInterval(randomTextInterval)

    let iterations = 0
    const maxIterations = 15

    randomTextInterval = setInterval(() => {
      if (!typingElement) return

      iterations++

      const randomLength = 10 + Math.floor(Math.random() * 20)
      let randomText = generateRandomString(randomLength)

      const errorCount = Math.floor(Math.random() * 5) + 1
      randomText = addRandomErrors(randomText, errorCount)

      typingElement.textContent = randomText

      typingElement.style.transform =
        'skewX(' + (Math.random() * 4 - 2) + 'deg)'
      setTimeout(() => {
        if (typingElement) typingElement.style.transform = ''
      }, 100)

      if (iterations >= maxIterations) {
        clearInterval(randomTextInterval)
        randomTextInterval = null

        setTimeout(() => {
          typingElement.textContent = originalText
          isTypingMode = true
        }, 300)
      }
    }, 400)
  }

  function startProcess() {
    if (!isTypingMode) return

    isTypingMode = false

    startRandomSymbols()
  }

  function resetToOriginal() {
    if (randomTextInterval) {
      clearInterval(randomTextInterval)
      randomTextInterval = null
    }

    typingElement.textContent = originalText
    isTypingMode = true
  }

  if (typeTextContainer) {
    typeTextContainer.style.cursor = 'pointer'

    typeTextContainer.addEventListener('click', (e) => {
      e.stopPropagation()
      startProcess()
    })

    typeTextContainer.addEventListener('mouseenter', () => {
      if (isTypingMode) {
        typeTextContainer.style.transform = 'scale(1.02)'
      }
    })

    typeTextContainer.addEventListener('mouseleave', () => {
      typeTextContainer.style.transform = ''
    })
  }

  if (typingElement) {
    typingElement.addEventListener('dblclick', (e) => {
      e.stopPropagation()
      resetToOriginal()
    })
  }

  if (typeTextContainer) {
    typeTextContainer.style.backgroundColor = '#fff'
    typeTextContainer.style.transition = 'transform 0.2s ease'
  }

  if (typingElement) {
    typingElement.style.color = '#000'
  }

  window.typeTextAPI = {
    start: startProcess,
    reset: resetToOriginal,
    setText: (text) => {
      originalText = text
      if (isTypingMode) {
        typingElement.textContent = text
      }
    }
  }
}
function initMemoGame() {
  const cards = document.querySelectorAll('.memo .card')
  let flipped = []
  let locked = false

  cards.forEach((card) => {
    const img = card.querySelector('img')
    if (!card.querySelector('.card-inner')) {
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front"></div>
          <div class="card-back">${img ? img.outerHTML : ''}</div>
        </div>`
    }

    card.addEventListener('click', () => {
      if (
        locked ||
        card.classList.contains('active') ||
        card.classList.contains('flipped')
      )
        return

      card.classList.add('flipped')
      flipped.push(card)

      if (flipped.length === 2) {
        locked = true
        const [a, b] = flipped

        if (a.dataset.icon === b.dataset.icon) {
          a.classList.add('active')
          b.classList.add('active')
          a.classList.remove('flipped')
          b.classList.remove('flipped')
          flipped = []
          locked = false
        } else {
          setTimeout(() => {
            a.classList.remove('flipped')
            b.classList.remove('flipped')
            flipped = []
            locked = false
          }, 900)
        }
      }
    })
  })
}
function initLabyrinth() {
  const labirinth = document.querySelector('.labirinth')
  const player = document.querySelector('.player')
  const walls = document.querySelector('.walls')
  const winletter = document.querySelector('.winletter')

  if (!labirinth || !player) return null

  if (winletter) winletter.style.display = 'none'
  if (walls) walls.style.display = 'block'
  if (player) player.style.display = 'block'

  const SVG_W = 651
  const SVG_H = 653
  const STROKE_W = 13
  const WALLS_VW = 33.333
  const LAB_VW = 44.479
  const OFFSET_VW = (LAB_VW - WALLS_VW) / 2
  const PLAYER_VW = 2.656
  const PLAYER_SVG = (PLAYER_VW / WALLS_VW) * SVG_W
  const SPEED = 3.5

  const FINISH_LEFT_VW = 28.6846
  const FINISH_TOP_VW = 5.57043
  const START_LEFT_VW = 5.62807
  const START_TOP_VW = 12.5075

  const scaleX = WALLS_VW / SVG_W
  const scaleY = WALLS_VW / SVG_H
  const START_PX = (START_LEFT_VW - OFFSET_VW) / scaleX
  const START_PY = (START_TOP_VW - OFFSET_VW) / scaleY

  //коллизии
  const PATH =
    'M326.75 111.5H14C9.85786 111.5 6.5 108.142 6.5 104V14C6.5 9.85787 9.85786 6.5 14 6.5H425C429.142 6.5 432.5 9.85786 432.5 14V216.5M539.5 432.5V227C539.5 222.858 536.142 219.5 532 219.5H228C223.858 219.5 220.5 222.858 220.5 227V425C220.5 429.142 223.858 432.5 228 432.5H327.834M327.5 326.5H424C428.142 326.5 431.5 329.858 431.5 334V534.5M538.667 114.209V16C538.667 11.8579 542.025 8.5 546.167 8.5H637C641.142 8.5 644.5 11.8579 644.5 16V639C644.5 643.142 641.142 646.5 637 646.5H14C9.85785 646.5 6.5 643.142 6.5 639V227.417C6.5 223.275 9.85786 219.917 14 219.917H116.836M114.5 323.5V640.5M539.5 537.5H114.5'

  const col = document.createElement('canvas')
  col.width = SVG_W
  col.height = SVG_H
  const ctx = col.getContext('2d')
  ctx.strokeStyle = '#000'
  ctx.lineWidth = STROKE_W
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.stroke(new Path2D(PATH))
  const pixels = ctx.getImageData(0, 0, SVG_W, SVG_H).data

  function isWall(x, y) {
    x = Math.round(x)
    y = Math.round(y)
    if (x < 0 || y < 0 || x >= SVG_W || y >= SVG_H) return true
    return pixels[(y * SVG_W + x) * 4 + 3] > 80
  }

  function collidesWithWall(sx, sy) {
    const s = PLAYER_SVG
    const step = s / 5
    for (let x = sx; x <= sx + s; x += step) {
      for (let y = sy; y <= sy + s; y += step) {
        if (isWall(x, y)) return true
      }
    }
    return false
  }

  function checkFinish(px, py) {
    const playerCenterX = px * scaleX + OFFSET_VW + PLAYER_VW / 2
    const playerCenterY = py * scaleY + OFFSET_VW + PLAYER_VW / 2
    const distance = Math.sqrt(
      Math.pow(playerCenterX - FINISH_LEFT_VW, 2) +
        Math.pow(playerCenterY - FINISH_TOP_VW, 2)
    )
    return distance < PLAYER_VW
  }

  let gameActive = true
  let px = START_PX
  let py = START_PY
  const keys = {}

  function showWin() {
    gameActive = false
    if (walls) walls.style.display = 'none'
    if (player) player.style.display = 'none'
    if (winletter) {
      Object.assign(winletter.style, {
        display: 'block',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '20'
      })
    }
  }

  function handleKeyDown(e) {
    if (!gameActive) return
    const k = e.key.toLowerCase()
    if (['w', 'a', 's', 'd'].includes(k)) {
      e.preventDefault()
      keys[k] = true
    }
  }

  function handleKeyUp(e) {
    const k = e.key.toLowerCase()
    if (['w', 'a', 's', 'd'].includes(k)) keys[k] = false
  }

  function render() {
    player.style.left = px * scaleX + OFFSET_VW + 'vw'
    player.style.top = py * scaleY + OFFSET_VW + 'vw'
  }

  let animationId = null

  function loop() {
    if (!gameActive) return

    let dx = 0,
      dy = 0
    if (keys['w']) dy = -SPEED
    if (keys['s']) dy = SPEED
    if (keys['a']) dx = -SPEED
    if (keys['d']) dx = SPEED

    if (dx && dy) {
      dx *= 0.7071
      dy *= 0.7071
    }

    if (dx && !collidesWithWall(px + dx, py)) px += dx
    if (dy && !collidesWithWall(px, py + dy)) py += dy

    render()

    if (checkFinish(px, py)) {
      showWin()
      return
    }
    animationId = requestAnimationFrame(loop)
  }

  // запуск
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  render()
  animationId = requestAnimationFrame(loop)

  // очистка
  return {
    destroy: () => {
      gameActive = false
      cancelAnimationFrame(animationId)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }
}
