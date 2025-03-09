TITLE = "VPLIV FAKTORJEV NA ŠOLSKI USPEH"

function preload() {
  data = loadTable('StudentPerformanceFactors.csv', 'csv', 'header');
  filteredData = structuredClone(data)
  reffDataset = data;
  mainStep = 1;
  style = new Style();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  describe(
    'Vpliv faktorjev na uspeh učencev'
    );
    
  resultsVals = arrayToHist(data.getColumn('Exam_Score'), 50, 100, undefined, mainStep);
  resultsInterpolators =  new Integrator(resultsVals);
  resultsReffInterpolators =  new Integrator(resultsVals);

  resultsGraph = new Hist(resultsVals, arrayRange(50,100,1), "USPEH", style, xLabel = 'Doseženo število točk', yLabel = 'Delež učencev');
  
  sleepTimeVals = arrayToHist(data.getColumn('Sleep_Hours'), 4, 10);
  sleepTimeInterpolators = new Integrator(sleepTimeVals);
  sleepTimeReffInterpolators = new Integrator(sleepTimeVals);
  sleepTimeHist = new Hist(sleepTimeVals, arrayRange(4,10,1), "Čas spanja", style, xLabel = 'Čas v urah', yLabel = 'Delež učencev');
  
  SchoolValueMap = {'High School': 0, 'College': 1, 'Postgraduate': 2};
  SchoolLabelMap = {0: 'Srednja šola', 1: 'Diploma', 2: 'Podiplomska'};
  parentalEducationVals = arrayToHist(data.getColumn('Parental_Education_Level'), 0, 2, SchoolValueMap);
  parentalEducationInterpolators = new Integrator(parentalEducationVals);
  parentalEducationReffInterpolators = new Integrator(parentalEducationVals);
  parentalEducationBubbles = new Bubbles(parentalEducationVals, arrayRange(0,2,1), 'Stopnja izobrazbe staršev', style, SchoolValueMap, SchoolLabelMap);
  
  internetValueMap = {'No': 0, 'Yes':1};
  internetLabelMap = {0: 'Ne', 1: 'Da'};
  internetAccessVals = arrayToHist(data.getColumn('Internet_Access'), 0, 1, internetValueMap);
  internetAccessInterpolators = new Integrator(internetAccessVals);
  internetAccessReffInterpolators = new Integrator(internetAccessVals);
  internetAccessBubbles = new Bubbles(internetAccessVals, arrayRange(0,1,1), 'Dostop do interneta', style, internetValueMap, internetLabelMap);
  
  resourceValueMap = {'Low': 0, 'Medium': 1, 'High': 2};
  resourceLabelMap = {0: 'Nizek', 1: 'Srednji', 2: 'Visok'};
  resourceAccessVals = arrayToHist(data.getColumn('Access_to_Resources'), 0, 2, resourceValueMap);
  resourceAccessInterpolators = new Integrator(resourceAccessVals);
  resourceAccessReffInterpolators = new Integrator(resourceAccessVals);
  resourceBubbles = new Bubbles(resourceAccessVals, arrayRange(0,2,1), 'Dostop do sredstev', style, resourceValueMap, resourceLabelMap);
  
  window.addEventListener('mousedown', function() {
    mouseIsDown = true;
  });
  window.addEventListener('mouseup', function() {
    mouseIsDown = false;
  });
  window.addEventListener('click', function(){
    parentalEducationBubbles.checkOnClick();
    internetAccessBubbles.checkOnClick();
    resourceBubbles.checkOnClick();
    //checkButtonsClick();
    filterData();
  });
  window.addEventListener('wheel', function(event) {
    resultsGraph.checkOnScroll(event.deltaY/(120*50))
    sleepTimeHist.checkOnScroll(event.deltaY/(120*50))
    filterData()
  });
  mouseIn = false

  rowCount = (data.getRowCount()-1)+"/"+(data.getRowCount()-1)
  frameRate(60);
  windowResized();
  filterData();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  this.style.upadteTitleSize(TITLE);
  
  marginW = windowWidth / 50;
  marginH = windowHeight / 40;

  titlePos = [marginW, style.titleSize + marginH / 2];
  countPos = [windowWidth - marginW, style.titleSize + marginH / 2];

  let startX = marginW + 65;
  let endX = windowWidth - marginW;
  let startY = marginH + style.getTitle().fontSize + marginH;
  let endY = startY + (windowHeight / 8);

  line1Pos = startY - style.annotationSize - (2 * marginH / 3);
  line2Pos = endY + style.annotationSize + 1.5*marginH;

  let bins = [];
  let vals = [];

  switch (true) {
    case (windowWidth < 600): 
      mainStep = 5; break;
    case (windowWidth < 1100):
      mainStep = 2; break;
    default:
      mainStep = 1;
  }

  // Recalculate values based on window size
  valsReff = extendArrayWithZeros(arrayToHist(reffDataset.getColumn('Exam_Score'), 50, 100, undefined, step = mainStep), 50);
  resultsGraph.valuesReff = valsReff;
  resultsGraph.setScale(startX, startY, endX, endY, arrayRange(50, 100, mainStep));

  let remainingSpace = ((windowHeight - line2Pos) - 2 * marginH) - windowHeight / 10;

  startY = line2Pos + 2 * marginH;
  endY = startY + (remainingSpace / 2) - 3 * marginH;

  startX = marginW;
  endX = startX + (2 * windowWidth / 3) - 3 * marginW;
  parentalEducationBubbles.setScale(startX, startY, endX, endY);

  startX = endX + (marginW) + 50;
  endX = windowWidth - marginW;
  sleepTimeHist.setScale(startX, startY, endX, endY, arrayRange(4, 10, 1));

  startY = endY + 3 * marginH;
  endY = startY + (remainingSpace / 2) - 2 * marginH;

  startX = marginW;
  endX = 2 * windowWidth / 5 - marginW / 2;
  internetAccessBubbles.setScale(startX, startY, endX, endY);

  startX = endX + (marginW);
  endX = windowWidth - marginW;
  resourceBubbles.setScale(startX, startY, endX, endY);

  line3Pos = endY + style.annotationSize + 2*marginH;
  remainingSpace = ((windowHeight - line3Pos) - 2 * marginH) - windowHeight / 10;
  startY = line3Pos + marginH;
  endY = windowHeight - marginH;
  
  startX = marginW;
  endX = windowWidth / 2 - marginW / 2;
  //button1Pos = [startX, startY, endX - startX, endY - startY];

  startX = endX + (marginW);
  endX = windowWidth - marginW;
  //button2Pos = [startX, startY, endX - startX, endY - startY];

  // Call filterData with 'true' to reset filtered values after resizing
  filterData(true);
}

