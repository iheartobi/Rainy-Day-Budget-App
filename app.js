
//BUDGET CONTROLLER
let budgetController = (function(){

    //keeps track of income and expenses also percentages


    let Expense = function(id, description, value){
        this.id = id, 
        this.description = description,
        this.value = value
    }

    let Income = function(id, description, value){
        this.id = id, 
        this.description = description,
        this.value = value
    }

    let calculateTotal = function(type){
        let sum = 0
        data.allItems[type].forEach(function(curr){
            sum += curr.value
        })
        data.totals[type] = sum
    }

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    return{
        addItem: function(type, des, val){
            let newItem, ID
             //create new ID with last element of type array

             if (data.allItems[type].length > 0){
             ID = data.allItems[type][data.allItems[type].length - 1].id + 1   
             }else {
                 ID = 0
             }

             //determine type of array
            if (type === 'exp'){
                newItem = new Expense(ID, des, val)
            } else if (type === 'inc'){
                newItem = new Income(ID, des, val)
            }
            //push data into data structure by type
            data.allItems[type].push(newItem)

            //return new element
            return newItem
        },
        calculateBudget: function(){
            // calculate total income and expenses
            calculateTotal('exp')
            calculateTotal('inc')
            //calculate budget income - expenses
            data.budget = data.totals.inc - data.totals.exp
            ///
            if (data.totals.inc > 0){
                 //calculate percentage of budget
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
            } else data.percentage = -1
        },
        getBudget: function(){
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function(){
            console.log(data)
        }
    }
    

})()



//UI CONTROLLER
let UIController = (function(){

    let DOMstrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'

    }

    return {
        getInput: function(){
          return{
             type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
             description: document.querySelector(DOMstrings.inputDesc).value,
             value: parseFloat(document.querySelector(DOMstrings.inputValue).value)

          }     
        },
        addListItem: function(obj, type){
            let html, newHtml, element;
            // create HTML string with placeholder text
            if ( type === 'inc'){
                element = DOMstrings.incomeContainer
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if (type === 'exp'){
                element = DOMstrings.expensesContainer
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            }
            //replace the place holder text with data use replace() method
            newHtml = html.replace('%id%', obj.id)
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', obj.value)

            //insert the HTML into the DOM

            /*insertAdjacentHTML makes it so all HTML will be inserted as a child whichever list it belongs in thr container as the last child in the list.. income_list or expense list
            */
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
            
        },
        clearFields: function(){
         let fields, fieldsArray
         fields =  document.querySelectorAll(DOMstrings.inputDesc + ', ' + DOMstrings.inputValue)
         fieldsArray = Array.prototype.slice.call(fields)

         fieldsArray.forEach(function(current, index, array){
                current.value = ""
         })
         fieldsArray[0].focus
        },
        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalIncome
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExpenses

            if (obj.percentage > 0){
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%'
            }else{
            document.querySelector(DOMstrings.percentageLabel).textContent = '---'

            }
        },
        getDOMstrings: function(){
           return DOMstrings
       }
    }

})()


//APP CONTROLLER
let controller = (function(budgetCtrl, UICtrl){
    let setupEventListeners = function(){
        let dom = UICtrl.getDOMstrings()
        document.querySelector(dom.inputBtn).addEventListener("click", ctrlAddItem)
        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13 || event.which === 13){
                ctrlAddItem()
            }
        })
    }

    let updateBudget = function(){

        //calculate budget
        budgetCtrl.calculateBudget()
        //return the budget
       let budget =  budgetCtrl.getBudget()
        //display budget on UI
        UICtrl.displayBudget(budget)
    }

    let ctrlAddItem = function(){
        let input, newItem;

        //get field input data
        input = UICtrl.getInput()

        if (input.description !== "" && !isNaN(input.value) && input.value > 0){

        //add item to budget controller
        // values come from input variable in UI controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value)
        //add item to UI && clear fields
        UICtrl.addListItem(newItem, input.type)
        // clear input fields
        UICtrl.clearFields()
        //calculate and update budget
        updateBudget()
        }
        
       
    }

    return {
        init: function(){
            console.log("Application has started")
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1
            })
            setupEventListeners()
     }
   }
})(budgetController, UIController)

controller.init()




