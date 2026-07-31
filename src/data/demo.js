const now = Date.now();

export const demoSignals = [
  { id:'signal-travel', title:'Ambient travel planner', description:'Маршрут как карта ощущений: шум, свет, плотность людей и темп дня вместо сухого списка точек.', category:'Product', stage:'growing', energy:86, confidence:72, nextAction:'Собрать кликабельный прототип карты одного дня в Лиссабоне', tags:['maps','travel','mobile'], createdAt:now-691200000, updatedAt:now-18000000 },
  { id:'signal-archaeology', title:'Component archaeology', description:'DevTool, который показывает историю UI-компонента: изменения API, поломки и устаревшие паттерны.', category:'DevTool', stage:'seed', energy:61, confidence:58, nextAction:'Спарсить git history одного компонента и построить timeline', tags:['git','dx','frontend'], createdAt:now-432000000, updatedAt:now-79200000 },
  { id:'signal-portfolio', title:'Portfolio as a living system', description:'Портфолио, где проекты растут вместе с навыками, заметками, экспериментами и публичным changelog.', category:'Creative', stage:'bloom', energy:94, confidence:88, nextAction:'Записать короткое демо и оформить публичный case study', tags:['portfolio','motion','storytelling'], createdAt:now-1036800000, updatedAt:now-7200000 },
  { id:'signal-layout', title:'Explain my layout', description:'Инструмент: вставляешь DOM/CSS, а он визуально объясняет, почему элемент оказался именно в этой точке.', category:'AI', stage:'growing', energy:77, confidence:64, nextAction:'Сделать playground с CSS Grid и подсветкой contributing rules', tags:['css','education','ai'], createdAt:now-345600000, updatedAt:now-36000000 },
  { id:'signal-cookbook', title:'Micro-interaction cookbook', description:'Коллекция UI-эффектов с живыми параметрами: easing, spring, blur, scale и accessibility-режимы.', category:'UI/UX', stage:'seed', energy:54, confidence:76, nextAction:'Собрать 8 паттернов и единый API параметров', tags:['motion','a11y','design-system'], createdAt:now-172800000, updatedAt:now-64800000 }
];

export const demoActivity = [
  { id:'activity-1', signalId:'signal-portfolio', signalTitle:'Portfolio as a living system', type:'moved', detail:'Переведено в Bloom', createdAt:now-7200000 },
  { id:'activity-2', signalId:'signal-travel', signalTitle:'Ambient travel planner', type:'boosted', detail:'Энергия поднята до 86%', createdAt:now-18000000 },
  { id:'activity-3', signalId:'signal-layout', signalTitle:'Explain my layout', type:'updated', detail:'Обновлён следующий шаг', createdAt:now-36000000 }
];