let mouseIsDown = false;

function draw(){
  background(style.backgroundColor);
  fill(style.blockColor)
  rect(0, 0, windowWidth, line1Pos)
  writeText(TITLE, style.getTitle(), titlePos[0], titlePos[1]);
  writeText(rowCount, style.getNumberOfDatapoints(), countPos[0], countPos[1]);
  stroke(style.blockColor)
  fill(style.blockColor)
  rect(0, windowHeight-70, windowWidth, 70)
  writeText('LEGENDA:', this.style.getBlockTitle(yOff = marginH/2), marginW, windowHeight-70)
  fill(style.dataColor)
  rect(marginW, windowHeight-25, 45, 10)
  fill(style.backgroundColor)
  rect(marginW, windowHeight-35, 45, 10)
  writeText("Manjši delež kot med vsemi primeri", this.style.getAnnotation(weight = NORMAL, textColor = 'no', align = LEFT), marginW+50, windowHeight-37)
  
  fill(style.dataColor)
  rect(marginW+300, windowHeight-25, 45, 10)
  drawGradient2(marginW+300, windowHeight-35, 45, 10, style.red, style.green);
  writeText("Večji delež kot med vsemi primeri", this.style.getAnnotation(weight = NORMAL, textColor = 'no', align = LEFT), marginW+350, windowHeight-37)
  
  writeText("Slaba lastnost", this.style.getAnnotation(weight = NORMAL, textColor = 'no', align = RIGHT), windowWidth-marginW-205, windowHeight-37)
  drawGradient2(windowWidth-marginW-200, windowHeight-35, 100, 20, style.red, style.green);
  writeText("Dobra lastnost", this.style.getAnnotation(weight = NORMAL, textColor = 'no', align = RIGHT), windowWidth-marginW, windowHeight-37)

  stroke(style.blockColor)
  strokeWeight(3)
  line(0, line2Pos, windowWidth, line2Pos)
  
  
  if(resultsInterpolators.update()){
    resultsGraph.updateValues(resultsInterpolators.values)
  }
  if(resultsReffInterpolators.update()){
    resultsGraph.valuesReff = resultsReffInterpolators.values
  }
  resultsGraph.drawHist();

  if(parentalEducationInterpolators.update()){
    parentalEducationBubbles.updateValues(parentalEducationInterpolators.values)
  }
  if(parentalEducationReffInterpolators.update()){
    parentalEducationBubbles.valuesReff = parentalEducationReffInterpolators.values
  }
  parentalEducationBubbles.drawBubbles();

  if(sleepTimeInterpolators.update())
    sleepTimeHist.updateValues(sleepTimeInterpolators.values)
  if(sleepTimeReffInterpolators.update())
    sleepTimeHist.valuesReff = sleepTimeReffInterpolators.values
  sleepTimeHist.drawHist();
  
  if(internetAccessInterpolators.update())
    internetAccessBubbles.updateValues(internetAccessInterpolators.values)
  if(internetAccessReffInterpolators.update())
    internetAccessBubbles.valuesReff = internetAccessReffInterpolators.values

  internetAccessBubbles.drawBubbles();
  
  if(resourceAccessInterpolators.update())
    resourceBubbles.updateValues(resourceAccessInterpolators.values)
  if(resourceAccessReffInterpolators.update())
    resourceBubbles.valuesReff = resourceAccessReffInterpolators.values

  resourceBubbles.drawBubbles();
  
  /*
  fill(this.style.blockColor)
  rect(button1Pos[0], button1Pos[1], button1Pos[2], button1Pos[3])
  rect(button2Pos[0], button2Pos[1], button2Pos[2], button2Pos[3])
  writeText('Nastavi kot referenco', this.style.getButton(), button1Pos[0]+button1Pos[2]/2, button1Pos[1]+button1Pos[3]/2)
  writeText('Ponastavi referenco', this.style.getButton(), button2Pos[0]+button2Pos[2]/2, button2Pos[1]+button2Pos[3]/2)
  checkButtonsHover()
  */
  
  if(mouseIsDown){
    resultsGraph.checkOnClick();
    sleepTimeHist.checkOnClick();
    filterData();
  }
}

