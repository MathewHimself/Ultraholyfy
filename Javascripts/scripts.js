/* RAIN ICONSLIDER */
// const slider = document.querySelector('.rainSlider')
// const btn = slider.querySelector('.rainButton')
// const items = slider.querySelectorAll('.rainIcon')

// function moveTo(item) {
//   const sRect = slider.getBoundingClientRect()
//   const iRect = item.getBoundingClientRect()
//   const offset = iRect.left - sRect.left + iRect.width / 2 - btn.offsetWidth / 2
//   btn.style.transform = `translateY(-50%) translateX(${offset}px)`
// }

// items.forEach((icon) => {
//   icon.addEventListener('click', () => moveTo(icon))
// })
/* УРОВНИ ПОДПИСКИ */
const levelData = {
  1: { happiness: 40, income: 35, health: 45, luck: 30, wellbeing: 40 },
  2: { happiness: 55, income: 50, health: 60, luck: 45, wellbeing: 55 },
  3: { happiness: 70, income: 65, health: 75, luck: 60, wellbeing: 70 },
  4: { happiness: 85, income: 80, health: 85, luck: 75, wellbeing: 85 },
  5: { happiness: 100, income: 95, health: 100, luck: 90, wellbeing: 100 }
}

// МАКСИМАЛЬНАЯ ВЫСОТА СТОЛБЦА В vw (100% = 15vw)
// Выбрано значение 15vw, так как контейнер .inlineContainer имеет высоту ~27.917vw,
// а верхняя часть .infUp занимает ~6.667vw + gap 2.448vw = ~9.115vw,
// остаётся ~18.8vw для столбцов. 15vw даёт запас и визуально приятные пропорции.
// При необходимости значение можно легко изменить — все пропорции сохранятся.
const MAX_BAR_HEIGHT_VW = 15

// Элементы столбцов и текстовых значений
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

// Обновление одного показателя: высота столбца в vw + текст процента
function updateMetric(metricName, percentValue) {
  const bar = barElements[metricName]
  const valueSpan = valueElements[metricName]
  if (!bar || !valueSpan) return

  let percent = Math.min(100, Math.max(0, percentValue))
  // формула: высота (vw) = (процент / 100) * MAX_BAR_HEIGHT_VW
  let heightInVw = (percent / 100) * MAX_BAR_HEIGHT_VW
  bar.style.height = `${heightInVw}vw`
  valueSpan.innerText = `${Math.round(percent)}%`
}

// Применить все значения выбранного уровня
function applyLevel(levelNumber) {
  const data = levelData[levelNumber]
  if (!data) return

  updateMetric('happiness', data.happiness)
  updateMetric('income', data.income)
  updateMetric('health', data.health)
  updateMetric('luck', data.luck)
  updateMetric('wellbeing', data.wellbeing)
}

// ----- УПРАВЛЕНИЕ КНОПКАМИ: белый фон активной + смена диаграммы -----
const buttons = document.querySelectorAll('.subscribitionLine .button')

function setActiveButton(activeBtn) {
  buttons.forEach((btn) => btn.classList.remove('active'))
  activeBtn.classList.add('active')
}

// Назначаем обработчики кликов
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

// --- Инициализация: устанавливаем уровень 3 (совпадает с исходными значениями 70/65/75/60/70) ---
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

// Дополнительная проверка после полной загрузки
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

// Подстраховка для динамических изменений
setTimeout(() => {
  const anyActive = document.querySelector('.subscribitionLine .button.active')
  if (!anyActive) {
    const lvl3 = document.querySelector('.button[data-level="3"]')
    if (lvl3) {
      applyLevel(3)
      setActiveButton(lvl3)
    }
  }
}, 100)

