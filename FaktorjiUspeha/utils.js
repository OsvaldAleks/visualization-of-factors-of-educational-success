/*dataset columns
   "Hours_Studied"
   "Attendance"
   "Parental_Involvement"
   "Access_to_Resources"
   "Extracurricular_Activities"
   "Sleep_Hours"
   "Previous_Scores"
   "Motivation_Level"
   "Internet_Access"
   "Tutoring_Sessions"
   "Family_Income"
   "Teacher_Quality"
   "School_Type"
   "Peer_Influence"
   "Physical_Activity"
   "Learning_Disabilities"
   "Parental_Education_Level"
   "Distance_from_Home"
   "Gender"
   "Exam_Score"
*/

//creates an array with a defined start stop and step
const arrayRange = (start, stop, step) =>
    Array.from( { length: (stop - start) / step + 1 }, (value, index) => start + index * step);

function extendArrayWithZeros(arr, n) {
  while (arr.length <= n) {
    arr.push(0); // Add zero to the end of the array
  }
  return arr;
}

//genetates histogram from array of values
function arrayToHist(array, min, max, valueMap = undefined, step = 1) {
  let binCount = Math.ceil((max - min+1) / step);
  let hist = new Array(binCount).fill(0);
  
  for (let i = 0; i < array.length; i++) {
    let value = array[i];
    if (valueMap !== undefined) {
      value = valueMap[value];
    }
    
    if (value >= min && value <= max) {
      let binIndex = Math.round((value - min  + Math.floor((step/2))) / step)
      if (binIndex < hist.length) {
        hist[binIndex]++;
      }

    }
  }
  for (let i = 0; i < hist.length; i++) {
    hist[i] /= array.length;
  }

  return hist;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getKeyByValue(obj, value) {
  return Object.keys(obj).find(key => obj[key] === value);
}

function snapToNearest(value, range) {
  return range.reduce((prev, curr) => {
    return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
  });
}

function createTableWithSameColumns(sourceTable) {
  let newTable = new p5.Table();
  let columns = sourceTable.columns;
  for (let i = 0; i < columns.length; i++) {
    newTable.addColumn(columns[i]);
  }
  
  return newTable;
}

function writeText(content, text_style, posX=0, posY=0, angle = 0) {
  if(text_style.border == undefined){
    strokeWeight(0);}
  else{
    strokeWeight(text_style.border);}
  if(text_style.borderColor != undefined){
    stroke(text_style.borderColor)}
  else{
    stroke(1)}
  fill(text_style.color);
  textSize(text_style.fontSize);
  if(text_style.weight != undefined){
    textStyle(text_style.weight)
  }
  else{
    textStyle(NORMAL)
  }
  let alignY = text_style.alignY
  if(alignY == undefined)
    alignY = TOP
  textAlign(CENTER, alignY);
  if(text_style.align != undefined)
    textAlign(text_style.align, alignY);
    
  push();
  translate(posX, posY+text_style.yOffset);
  rotate(angle);
  text(content, 0, 0);
  pop();
}
