function filterData(harsh){
  let start = Math.ceil(map(resultsGraph.rangeStart,0,1,50,100))
  let end = Math.floor(map(resultsGraph.rangeEnd,0,1,50,100))
  
  filteredData = filterTableByRange(data, 'Exam_Score', start, end);
  filteredData = filterTableByValue(filteredData, 'Parental_Education_Level', parentalEducationBubbles.selectedElement, SchoolValueMap)
  filteredData = filterTableByValue(filteredData, 'Internet_Access', internetAccessBubbles.selectedElement, internetValueMap) 
  filteredData = filterTableByValue(filteredData, 'Access_to_Resources', resourceBubbles.selectedElement, resourceValueMap)
  
  start = map(sleepTimeHist.rangeStart,0,1,4,10)
  end = map(sleepTimeHist.rangeEnd,0,1,4,10)
  filteredData = filterTableByRange(filteredData, 'Sleep_Hours', start, end);
  
  rowCount = filteredData.getRowCount()+"/"+(data.getRowCount()-1)
  
  if(filteredData.getRowCount()){
    let resultsVals = extendArrayWithZeros(arrayToHist(filteredData.getColumn('Exam_Score'), 50, 100, undefined, mainStep), 50);
    let sleepTimeVals = arrayToHist(filteredData.getColumn('Sleep_Hours'), 4, 10);
    let parentalEducationVals = arrayToHist(filteredData.getColumn('Parental_Education_Level'), 0, 2, SchoolValueMap);
    let internetAccessVals = arrayToHist(filteredData.getColumn('Internet_Access'), 0, 1, internetValueMap);
    let resourceVals = arrayToHist(filteredData.getColumn('Access_to_Resources'), 0, 2, resourceValueMap);
    if(harsh){
      resultsInterpolators.values = resultsVals;
      resultsGraph.values = resultsVals;
    }
    resultsInterpolators.target(resultsVals);
    sleepTimeInterpolators.target(sleepTimeVals);
    parentalEducationInterpolators.target(parentalEducationVals);
    internetAccessInterpolators.target(internetAccessVals);
    resourceAccessInterpolators.target(resourceVals);
  }
  else{
    resultsInterpolators.target(Array(resultsVals.length).fill(0));
    sleepTimeInterpolators.target(Array(sleepTimeVals.length).fill(0));
    parentalEducationInterpolators.target(Array(parentalEducationVals.length).fill(0));
    internetAccessInterpolators.target(Array(internetAccessVals.length).fill(0));
    resourceAccessInterpolators.target(Array(resourceAccessVals.length).fill(0));
  }
}

function filterTableByRange(table, filterColumn, minValue, maxValue) {
  let filtered = createTableWithSameColumns(table);

  for (let i = 0; i < table.getColumnCount(); i++) {
    filtered.addColumn(table.getColumn(i))
  }
  for (let i = 0; i < table.getRowCount(); i++) {
    let row = table.getRow(i);
    let filterValue = row.getNum(filterColumn);
    if (filterValue >= minValue && filterValue <= maxValue) {
      filtered.addRow(row);
    }
  }

  return filtered;
}

function filterTableByValue(table, filterColumn, value, valueMap){
  if(value == null)
    return table
  let filtered = createTableWithSameColumns(table);
  let rows = table.findRows(getKeyByValue(valueMap, value), filterColumn)
  for(let i=0; i<rows.length; i++){
    filtered.addRow(rows[i])
  }
  return filtered
}