// Небольшой лог для отладки (можно удалить)
console.log(
  'Адаптивные столбцы: высота в vw, 100% = ' + MAX_BAR_HEIGHT_VW + 'vw'
)
/* РУЛЕТКА КАЗИНО */
document.addEventListener('DOMContentLoaded', () => {
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
})(function () {
  // ---------- АНИМАЦИЯ "ЗМЕЙКА" С ОТСКОКОМ ОТ ГРАНИЦ ----------
  const arena = document.getElementById('snakeArena')
  if (!arena) return

  // Параметры
  const CARD_WIDTH_PERC = 10.104 // vw единицы, но в пикселях будем считать относительно родителя
  const CARD_HEIGHT_PERC = 15.781

  // Получаем актуальные размеры арены в пикселях (будем пересчитывать при ресайзе)
  let arenaRect = arena.getBoundingClientRect()
  let cardWidth = 0,
    cardHeight = 0

  // Три карты (звена змейки)
  let cards = []

  // Скорости и позиции (в пикселях)
  let positions = [] // {x, y}
  let velocities = [] // {vx, vy}

  // Флаг анимации
  let animationId = null
  let lastTimestamp = 0

  // Параметры следования "змейкой": каждое звено стремится к позиции предыдущего
  // При этом первое звено движется автономно и отскакивает от стен.
  // Второе следует за первым с задержкой, третье за вторым — создаётся эффект "хвоста".
  let FOLLOW_DISTANCE = 35 // пикселей (дистанция с которой звенья следуют)
  let SMOOTH_FACTOR = 0.22 // плавность следования

  // Функция обновления размеров карт и пересчёта позиций при изменении окна
  function updateDimensions() {
    if (!arena) return
    arenaRect = arena.getBoundingClientRect()
    // ширина и высота карты относительно родителя в пикселях
    // используем проценты от ширины арены (как в оригинальном css)
    cardWidth = (CARD_WIDTH_PERC / 100) * arenaRect.width
    cardHeight = (CARD_HEIGHT_PERC / 100) * arenaRect.height

    // ограничим минимальные размеры
    cardWidth = Math.max(cardWidth, 60)
    cardHeight = Math.max(cardHeight, 90)

    // применяем размеры ко всем существующим картам
    cards.forEach((card) => {
      if (card) {
        card.style.width = `${cardWidth}px`
        card.style.height = `${cardHeight}px`
      }
    })

    // корректируем позиции, чтобы карты не вылетали за новые границы
    if (positions.length === 3) {
      for (let i = 0; i < positions.length; i++) {
        let p = positions[i]
        let maxX = arenaRect.width - cardWidth
        let maxY = arenaRect.height - cardHeight
        p.x = Math.min(maxX, Math.max(0, p.x))
        p.y = Math.min(maxY, Math.max(0, p.y))
        // также скорректируем, если карта застряла в стене после ресайза
        if (p.x < 0) p.x = 0
        if (p.y < 0) p.y = 0
        positions[i] = p
      }
      // синхронизируем отображение
      for (let i = 0; i < cards.length; i++) {
        if (cards[i]) {
          cards[i].style.left = `${positions[i].x}px`
          cards[i].style.top = `${positions[i].y}px`
        }
      }
    }
  }

  // Инициализация карт и случайных начальных позиций
  function initSnake() {
    // очищаем арену
    arena.innerHTML = ''
    cards = []

    // создаём 3 карты-звена
    for (let i = 0; i < 3; i++) {
      const card = document.createElement('div')
      card.className = 'snake-card'
      // добавим лёгкую нумерацию для визуального понимания порядка (опционально)
      const badge = document.createElement('span')
      badge.textContent = `${i + 1}`
      badge.style.position = 'absolute'
      badge.style.bottom = '8px'
      badge.style.right = '12px'
      badge.style.fontSize = '1.8vw'
      badge.style.fontWeight = 'bold'
      badge.style.color = 'white'
      badge.style.textShadow = '0 0 4px black'
      badge.style.fontFamily = 'monospace'
      card.appendChild(badge)
      arena.appendChild(card)
      cards.push(card)
    }

    // получаем актуальные размеры
    arenaRect = arena.getBoundingClientRect()
    cardWidth = (CARD_WIDTH_PERC / 100) * arenaRect.width
    cardHeight = (CARD_HEIGHT_PERC / 100) * arenaRect.height
    cardWidth = Math.max(cardWidth, 60)
    cardHeight = Math.max(cardHeight, 90)

    cards.forEach((c) => {
      c.style.width = `${cardWidth}px`
      c.style.height = `${cardHeight}px`
    })

    // начальные позиции (случайные, но чтобы полностью помещались)
    const maxX = arenaRect.width - cardWidth
    const maxY = arenaRect.height - cardHeight

    positions = []
    velocities = []

    // первая карта (голова) — случайная позиция и случайная скорость
    const startX = Math.random() * Math.max(20, maxX - 20) + 10
    const startY = Math.random() * Math.max(20, maxY - 20) + 10
    positions.push({ x: startX, y: startY })
    // скорость головы: от 1.2 до 2.8 пикселей за кадр (60fps -> ~70-170px/сек)
    const angle = Math.random() * Math.PI * 2
    const speed = 1.6 + Math.random() * 1.2
    velocities.push({
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed
    })

    // второе и третье звено: изначально немного позади головы
    // чтобы создать эффект хвоста
    const offsetX2 = -cardWidth * 0.7
    const offsetY2 = -cardHeight * 0.3
    positions.push({ x: startX + offsetX2, y: startY + offsetY2 })
    velocities.push({ vx: 0, vy: 0 }) // будут следовать за головой

    const offsetX3 = -cardWidth * 1.2
    const offsetY3 = -cardHeight * 0.6
    positions.push({ x: startX + offsetX3, y: startY + offsetY3 })
    velocities.push({ vx: 0, vy: 0 })

    // корректируем, чтобы не вылезали за границы
    for (let i = 0; i < positions.length; i++) {
      positions[i].x = Math.min(maxX, Math.max(0, positions[i].x))
      positions[i].y = Math.min(maxY, Math.max(0, positions[i].y))
    }

    // применяем позиции
    for (let i = 0; i < cards.length; i++) {
      cards[i].style.left = `${positions[i].x}px`
      cards[i].style.top = `${positions[i].y}px`
    }
  }

  // Функция отскока от границ (для головы)
  function applyBounce(headPos, headVel, arenaW, arenaH, cardW, cardH) {
    let { x, y } = headPos
    let { vx, vy } = headVel
    let bounced = false

    // левая / правая граница
    if (x <= 0) {
      x = 0
      vx = -vx
      bounced = true
    }
    if (x >= arenaW - cardW) {
      x = arenaW - cardW
      vx = -vx
      bounced = true
    }
    // верхняя / нижняя
    if (y <= 0) {
      y = 0
      vy = -vy
      bounced = true
    }
    if (y >= arenaH - cardH) {
      y = arenaH - cardH
      vy = -vy
      bounced = true
    }

    // небольшое случайное возмущение, чтобы избежать зацикленных траекторий
    if (bounced) {
      // добавляем микро-шум для разнообразия
      vx += (Math.random() - 0.5) * 0.12
      vy += (Math.random() - 0.5) * 0.12
      // нормализуем скорость, чтобы не слишком разгонялась
      const spd = Math.hypot(vx, vy)
      const maxSpd = 3.2
      if (spd > maxSpd) {
        vx = (vx / spd) * maxSpd
        vy = (vy / spd) * maxSpd
      }
      if (spd < 0.8) {
        vx = (vx / spd) * 0.9
        vy = (vy / spd) * 0.9
      }
    }

    return { x, y, vx, vy }
  }

  // Обновление позиций по принципу "змейка": каждое следующее звено стремится к позиции предыдущего
  function updateSnakePositions() {
    if (!arena || cards.length === 0) return

    const arenaW = arenaRect.width
    const arenaH = arenaRect.height
    const cardW = cardWidth
    const cardH = cardHeight

    if (arenaW === 0 || arenaH === 0) return

    // 1. Обновляем голову (индекс 0) с физикой и отскоком
    let headPos = positions[0]
    let headVel = velocities[0]

    // временное перемещение
    let newHeadX = headPos.x + headVel.vx
    let newHeadY = headPos.y + headVel.vy

    // применяем отскок от стен (границы арены)
    const bouncedResult = applyBounce(
      { x: newHeadX, y: newHeadY },
      { vx: headVel.vx, vy: headVel.vy },
      arenaW,
      arenaH,
      cardW,
      cardH
    )

    // обновляем голову
    positions[0] = { x: bouncedResult.x, y: bouncedResult.y }
    velocities[0] = { vx: bouncedResult.vx, vy: bouncedResult.vy }

    // 2. Хвостовая логика: каждое следующее звено следует за предыдущим с плавностью
    // создаём ощущение "змеи", где карты летят друг за другом, повторяя траекторию
    for (let i = 1; i < positions.length; i++) {
      const prevPos = positions[i - 1]
      const currentPos = positions[i]

      // вектор от текущего к цели (предыдущее звено)
      let dx = prevPos.x - currentPos.x
      let dy = prevPos.y - currentPos.y
      const distance = Math.hypot(dx, dy)

      // если дистанция больше желаемой FOLLOW_DISTANCE, тянемся к предыдущему
      if (distance > FOLLOW_DISTANCE) {
        const angleToTarget = Math.atan2(dy, dx)
        const move = (distance - FOLLOW_DISTANCE) * SMOOTH_FACTOR
        const moveX = Math.cos(angleToTarget) * move
        const moveY = Math.sin(angleToTarget) * move

        let newX = currentPos.x + moveX
        let newY = currentPos.y + moveY

        // дополнительно проверяем границы для хвостовых звеньев (отскок от стен, чтобы они не выходили)
        newX = Math.min(arenaW - cardW, Math.max(0, newX))
        newY = Math.min(arenaH - cardH, Math.max(0, newY))

        positions[i] = { x: newX, y: newY }
      } else {
        // если дистанция мала, добавляем небольшое случайное блуждание, чтобы змейка выглядела живее
        let randomJitter = 0.2
        let jitterX = (Math.random() - 0.5) * randomJitter
        let jitterY = (Math.random() - 0.5) * randomJitter
        let newX = currentPos.x + jitterX
        let newY = currentPos.y + jitterY
        newX = Math.min(arenaW - cardW, Math.max(0, newX))
        newY = Math.min(arenaH - cardH, Math.max(0, newY))
        positions[i] = { x: newX, y: newY }
      }
    }

    // применяем новые позиции к DOM-элементам
    for (let i = 0; i < cards.length; i++) {
      if (cards[i]) {
        cards[i].style.left = `${positions[i].x}px`
        cards[i].style.top = `${positions[i].y}px`
      }
    }
  }

  // Цикл анимации
  function animate() {
    if (!arena) return
    updateSnakePositions()
    animationId = requestAnimationFrame(animate)
  }

  // обработчик изменения размера окна: пересчитываем геометрию и корректируем позиции
  let resizeTimeout
  function handleResize() {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      if (!arena) return
      // сохраняем старые относительные координаты (проценты), чтобы после ресайза карты не убежали
      const oldRect = arenaRect
      const oldWidth = oldRect.width
      const oldHeight = oldRect.height
      if (oldWidth > 0 && oldHeight > 0 && positions.length === 3) {
        const savedRelative = positions.map((p) => ({
          rx: p.x / oldWidth,
          ry: p.y / oldHeight
        }))
        // обновляем размеры
        updateDimensions()
        const newRect = arena.getBoundingClientRect()
        const newW = newRect.width
        const newH = newRect.height
        // восстанавливаем позиции пропорционально
        for (let i = 0; i < positions.length; i++) {
          let newX = savedRelative[i].rx * newW
          let newY = savedRelative[i].ry * newH
          const maxX = newW - cardWidth
          const maxY = newH - cardHeight
          positions[i] = {
            x: Math.min(maxX, Math.max(0, newX)),
            y: Math.min(maxY, Math.max(0, newY))
          }
          if (cards[i]) {
            cards[i].style.left = `${positions[i].x}px`
            cards[i].style.top = `${positions[i].y}px`
          }
        }
      } else {
        updateDimensions()
      }
    }, 80)
  }

  // Запуск
  function start() {
    initSnake()
    // дополнительно синхронизируем размеры
    window.addEventListener('resize', handleResize)
    // запускаем анимацию
    if (animationId) cancelAnimationFrame(animationId)
    animationId = requestAnimationFrame(animate)
  }

  start()

  // добавим небольшую паузу для корректировки после полной загрузки изображений
  window.addEventListener('load', () => {
    setTimeout(() => {
      updateDimensions()
      // повторно корректируем позиции, чтобы карты не вылезали
      if (positions.length === 3 && cards.length) {
        const maxX = arenaRect.width - cardWidth
        const maxY = arenaRect.height - cardHeight
        for (let i = 0; i < positions.length; i++) {
          positions[i].x = Math.min(maxX, Math.max(0, positions[i].x))
          positions[i].y = Math.min(maxY, Math.max(0, positions[i].y))
          cards[i].style.left = `${positions[i].x}px`
          cards[i].style.top = `${positions[i].y}px`
        }
      }
    }, 100)
  })
})()
