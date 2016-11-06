var myApp = angular.module('myApp',[]);

myApp.controller('DoubleController', ['$scope', function($scope) {
  // global declaration
  $scope.data = {};
  $scope.data.location = "Mumbai"
  var unit_Solar_System_Cost = 75000, downpayment = 0; // Rs. 75,000 per kW
  var interest_Rate = 11 // Interest Rate = 11%
  var ENUM = { // Electricity Tariff structure: Bangalore: Rs5/unit, Mumbai: Rs 7/unit, Pune: Rs 9/unit
    Mumbai : 7, 
    Pune: 9, 
    Bangalore : 5
  };
  $scope.link = "https://cdn4.iconfinder.com/data/icons/miu/24/circle-info-more-information-detail-outline-stroke-128.png"

  // helper methods
  var getMinvalue = function(val1,val2) {
  	return (val1<val2 ? val1  : val2);
  }
  var getMaxvalue = function(val1,val2) {
  	return (val1>val2 ? val1 :val2);
  }

	$scope.$watchCollection('data', function() {
	  if($scope.data.roofSize && $scope.data.unitConsumed) {
  	   $scope.data.solarSystemSize = getMinvalue($scope.data.unitConsumed/120 , $scope.data.roofSize/100 );
  	   $scope.data.solarUnitProduced = $scope.data.solarSystemSize * 4 * 30;
  	   $scope.data.solarSystemCost  = unit_Solar_System_Cost * $scope.data.solarSystemSize;
	  }
	  else {
	    $scope.data.solarSystemSize = $scope.data.solarUnitProduced = $scope.data.solarSystemCost = undefined;
	  }
	  if($scope.data.solarSystemSize && $scope.data.loanTenure && $scope.data.loanAmount){
  	   $scope.data.EMI = (($scope.data.loanAmount * interest_Rate * $scope.data.loanTenure)/100 + Number($scope.data.loanAmount))/(Number($scope.data.loanTenure)*12);
  	   downpayent = Number($scope.data.solarSystemCost) - Number($scope.data.loanAmount);
  	   $scope.showgraph = Number($scope.data.loanAmount) <= (0.85*$scope.data.solarSystemCost) ? true : false
	  } 
	  else {
	     $scope.data.EMI = $scope.showgraph = undefined;
	  }
    getDataForGraph();
	})
	
	var getDataForGraph = function(){
	  // data for garph
	  var currentElectrictyBill = $scope.data.unitConsumed * ENUM[$scope.data.location];
	  var reducedUnits =  getMaxvalue(($scope.data.unitConsumed-$scope.data.solarUnitProduced) , 0);
	  var reducedElectrictyBill  = reducedUnits * ENUM[$scope.data.location];
	  $scope.monthlySavings = currentElectrictyBill - reducedElectrictyBill - $scope.data.EMI
    if($scope.showgraph && currentElectrictyBill && $scope.data.solarSystemCost && $scope.data.EMI){
      var x=[0], data1=[0], data2=[$scope.data.solarSystemCost], data3=[downpayent];
      for(var i = 1;i<=10;i++) {
        data1.push(data1[i-1] + (currentElectrictyBill  * 12));
        data2.push(data2[i-1] + (reducedElectrictyBill  * 12));
        if(i === Number($scope.data.loanTenure)){
          x.push("Loan Paid off")
        }
        else {
          x.push(i);
        }
        if(i <= Number($scope.data.loanTenure)){
          data3.push(data3[i-1] + (reducedElectrictyBill + $scope.data.EMI)*12)
        }
        else {
          data3.push(data3[i-1] + reducedElectrictyBill * 12)
        }
      }
      draw(x,data1,data2,data3);
    }
	}
	
  var draw = function(x,data1,data2,data3){
    Highcharts.chart('container', {
        xAxis: {
            categories: x,
            title: { text: 'Time (years)' }
        },
        title: {
            text: 'Cash Outflow Graph'
        },
        yAxis: { title: { text: 'Cash outflow on electricity (Rs)' } },
        series: [{
            name: 'No solar,Normal electricity bills',
            data: data1,
            color: '#ff0000'
        },
        {     
            name: 'With Solar, no loan',
            data: data2,
            color: '#0000ff'
        },
        {
            name: 'With Solar and Oorjan loan',
            data: data3,
            color: '#00ff00'
        }]
    });
  }
}]);




