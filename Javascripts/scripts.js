initRainIconSlider()
initSubscriptionLevels()
initRouletteCasino()
initPixelGrid()
initBatteryModule()
initMoneyRainModule()
initRainIconSlider()
initTypeTextModule()
initMemoGame()
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
function initBatteryModule() {
  // ========== BATTERY MODULE ==========
  // Получаем элементы батареи
  const batteryContainer = document.querySelector('.battery')
  const batteryCover = document.getElementById('batteryCover')
  const percentElement = document.getElementById('percentValue')
  const lightIcon = document.getElementById('lightIcon')

  // Текущий уровень заряда (0-100)
  let currentBatteryLevel = 0

  // Функция анимации увеличения иконки
  function animateLightIcon() {
    if (!lightIcon) return

    // Сохраняем исходный размер
    const originalWidth = lightIcon.offsetWidth
    const originalHeight = lightIcon.offsetHeight

    // Увеличиваем иконку
    lightIcon.style.transform = 'translate(-50%, -50%) scale(1.3)'
    lightIcon.style.transition =
      'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'

    // Возвращаем к исходному размеру через 0.2 секунды
    setTimeout(() => {
      lightIcon.style.transform = 'translate(-50%, -50%) scale(1)'
    }, 200)
  }

  // Функция обновления батареи (устанавливает уровень в процентах)
  function updateBatteryLevel(percent) {
    // Ограничиваем значение от 0 до 100
    let newLevel = Math.min(100, Math.max(0, percent))
    let previousLevel = currentBatteryLevel
    currentBatteryLevel = newLevel

    // Обновляем высоту заливки (batteryCover)
    if (batteryCover) {
      batteryCover.style.height = `${newLevel}%`
    }

    // Обновляем текст процентов
    if (percentElement) {
      percentElement.textContent = `${newLevel}%`
    }

    // Проверяем, достигнут ли 100% (и был ли предыдущий уровень не 100%)
    if (newLevel === 100 && previousLevel !== 100) {
      // Добавляем классы яркости
      if (lightIcon) {
        lightIcon.classList.add('bright')

        // Запускаем анимацию увеличения иконки
        animateLightIcon()
      }
      if (percentElement) {
        percentElement.classList.add('bright')
      }

      // Дополнительная визуальная обратная связь
      if (batteryContainer) {
        batteryContainer.style.filter =
          'drop-shadow(0 0 6px rgba(255,255,200,0.6))'
      }

      // Микро-анимация для всей батареи
      if (batteryContainer) {
        batteryContainer.style.transform = 'scale(1.02)'
        setTimeout(() => {
          if (batteryContainer) batteryContainer.style.transform = ''
        }, 200)
      }
    } else if (newLevel !== 100) {
      // Если не 100% — убираем яркость
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

  // Функция увеличения заряда на шаг (по умолчанию 10%)
  function increaseBattery(step = 10) {
    let newLevel = currentBatteryLevel + step
    if (newLevel > 100) newLevel = 100
    updateBatteryLevel(newLevel)
    return newLevel
  }

  // Функция сброса батареи (для тестирования)
  function resetBattery() {
    updateBatteryLevel(0)
  }

  // Устанавливаем правильные стили для иконки
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

  // Обработчик клика по батарее — увеличиваем заряд на 10%
  if (batteryContainer) {
    batteryContainer.addEventListener('click', (e) => {
      e.stopPropagation()
      increaseBattery(10)

      // Дополнительный тактильный эффект (вибрация, если поддерживается)
      if (navigator.vibrate) navigator.vibrate(50)

      // Микро-анимация нажатия
      batteryContainer.style.transform = 'scale(0.97)'
      setTimeout(() => {
        if (batteryContainer) batteryContainer.style.transform = ''
      }, 120)
    })
  }

  // Инициализация батареи
  // Убеждаемся, что батарея стартует с 0%
  updateBatteryLevel(0)

  // Добавляем дополнительную интерактивность: при наведении лёгкое свечение
  if (batteryContainer) {
    batteryContainer.addEventListener('mouseenter', () => {
      if (currentBatteryLevel < 100) {
        batteryContainer.style.filter = 'brightness(1.05)'
      }
    })
    batteryContainer.addEventListener('mouseleave', () => {
      if (currentBatteryLevel < 100) {
        batteryContainer.style.filter = ''
      } else {
        batteryContainer.style.filter =
          'drop-shadow(0 0 6px rgba(255,255,200,0.6))'
      }
    })
  }

  // Экспортируем функции глобально (для возможности вызова из консоли или других модулей)
  window.batteryAPI = {
    increase: increaseBattery,
    setLevel: updateBatteryLevel,
    reset: resetBattery,
    getLevel: () => currentBatteryLevel
  }
}
function initRainIconSlider() {
  /* RAIN ICONSLIDER */
  const slider = document.querySelector('.rainSlider')
  const btn = slider.querySelector('.rainButton')
  const items = slider.querySelectorAll('.rainIcon')

  function moveTo(item, index) {
    const sRect = slider.getBoundingClientRect()
    const iRect = item.getBoundingClientRect()
    const offset =
      iRect.left - sRect.left + iRect.width / 2 - btn.offsetWidth / 2
    btn.style.transform = `translateY(-50%) translateX(${offset}px)`

    // Если есть API денежного дождя, обновляем уровень
    if (window.moneyRainAPI && typeof index !== 'undefined') {
      window.moneyRainAPI.setLevel(index)
    }
  }

  // Инициализация позиции кнопки
  function initButtonPosition() {
    if (items.length > 0) {
      // Проверяем текущий уровень из moneyRainAPI
      let activeIndex = 0
      if (window.moneyRainAPI) {
        activeIndex = window.moneyRainAPI.getLevel()
      }
      // Ограничиваем индекс
      activeIndex = Math.min(activeIndex, items.length - 1)
      moveTo(items[activeIndex], activeIndex)
    }
  }

  // Добавляем обработчики кликов на иконки
  items.forEach((icon, index) => {
    icon.addEventListener('click', () => {
      moveTo(icon, index)

      // Визуальная обратная связь
      icon.style.transform = 'scale(0.9)'
      setTimeout(() => {
        icon.style.transform = ''
      }, 150)
    })
  })

  // Инициализируем позицию после загрузки
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initButtonPosition)
  } else {
    initButtonPosition()
  }

  // Обновляем позицию при изменении размера окна
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
  // ========== MONEY RAIN MODULE ==========
  // Конфигурация количества падающих долларов для каждого уровня
  const rainConfig = {
    0: {
      count: 8, // количество одновременно падающих
      interval: 600, // интервал создания новых (мс)
      speed: 'slow', // медленное падение
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

  // DOM элементы
  let fallingContainer = null
  let rainIcons = null
  let rainButton = null
  let originalDollar = null

  // Функция создания падающего доллара
  function createFallingDollar() {
    if (!fallingContainer || !originalDollar) return null

    // Ограничиваем количество элементов на экране для производительности
    if (activeFallingElements > maxActiveElements) return null

    const dollar = originalDollar.cloneNode(true)
    dollar.classList.add('fallingDollar')
    dollar.style.display = 'block'
    dollar.style.position = 'absolute'

    // Случайная позиция по горизонтали (от 0 до ширины контейнера)
    const containerWidth = fallingContainer.parentElement.clientWidth
    const dollarWidth = parseFloat(getComputedStyle(dollar).width) || 50
    const randomLeft = Math.random() * (containerWidth - dollarWidth)
    dollar.style.left = `${randomLeft}px`

    // Случайная задержка старта
    const randomDelay = Math.random() * 0.5
    dollar.style.animationDelay = `${randomDelay}s`

    // Длительность анимации зависит от выбранного уровня
    const config = rainConfig[currentRainLevel]
    const duration =
      config.durationMin +
      Math.random() * (config.durationMax - config.durationMin)
    dollar.style.animationDuration = `${duration}s`

    // Случайный размер (варьируем для разнообразия)
    const randomScale = 0.7 + Math.random() * 0.8
    dollar.style.width = `${4.896 * randomScale}vw`
    dollar.style.height = 'auto'

    // Добавляем случайный поворот в начале
    const randomRotate = Math.random() * 360
    dollar.style.transform = `rotate(${randomRotate}deg)`

    // Добавляем элемент в контейнер
    fallingContainer.appendChild(dollar)
    activeFallingElements++

    // Удаляем элемент после окончания анимации
    dollar.addEventListener('animationend', () => {
      if (dollar && dollar.remove) {
        dollar.remove()
        activeFallingElements--
      }
    })

    return dollar
  }

  // Функция создания нескольких долларов одновременно
  function createBatchOfDollars(count) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        createFallingDollar()
      }, i * 50)
    }
  }

  // Функция запуска дождя
  function startRain(level) {
    // Останавливаем текущий дождь
    if (rainInterval) {
      clearInterval(rainInterval)
      rainInterval = null
    }

    // Очищаем все существующие падающие элементы
    if (fallingContainer) {
      const existingDollars =
        fallingContainer.querySelectorAll('.fallingDollar')
      existingDollars.forEach((dollar) => dollar.remove())
      activeFallingElements = 0
    }

    const config = rainConfig[level]
    if (!config) return

    // Создаем начальную партию долларов
    createBatchOfDollars(config.count)

    // Запускаем интервал для постоянного создания новых долларов
    rainInterval = setInterval(() => {
      if (fallingContainer && activeFallingElements < maxActiveElements) {
        createFallingDollar()
      }
    }, config.interval)

    isRaining = true
  }

  // Функция остановки дождя
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

  // Функция изменения уровня дождя
  function setRainLevel(level) {
    if (level === currentRainLevel) return

    currentRainLevel = level

    // Запускаем дождь с новым уровнем
    startRain(currentRainLevel)

    // Визуальная обратная связь - подсветка контейнера
    const moneyRainContainer = document.querySelector('.moneyRain')
    if (moneyRainContainer) {
      moneyRainContainer.style.transition = 'box-shadow 0.2s ease'
      moneyRainContainer.style.boxShadow = '0 0 15px rgba(242, 98, 46, 0.5)'
      setTimeout(() => {
        moneyRainContainer.style.boxShadow = ''
      }, 300)
    }
  }

  // Функция обновления позиции кнопки слайдера
  function updateSliderButtonPosition(level) {
    if (!rainButton) return

    // Удаляем старые классы позиции
    rainButton.classList.remove('pos-0', 'pos-1', 'pos-2')

    // Добавляем новый класс в зависимости от уровня
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

  // Инициализация
  function init() {
    // Находим все необходимые элементы
    fallingContainer = document.getElementById('fallingContainer')
    rainIcons = document.querySelectorAll('.rainIcon')
    rainButton = document.querySelector('.rainButton')
    originalDollar = document.querySelector('.karmaDollar')

    // Проверяем наличие контейнера для падающих элементов
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

    // Добавляем CSS для fallingContainer
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

    // Обработка кликов по иконкам слайдера
    if (rainIcons && rainIcons.length > 0) {
      rainIcons.forEach((icon, index) => {
        icon.addEventListener('click', (e) => {
          e.stopPropagation()

          // Меняем уровень дождя (0, 1, 2)
          const newLevel = index
          if (newLevel !== currentRainLevel) {
            setRainLevel(newLevel)
            updateSliderButtonPosition(newLevel)

            // Визуальная обратная связь
            icon.style.transform = 'scale(0.9)'
            setTimeout(() => {
              icon.style.transform = ''
            }, 150)

            // Вибрация при смене режима
            if (navigator.vibrate) navigator.vibrate(50)
          }
        })
      })
    }

    // Устанавливаем начальную позицию кнопки
    updateSliderButtonPosition(0)

    // Запускаем дождь с уровнем "мало"
    startRain(0)

    // Добавляем эффект при наведении на контейнер
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

  // Запускаем инициализацию
  init()

  // Экспортируем функции для возможного использования из других модулей
  window.moneyRainAPI = {
    setLevel: setRainLevel,
    stop: stopRain,
    start: startRain,
    getLevel: () => currentRainLevel
  }
}
function initTypeTextModule() {
  // ========== TYPETEXT MODULE ==========
  const typingElement = document.querySelector('.typing')
  const typeTextContainer = document.querySelector('.typeText')

  if (!typingElement) return

  let originalText = typingElement.textContent || 'Напечатать текст'
  let isTypingMode = true
  let randomTextInterval = null

  // Словарь случайных символов
  const randomChars = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?/~'
  }

  // Функция получения случайного символа
  function getRandomChar() {
    const allChars =
      randomChars.lowercase +
      randomChars.uppercase +
      randomChars.numbers +
      randomChars.symbols
    return allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Функция генерации случайной строки заданной длины
  function generateRandomString(length) {
    let result = ''
    for (let i = 0; i < length; i++) {
      result += getRandomChar()
    }
    return result
  }

  // Функция добавления случайных ошибок в текст
  function addRandomErrors(text, errorCount) {
    if (errorCount <= 0) return text

    let textArray = text.split('')
    const positions = []

    // Выбираем случайные позиции для ошибок
    for (let i = 0; i < errorCount && i < textArray.length; i++) {
      let pos
      do {
        pos = Math.floor(Math.random() * textArray.length)
      } while (positions.includes(pos))
      positions.push(pos)
    }

    // Заменяем символы на случайные
    positions.forEach((pos) => {
      textArray[pos] = getRandomChar()
    })

    return textArray.join('')
  }

  // Функция показа случайных символов с ошибками (сразу)
  function startRandomSymbols() {
    if (randomTextInterval) clearInterval(randomTextInterval)

    let iterations = 0
    const maxIterations = 15 // Количество смен текста перед возвратом

    randomTextInterval = setInterval(() => {
      if (!typingElement) return

      iterations++

      // Генерируем случайную строку длиной от 10 до 30 символов
      const randomLength = 10 + Math.floor(Math.random() * 20)
      let randomText = generateRandomString(randomLength)

      // Добавляем ошибки в случайный текст
      const errorCount = Math.floor(Math.random() * 5) + 1
      randomText = addRandomErrors(randomText, errorCount)

      // Обновляем текст
      typingElement.textContent = randomText

      // Добавляем эффект "глюка"
      typingElement.style.transform =
        'skewX(' + (Math.random() * 4 - 2) + 'deg)'
      setTimeout(() => {
        if (typingElement) typingElement.style.transform = ''
      }, 100)

      // Если достигли максимума итераций, возвращаем исходный текст
      if (iterations >= maxIterations) {
        clearInterval(randomTextInterval)
        randomTextInterval = null

        // Возвращаем исходный текст
        setTimeout(() => {
          typingElement.textContent = originalText
          isTypingMode = true
        }, 300)
      }
    }, 400) // Меняем текст каждые 400ms
  }

  // Функция начала процесса (сразу с глюков)
  function startProcess() {
    if (!isTypingMode) return

    isTypingMode = false

    // Сразу запускаем генерацию случайных символов с ошибками
    startRandomSymbols()
  }

  // Функция сброса (возврат к исходному тексту)
  function resetToOriginal() {
    if (randomTextInterval) {
      clearInterval(randomTextInterval)
      randomTextInterval = null
    }

    typingElement.textContent = originalText
    isTypingMode = true
  }

  // Добавляем обработчик клика для активации
  if (typeTextContainer) {
    typeTextContainer.style.cursor = 'pointer'

    typeTextContainer.addEventListener('click', (e) => {
      e.stopPropagation()
      startProcess()
    })

    // Эффект при наведении
    typeTextContainer.addEventListener('mouseenter', () => {
      if (isTypingMode) {
        typeTextContainer.style.transform = 'scale(1.02)'
      }
    })

    typeTextContainer.addEventListener('mouseleave', () => {
      typeTextContainer.style.transform = ''
    })
  }

  // Добавляем возможность сброса по двойному клику
  if (typingElement) {
    typingElement.addEventListener('dblclick', (e) => {
      e.stopPropagation()
      resetToOriginal()
    })
  }

  // Устанавливаем стили
  if (typeTextContainer) {
    typeTextContainer.style.backgroundColor = '#fff'
    typeTextContainer.style.transition = 'transform 0.2s ease'
  }

  if (typingElement) {
    typingElement.style.color = '#000'
  }

  // Экспортируем API
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

  // Оборачиваем карточки, если ещё не обёрнуты
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
          // Совпадение — помечаем активными
          a.classList.add('active')
          b.classList.add('active')
          a.classList.remove('flipped')
          b.classList.remove('flipped')
          flipped = []
          locked = false
        } else {
          // Не совпало — переворачиваем обратно
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
;(function () {
  const labirinth = document.querySelector('.labirinth')
  const player = document.querySelector('.player')
  const walls = document.querySelector('.walls')
  const winletter = document.querySelector('.winletter')

  if (!labirinth || !player) return

  /* ── В начале скрываем winletter, показываем player и walls ── */
  if (winletter) {
    winletter.style.display = 'none'
  }
  if (walls) {
    walls.style.display = 'block'
  }
  if (player) {
    player.style.display = 'block'
  }

  /* ── Константы ─────────────────────────────────────────── */
  const SVG_W = 651
  const SVG_H = 653
  const STROKE_W = 13
  const WALLS_VW = 33.333
  const LAB_VW = 44.479
  const OFFSET_VW = (LAB_VW - WALLS_VW) / 2 // 5.573vw
  const PLAYER_VW = 2.656
  const PLAYER_SVG = (PLAYER_VW / WALLS_VW) * SVG_W // ~53 svg-единицы
  const SPEED = 3.5

  /* ── Координаты финиша (в vw) ──────────────────────────── */
  const FINISH_LEFT_VW = 28.6846
  const FINISH_TOP_VW = 5.57043

  /* ── Стартовая позиция игрока (в vw) ───────────────────── */
  const START_LEFT_VW = 5.62807
  const START_TOP_VW = 12.5075

  // Коэффициенты для пересчета SVG координат в vw
  const scaleX = WALLS_VW / SVG_W
  const scaleY = WALLS_VW / SVG_H

  // Переводим стартовые vw координаты в SVG координаты
  const START_PX = (START_LEFT_VW - OFFSET_VW) / scaleX
  const START_PY = (START_TOP_VW - OFFSET_VW) / scaleY

  /* ── Скрытый canvas для коллизии ───────────────────────── */
  const PATH =
    'M326.75 111.5H14C9.85786 111.5 6.5 108.142 6.5 104V14' +
    'C6.5 9.85787 9.85786 6.5 14 6.5H425C429.142 6.5 432.5 9.85786 432.5 14V216.5' +
    'M539.5 432.5V227C539.5 222.858 536.142 219.5 532 219.5H228' +
    'C223.858 219.5 220.5 222.858 220.5 227V425C220.5 429.142 223.858 432.5 228 432.5H327.834' +
    'M327.5 326.5H424C428.142 326.5 431.5 329.858 431.5 334V534.5' +
    'M538.667 114.209V16C538.667 11.8579 542.025 8.5 546.167 8.5H637' +
    'C641.142 8.5 644.5 11.8579 644.5 16V639C644.5 643.142 641.142 646.5 637 646.5H14' +
    'C9.85785 646.5 6.5 643.142 6.5 639V227.417C6.5 223.275 9.85786 219.917 14 219.917H116.836' +
    'M114.5 323.5V640.5' +
    'M539.5 537.5H114.5'

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

  /* ── Проверка пикселя ──────────────────────────────────── */
  function isWall(x, y) {
    x = Math.round(x)
    y = Math.round(y)
    if (x < 0 || y < 0 || x >= SVG_W || y >= SVG_H) return true
    return pixels[(y * SVG_W + x) * 4 + 3] > 80
  }

  function collidesWithWall(sx, sy) {
    const s = PLAYER_SVG
    const step = s / 5
    for (let x = sx; x <= sx + s; x += step)
      for (let y = sy; y <= sy + s; y += step) if (isWall(x, y)) return true
    return false
  }

  /* ── Проверка достижения финиша ────────────────────────── */
  function checkFinish(px, py) {
    // Получаем текущие координаты игрока в vw
    const playerLeft = px * scaleX + OFFSET_VW
    const playerTop = py * scaleY + OFFSET_VW

    // Вычисляем центр игрока
    const playerCenterX = playerLeft + PLAYER_VW / 2
    const playerCenterY = playerTop + PLAYER_VW / 2

    // Вычисляем расстояние до финиша
    const distance = Math.sqrt(
      Math.pow(playerCenterX - FINISH_LEFT_VW, 2) +
        Math.pow(playerCenterY - FINISH_TOP_VW, 2)
    )

    // Если расстояние меньше половины размера игрока, считаем что достиг финиша
    return distance < PLAYER_VW
  }

  /* ── Показ победного экрана ────────────────────────────── */
  let gameActive = true

  function showWin() {
    gameActive = false

    // Скрываем стены и игрока
    if (walls) walls.style.display = 'none'
    if (player) player.style.display = 'none'

    // Показываем winletter
    if (winletter) {
      winletter.style.display = 'block'
      winletter.style.position = 'absolute'
      winletter.style.top = '50%'
      winletter.style.left = '50%'
      winletter.style.transform = 'translate(-50%, -50%)'
      winletter.style.zIndex = '20'
    }
  }

  /* ── Позиция игрока (SVG-пространство) ─────────────────── */
  let px = START_PX
  let py = START_PY

  /* ── Клавиши ───────────────────────────────────────────── */
  const keys = {}

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
    if (['w', 'a', 's', 'd'].includes(k)) {
      keys[k] = false
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)

  /* ── Рендер ────────────────────────────────────────────── */
  function render() {
    player.style.left = px * scaleX + OFFSET_VW + 'vw'
    player.style.top = py * scaleY + OFFSET_VW + 'vw'
  }

  /* ── Игровой цикл ──────────────────────────────────────── */
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

    // Проверка достижения финиша
    if (checkFinish(px, py)) {
      showWin()
      return
    }

    animationId = requestAnimationFrame(loop)
  }

  render()
  animationId = requestAnimationFrame(loop)
})()
