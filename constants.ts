
import { PlanetData } from './types';

export const PLANETS: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Меркурий',
    color: '#A5A5A5',
    radius: 0.4,
    distance: 12,
    orbitSpeed: 0.047,
    rotationSpeed: 0.004,
    description: 'Самая маленькая планета в Солнечной системе и ближайшая к Солнцу.',
    facts: ['Орбита: 88 земных дней', 'Температура: от -173°C до 427°C', 'Нет спутников'],
    telemetry: {
      mass: '3.285 × 10^23 кг',
      gravity: '3.7 м/с²',
      dayLength: '58д 15ч',
      tempRange: '-173°C / +427°C',
      orbitalVelocity: '47.4 км/с'
    },
    verifiedFacts: [
      {
        title: 'Железное ядро',
        description: 'Ядро Меркурия составляет около 85% его радиуса, что делает его самой "железной" планетой.',
        source: { text: 'NASA Solar System Exploration', url: 'https://science.nasa.gov/mercury/' }
      }
    ]
  },
  {
    id: 'venus',
    name: 'Венера',
    color: '#E3BB76',
    radius: 0.9,
    distance: 18,
    orbitSpeed: 0.035,
    rotationSpeed: 0.002,
    description: 'Часто называемая сестрой Земли, но с плотной токсичной атмосферой.',
    facts: ['Самая горячая планета', 'Вращается в обратную сторону', 'Атмосфера: 96% CO2'],
    telemetry: {
      mass: '4.867 × 10^24 кг',
      gravity: '8.87 м/с²',
      dayLength: '116д 18ч',
      tempRange: '462°C (пост.)',
      orbitalVelocity: '35.0 км/с'
    },
    verifiedFacts: [
      {
        title: 'Кислотные дожди',
        description: 'Облака Венеры состоят из серной кислоты, но она испаряется, не достигая поверхности.',
        source: { text: 'ESA - Venus Express', url: 'https://www.esa.int/Science_Exploration/Space_Science/Venus_Express' }
      }
    ]
  },
  {
    id: 'earth',
    name: 'Земля',
    color: '#2271B3',
    radius: 1,
    distance: 25,
    orbitSpeed: 0.029,
    rotationSpeed: 0.01,
    description: 'Наш дом, единственная известная планета, где есть жизнь.',
    facts: ['71% поверхности — вода', 'Один спутник (Луна)', 'Богатая кислородом атмосфера'],
    telemetry: {
      mass: '5.972 × 10^24 кг',
      gravity: '9.81 м/с²',
      dayLength: '24ч',
      tempRange: '-89°C / +58°C',
      orbitalVelocity: '29.8 км/с'
    },
    moons: [
      { 
        id: 'moon', 
        name: 'Луна', 
        radius: 0.27, 
        distance: 2.2, 
        orbitSpeed: 0.05, 
        color: '#D6D6D6',
        telemetry: { gravity: '1.62 м/с²', orbitalVelocity: '1.02 км/с' }
      }
    ],
    verifiedFacts: [
      {
        title: 'Уникальная тектоника',
        description: 'Земля — единственная планета с активной тектоникой плит, перерабатывающей углерод.',
        source: { text: 'National Geographic', url: 'https://www.nationalgeographic.com/science/article/earth' }
      }
    ]
  },
  {
    id: 'mars',
    name: 'Марс',
    color: '#E27B58',
    radius: 0.5,
    distance: 32,
    orbitSpeed: 0.024,
    rotationSpeed: 0.009,
    description: 'Красная планета, дом для самого высокого вулкана в Солнечной системе.',
    facts: ['Вулкан Олимп', 'Два спутника: Фобос и Деймос', 'Тонкая атмосфера'],
    telemetry: {
      mass: '6.39 × 10^23 кг',
      gravity: '3.71 м/с²',
      dayLength: '24ч 37м',
      tempRange: '-153°C / +20°C',
      orbitalVelocity: '24.1 км/с'
    },
    moons: [
      { id: 'phobos', name: 'Фобос', radius: 0.1, distance: 1.2, orbitSpeed: 0.08, color: '#91796F', telemetry: { gravity: '0.0057 м/с²' } },
      { id: 'deimos', name: 'Деймос', radius: 0.08, distance: 1.8, orbitSpeed: 0.06, color: '#A3928B', telemetry: { gravity: '0.003 м/с²' } }
    ],
    verifiedFacts: [
      {
        title: 'Голубые закаты',
        description: 'Пыль в атмосфере Марса рассеивает свет так, что закаты кажутся голубыми.',
        source: { text: 'NASA Mars News', url: 'https://mars.nasa.gov/news/8438/nasas-insight-captures-sunrise-and-sunset-on-mars/' }
      }
    ]
  },
  {
    id: 'jupiter',
    name: 'Юпитер',
    color: '#D39C7E',
    radius: 2.5,
    distance: 45,
    orbitSpeed: 0.013,
    rotationSpeed: 0.04,
    description: 'Массивный газовый гигант, в два раза тяжелее всех остальных планет вместе взятых.',
    facts: ['Большое Красное Пятно', '95 спутников', 'Самый короткий день: 10 часов'],
    telemetry: {
      mass: '1.898 × 10^27 кг',
      gravity: '24.79 м/с²',
      dayLength: '9ч 56м',
      tempRange: '-145°C (облака)',
      orbitalVelocity: '13.1 км/с'
    },
    moons: [
      { id: 'io', name: 'Ио', radius: 0.18, distance: 3.5, orbitSpeed: 0.045, color: '#EBE23F', telemetry: { gravity: '1.79 м/с²' } },
      { id: 'europa', name: 'Европа', radius: 0.16, distance: 4.5, orbitSpeed: 0.038, color: '#C9BEA2', telemetry: { gravity: '1.31 м/с²' } }
    ],
    verifiedFacts: [
      {
        title: 'Радиационный щит',
        description: 'Магнитное поле Юпитера в 20 000 раз сильнее земного, защищая систему от солнечного ветра.',
        source: { text: 'NASA Juno Mission', url: 'https://www.nasa.gov/mission_pages/juno/main/index.html' }
      }
    ]
  },
  {
    id: 'saturn',
    name: 'Сатурн',
    color: '#C5AB6E',
    radius: 2.1,
    distance: 65,
    orbitSpeed: 0.009,
    rotationSpeed: 0.038,
    hasRings: true,
    description: 'Знаменит своей сложной и красивой системой колец.',
    facts: ['Кольца из льда и камня', '146 спутников', 'Плотность меньше воды'],
    telemetry: {
      mass: '5.683 × 10^26 кг',
      gravity: '10.44 м/с²',
      dayLength: '10ч 42м',
      tempRange: '-178°C (облака)',
      orbitalVelocity: '9.7 км/с'
    },
    moons: [
      { id: 'titan', name: 'Титан', radius: 0.24, distance: 5.5, orbitSpeed: 0.025, color: '#D4A017', telemetry: { gravity: '1.35 м/с²' } }
    ],
    verifiedFacts: [
      {
        title: 'Шестиугольный шторм',
        description: 'На северном полюсе Сатурна бушует вечный шторм идеальной шестиугольной формы.',
        source: { text: 'Cassini-Huygens Legacy', url: 'https://science.nasa.gov/mission/cassini/' }
      }
    ]
  },
  {
    id: 'uranus',
    name: 'Уран',
    color: '#B5E3E3',
    radius: 1.5,
    distance: 82,
    orbitSpeed: 0.006,
    rotationSpeed: 0.03,
    description: 'Ледяной гигант с уникальным наклоном, из-за которого он вращается на боку.',
    facts: ['Вращается на боку', 'Самая холодная атмосфера', '27 спутников'],
    telemetry: {
      mass: '8.681 × 10^25 кг',
      gravity: '8.69 м/с²',
      dayLength: '17ч 14м',
      tempRange: '-224°C (облака)',
      orbitalVelocity: '6.8 км/с'
    },
    verifiedFacts: [
      {
        title: 'Алмазные дожди',
        description: 'Давление в недрах Урана настолько велико, что углерод может сжиматься в алмазы.',
        source: { text: 'Space.com', url: 'https://www.space.com/uranus-neptune-diamond-rain-experiment.html' }
      }
    ]
  },
  {
    id: 'neptune',
    name: 'Нептун',
    color: '#4B70DD',
    radius: 1.5,
    distance: 95,
    orbitSpeed: 0.005,
    rotationSpeed: 0.032,
    description: 'Самая далекая планета от Солнца, темная, холодная и ветреная.',
    facts: ['Ветры до 2100 км/ч', '14 спутников', 'Назван в честь бога морей'],
    telemetry: {
      mass: '1.024 × 10^26 кг',
      gravity: '11.15 м/с²',
      dayLength: '16ч 6м',
      tempRange: '-214°C (облака)',
      orbitalVelocity: '5.4 км/с'
    },
    verifiedFacts: [
      {
        title: 'Сверхзвуковые ветры',
        description: 'Нептун обладает самыми быстрыми ветрами в Солнечной системе, дующими со скоростью 2000 км/ч.',
        source: { text: 'Britannica', url: 'https://www.britannica.com/place/Neptune-planet' }
      }
    ]
  }
];
