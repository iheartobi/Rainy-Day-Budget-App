
//BUDGET CONTROLLER
let budgetController = (function(){

    //keeps track of income and expenses also percentages


    let Expense = function(id, description, value){
        this.id = id, 
        this.description = description,
        this.value = value, 
        this.percentage = -1
    }

    Expense.prototype.calcPercentage = function(totalIncome){

        if (totalIncome > 0){

            this.percentage = Math.round((this.value / totalIncome) * 100)
        }else{
            this.percentage = -1
        }
    }

    Expense.prototype.getPercentage = function(){
        return this.percentage
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
        deleteItem: function(type, id){
                let ids, index;
            ids =  data.allItems[type].map(function(current){
                return current.id
            })
            index = ids.indexOf(id)
            if (index !== -1){
                data.allItems[type].splice(index, 1)
            }
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
        calculatePercentages: function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc)
            })
        },

        getPercentages: function(){
            let allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage()
            })
            return allPerc
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
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    }

    let formatNumber = function(num, type){
        let numSplit, int, dec

    num = Math.abs(num)
    num = num.toFixed(2)
    numSplit = num.split('.')
    int = numSplit[0]
    if(int.length > 3){
        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3)
    }
    
    dec = numSplit[1]
    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec

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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if (type === 'exp'){
                element = DOMstrings.expensesContainer
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            }
            //replace the place holder text with data use replace() method
            newHtml = html.replace('%id%', obj.id)
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type))

            //insert the HTML into the DOM

            /*insertAdjacentHTML makes it so all HTML will be inserted as a child whichever list it belongs in thr container as the last child in the list.. income_list or expense list
            */
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
            
        },

        deleteListItem: function(selectorID){
            let el = document.getElementById(selectorID)
                el.parentNode.removeChild(el)
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
            let type
            obj.budget > 0 ? type = 'inc' : type = 'exp'

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type)
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc')
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExpenses, 'exp')

            if (obj.percentage > 0){
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%'
            }else{
            document.querySelector(DOMstrings.percentageLabel).textContent = '---'

            }
        },

        displayPercentages: function(percentages){
            
            let fields = document.querySelectorAll(DOMstrings.expensesPercLabel)
            let nodeListForEach = function(list, callback){
                for( i = 0; i < list.length; i++) {
                    callback(list[i], i)
                }
            }


            nodeListForEach(fields, function(current, index){
                if (percentages[index] > 0){
                    current.textContent = percentages[index] + '%'
                }else{
                    current.textContent = '---'
                }

            })
        },

        displayMonth: function(){
            let now, year, month, months
             now = new Date()
             month = now.getMonth()
             months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Sept', 'October', 'November', 'December']
             year = now.getFullYear()

             document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year
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
        document.querySelector(dom.container).addEventListener('click', ctrlDeleteItem)
    }

    

    let updateBudget = function(){

        //calculate budget
        budgetCtrl.calculateBudget()
        //return the budget
       let budget =  budgetCtrl.getBudget()
        //display budget on UI
        UICtrl.displayBudget(budget)
    }

    let updatePercentages = function(){
        // calculate percentages
        budgetController.calculatePercentages()

        // read percentages from budget controller
        let percentages = budgetController.getPercentages()
        // update the UI
        UICtrl.displayPercentages(percentages)
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

        // calculate and update percentages
        updatePercentages()
       
    }

    let ctrlDeleteItem = function(event){
        let itemId, splitId, type, ID
        // DOM traversing to get parent element of delete button
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id

        if (itemId) {
            //javascript will wrap primitives like strings/numbers into an object so that methods like split can be called on it
            splitId = itemId.split('-')
            type = splitId[0]
            ID = parseInt(splitId[1])

            // delete item from data structure
            budgetController.deleteItem(type, ID)

            // delete item from UI
            UIController.deleteListItem(itemId)

            // update and show new budget
            updateBudget()

            // calculate and update percentages
            updatePercentages()
        }
    }

    return {
        init: function(){
            console.log("Application has started")
            UICtrl.displayMonth()
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



