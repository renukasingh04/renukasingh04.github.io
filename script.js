var myApp = angular.module('myApp',[]);

myApp.controller('DoubleController', ['$scope', function($scope) {
  $scope.data = {};
  $scope.data.location = "Mumbai"
  var unit_Solar_System_Cost = 75000, downpayment = 0; // Rs. 75,000 per kW
  var interest_Rate = 11 // Interest Rate = 11%
  var ENUM = { // Electricity Tariff structure: Bangalore: Rs5/unit, Mumbai: Rs 7/unit, Pune: Rs 9/unit
    Mumbai : 7, 
    Pune: 9, 
    Bangalore : 5
  };
  $scope.xe = {};
  
  var getMinvalue = function(val1,val2) {
  	return (val1<val2 ? val1  : val2);
  }
  
  var getMaxvalue = function(val1,val2) {
  	return (val1>val2 ? val1 :val2);
  }
  var data = {data1:[],data2:[],data3:[]}
  
	$scope.$watchCollection('data', function() {
	  if($scope.data.roofSize && $scope.data.unitConsumed) {
	   $scope.data.solarSystemSize = getMinvalue($scope.data.unitConsumed/120 , $scope.data.roofSize/100 );
	   $scope.data.solarUnitProduced = $scope.data.solarSystemSize * 4 * 30;
	   $scope.data.solarSystemCost  = unit_Solar_System_Cost * $scope.data.solarSystemSize;
	  }
	  if($scope.data.loanTenure && $scope.data.loanAmount){
	   $scope.data.EMI = (($scope.data.loanAmount * interest_Rate * $scope.data.loanTenure)/100 + Number($scope.data.loanAmount))/(Number($scope.data.loanTenure)*12);
	   downpayent = Number($scope.data.solarSystemCost) - Number($scope.data.loanAmount);
	   $scope.showgraph = Number($scope.data.loanAmount) <= (0.85*$scope.data.solarSystemCost) ? true : false
	  } 
	  $scope.xe.currentElectrictyBill = $scope.data.unitConsumed * ENUM[$scope.data.location];
	  $scope.xe.reducedUnits =  getMaxvalue(($scope.data.unitConsumed-$scope.data.solarUnitProduced) , 0);
	  $scope.xe.reducedElectrictyBill  = $scope.xe.reducedUnits * ENUM[$scope.data.location];
	  $scope.xe.monthlySavings = $scope.xe.currentElectrictyBill - $scope.xe.reducedElectrictyBill - $scope.data.EMI
    if($scope.showgraph && $scope.xe.currentElectrictyBill && $scope.data.solarSystemCost && $scope.data.EMI){
      data.data1=[0], data.data2=[$scope.data.solarSystemCost], data.data3=[downpayent];
      for(var i = 1;i<=10;i++) {
        data.data1.push(data.data1[i-1] + $scope.xe.currentElectrictyBill  * 12);
        data.data2.push(data.data2[i-1] + $scope.xe.reducedElectrictyBill  * 12);
        if(i <= Number($scope.data.loanTenure)){
          data.data3.push(data.data3[i-1] + ($scope.xe.reducedElectrictyBill + $scope.data.EMI)*12)
        }
        else {
          data.data3.push(data.data3[i-1] + $scope.xe.reducedElectrictyBill * 12)
        }
      }
      draw();
    }
	})
	
  var draw = function(){
    Highcharts.chart('container', {
        xAxis: {
            categories: [0,1,2,3,4,5,6,7,8,9,10],
            title: { text: 'Time (years)' }
        },
        title: {
            text: 'Cash Outflow Graph'
        },
        yAxis: { title: { text: 'Cash outflow on electricity (Rs)' } },
        series: [{
            name: 'No solar,Normal electricity bills',
            data: data.data1,
            color: '#ff0000'
        },
        {     
            name: 'With Solar, no loan',
            data: data.data2,
            color: '#0000ff'
        },
        {
            name: 'With Solar and Oorjan loan',
            data: data.data3,
            color: '#00ff00'
        }]
    });
  }
}]);



