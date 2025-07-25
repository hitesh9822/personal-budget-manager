var budgetController=(function(){
    
    var Expense = function(id,description,value){
        this.id=id;
        this.description=description;
        this.percentage=-1;
        this.value=value;
    };

    Expense.prototype.calcPercentage= function(totalIncome){
        if(totalIncome > 0){

            this.percentage = Math.round((this.value / totalIncome)*100);
        }else{
            this.percentage=-1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }
    
    var Income = function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };

    var calculateTotal= function(type){

        var sum=0;
        data.allItems[type].forEach(function(cur){
            sum+=cur.value;
        });
        data.totals[type] = sum;
    };

    var data={
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1

    };

    return {
        addItem:function(type,des,val){
          var newItem,ID;
          
          if(data.allItems[type].length > 0){

              ID=data.allItems[type][data.allItems[type].length-1].id+1;
          }else{
            ID=0;
          }

          if(type === 'exp'){

              newItem = new Expense(ID,des,val);
            }else if(type === 'inc'){
                newItem =new Income(ID,des,val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },


        deleteItem:function(type,id){
            var ids,index;
            // data.allItems[type][id];

            ids=data.allItems[type].map(function(current){
                return current.id;
            })
            index=ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index,1);
            }
        }
        ,
        
        calculateBudget: function(){
        
            calculateTotal('exp');
            calculateTotal('inc');


            data.budget = data.totals.inc - data.totals.exp;

        if(data.totals.inc > 0){
            data.percentage =Math.round((data.totals.exp / data.totals.inc) *100);

        }else{
            data.percentage = -1;
        }


        },

        calculatePercentages:function(){

            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc) ;
            })
        },

        getPercentages:function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage(); 
            });
            return allPerc;
        },

        getBudget:function(){
           return{
       budget : data.budget,
       totalInc: data.totals.inc,
       totalExp : data.totals.exp,
       percentage:data.percentage

           }
        },
        
        testing:function(){
            console.log(data);
            
        }
    };




})(); 





var UiController = (function(){

    var DOMstrings = {
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        expensesContainer:'.expenses__list',
        incomeContainer:'.income__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensesPercLabel:'.item__percentage',
        dateLabel:'.budget__title--month'
    };


      var nodeListForEach = function(list,callback){
          for(var i=0;i< list.length ;i++){
            callback(list[i],i);
          }
          }

    return {
        getInput:function(){
            return{

                  type : document.querySelector(DOMstrings.inputType).value,
                  description :document.querySelector(DOMstrings.inputDescription).value,
                  value:parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem:function(obj,type){
            var html,newHtml,element;
            
            if(type === 'inc'){
                element= DOMstrings.incomeContainer;
                
                html=' <div class="item clearfix" id="inc-%id%">  <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
            } else if(type === 'exp'){
                element= DOMstrings.expensesContainer;
                // console.log(type);

            
            
              html=' <div class="item clearfix" id="exp-%id%">  <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
}

            newHtml=html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);


        document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        // console.log(element);
        

                
        },

        deleteListItem:function(selectorID){
            var el =document.getElementById(selectorID);
            // console.log(el);
            
         el.parentNode.removeChild(el);
        },
        
        clearFields:function(){
            var fieldsArr, fields;

            fields= document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

             fieldsArr= Array.prototype.slice.call(fields);

             fieldsArr.forEach(function(current,index,array){
                current.value="";


             });
             fieldsArr[0].focus();
        },

        displayBudget:function(obj){
            console.log(obj.budget);
            
             document.querySelector(DOMstrings.budgetLabel).textContent=obj.budget;
             document.querySelector(DOMstrings.incomeLabel).textContent=obj.totalInc;
             document.querySelector(DOMstrings.expensesLabel).textContent=obj.totalExp;

              if(obj.percentage > 0){
             document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage;

               }else{
                document.querySelector(DOMstrings.percentageLabel).textContent='---';
               }

         
        },
        
        displayPercentages:function(percentages){

            var fields =document.querySelectorAll(DOMstrings.expensesPercLabel);
            

        ;
          nodeListForEach(fields,function(current,index){
             
            if(percentages[index] >0){

                current.textContent = percentages[index] +'%';
            }else{
                current.textContent='---';
            }
            
        });
        },
        
        displayMonth:function(){
                var year,now,months,month;
             now =new Date();
            // var chrismtas = new Date(2025,11,25)
       months=['January','February','March','April','May','June','July','August','September','October','November',
        'December'];
            month =now.getMonth(); 

            year= now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent=months[month]+' '+year ;
        },
        changeType :function(){

          var fields = document.querySelectorAll(
            DOMstrings.inputType+','+
            DOMstrings.inputDescription+','+
            DOMstrings.inputValue);
        

        nodeListForEach(fields,function(cur){
            cur.classList.toggle('red-focus');
            // cur.classList.add('red-focus1');
        });
        document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        // document.querySelector(DOMstrings.inputBtn).classList.toggle('red1');
    },

    
        getDOMstrings:function(){
            return DOMstrings;
        }
        
    };

})();

var Controller=(function(budgetCtrl,UICtrl){

    var setupEventListners=function(){

        var DOM=UICtrl.getDOMstrings();
        document.addEventListener('keypress',function(event){
            document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
            // console.log(event);
            
            if(event.key==='Enter'){
                ctrlAddItem()
            } 
        });
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changeType)
    };


    
    var updateBudget = function(){
        budgetCtrl.calculateBudget();
     
        var budget = budgetCtrl.getBudget();

        // console.log(budget);
        UICtrl.displayBudget(budget);
        
    };

     var updatePercentages = function(){


   budgetCtrl.calculatePercentages();

var percentages = budgetCtrl.getPercentages();
// console.log(percentages);


UICtrl.displayPercentages(percentages);

         
 
     };

    var ctrlAddItem=function(){
        var newItem,input;
        // console.log('hello how are you');
        
        //Fetch the data
          input=UICtrl.getInput();
        // console.log(input);

     if(input.description !== "" && !isNaN(input.value) && input.value>0){
           // item in budgetcontroller
        newItem=  budgetCtrl.addItem(input.type,input.description,input.value);

        //ON the UI
        UICtrl.addListItem(newItem,input.type);

        //input fields ko saaf
        UICtrl.clearFields();


        // calc budget and update
        updateBudget();

        //percentages update
        updatePercentages();

     }

    }

    var ctrlDeleteItem=function(event){
        var itemID,splitID,type;
         itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
        
         if(itemID){

            splitID=itemID.split('-');
            type = splitID[0];
            ID=parseInt(splitID[1]);

            //item delete
            budgetCtrl.deleteItem(type,ID);

            //delete on ui
            UICtrl.deleteListItem(itemID); 

            updateBudget();

            updatePercentages();

            
         }
    }
    
    
    
    return {
        init:function(){
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                 budget : 0,
       totalInc: 0,
       totalExp : 0,
       percentage:0
            });
            setupEventListners();
            
        }
    }
    
    
})(budgetController,UiController);

Controller.init();