function drawGradient(x, y, w, h, c1, c2) {
  for (let i = 1; i <= h-1; i++) {
    let cFrom = hue(c1)
    let cTo =hue(color(c2))
    let hueDiff = (cTo - cFrom + 360) % 360;  
    if (hueDiff > 180) {
      hueDiff -= 360;
    }
    let c = cFrom + map(i, 1, h-1, 0, hueDiff);
    c = (c + 360) % 360;
    colorMode(HSL)
    stroke(color(c%360, saturation(this.style.green), lightness(this.style.green)));
    strokeWeight(1);
    line(x, y + i, x + w, y + i); // Draw a horizontal line to simulate the gradient
  }
}

function drawGradient2(x, y, w, h, c1, c2) {
  for (let i = 1; i <= w-1; i++) {
    let cFrom = hue(c1)
    let cTo =hue(color(c2))
    let hueDiff = (cTo - cFrom + 360) % 360;  
    if (hueDiff > 180) {
      hueDiff -= 360;
    }
    let c = cFrom + map(i, 1, w-1, 0, hueDiff);
    c = (c + 360) % 360;
    colorMode(HSL)
    stroke(color(c%360, saturation(this.style.green), lightness(this.style.green)));
    strokeWeight(2);
    line(x+i, y, x + i, y+h); // Draw a horizontal line to simulate the gradient
  }
}


function checkButtonsHover(){
    if (button1Pos[0]<mouseX && mouseX<button1Pos[0]+button1Pos[2] && button1Pos[1]<mouseY && mouseY<button1Pos[1]+button1Pos[3]){ 
      fill(this.style.hoverColor);
      rect(button1Pos[0], button1Pos[1], button1Pos[2], button1Pos[3])
      cursor(HAND);
      mouseIn = true;
    }
    else if (button2Pos[0]<mouseX && mouseX<button2Pos[0]+button2Pos[2] && button2Pos[1]<mouseY && mouseY<button2Pos[1]+button2Pos[3]){ 
      fill(this.style.hoverColor);
      rect(button2Pos[0], button2Pos[1], button2Pos[2], button2Pos[3])
      cursor(HAND);
      mouseIn = true;
    }
    else if(mouseIn && !resultsGraph.mouseIn && !parentalEducationBubbles.mouseIn && !sleepTimeHist.mouseIn && !resourceBubbles.mouseIn){
      mouseIn = false
      cursor(ARROW);
    }
}
function checkButtonsClick(){
    if (button1Pos[0]<mouseX && mouseX<button1Pos[0]+button1Pos[2] && button1Pos[1]<mouseY && mouseY<button1Pos[1]+button1Pos[3]){
      reffDataset = filteredData;
      resultsReffInterpolators.target(structuredClone(resultsGraph.values))
      sleepTimeReffInterpolators.target(structuredClone(sleepTimeHist.values))
      parentalEducationReffInterpolators.target(structuredClone(parentalEducationBubbles.values))
      internetAccessReffInterpolators.target(structuredClone(internetAccessBubbles.values))
      resourceAccessReffInterpolators.target(structuredClone(resourceBubbles.values))
    }
    else if (button2Pos[0]<mouseX && mouseX<button2Pos[0]+button2Pos[2] && button2Pos[1]<mouseY && mouseY<button2Pos[1]+button2Pos[3]){ 
      reffDataset = data;
      resultsReffInterpolators.target(arrayToHist(reffDataset.getColumn('Exam_Score'), 50, 100, undefined, mainStep))
      sleepTimeReffInterpolators.target(arrayToHist(reffDataset.getColumn('Sleep_Hours'), 4, 10))
      parentalEducationReffInterpolators.target(arrayToHist(reffDataset.getColumn('Parental_Education_Level'), 0, 2, SchoolValueMap))
      internetAccessReffInterpolators.target(arrayToHist(reffDataset.getColumn('Internet_Access'), 0, 1, internetValueMap))
      resourceAccessReffInterpolators.target(arrayToHist(reffDataset.getColumn('Access_to_Resources'), 0, 2, resourceValueMap))
    }
}            
