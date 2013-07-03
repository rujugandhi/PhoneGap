var Expense = function (id, name, amount, category) {
    this.Name = name;
    this.Amount = amount;
    this.Id = id;
    this.Category = category;
    
};
var expenseCollection = function () {
    var expenses = [];
    this.SaveKey = "expenses";
    var addedExpenseIds = [];
    var pendingExpenseData = [];
    this.AddExpense = function (name, amount, category, id) {
        var exp = new Expense(id, name, amount, category);
        if (typeof id != "undefined" && id > 0) {
            addedExpenseIds.push(exp.Id);
        }
        expenses.push(exp);
        return exp;
    };
    this.RemoveExpense = function(expenseIdToRemove) {
        for (var i = 0; i < expenses.length; i++) {
            if (expenseIdToRemove == expenses[i].Id) {
                expenses.splice(i, 1);
            }
        }
    };
    this.DataToSave = function () {

        var str = JSON.stringify(expenses);
        console.log("Data to save : " + str);
        return str;
    };
    this.Clear = function () {
        expenses = [];
        addedExpenseIds = [];
    };
    this.RefreshNewData = function (jsonData) {
        var deferred = $.Deferred();
        this.Clear();
        var len = jsonData.length;
        for (var i = 0 ; i < len; i++) {
            var exp = jsonData[i];
            this.AddExpense(exp.Name, exp.Amount, exp.Category, exp.Id);
            
        }
        deferred.resolve(expenses);
        return deferred.promise();
    };
    this.ProcessNewServerData = function(response) {
        var newData = 0;
        if (response instanceof Array) {
            for (var i = 0; i < response.length; i++) {
                var exp = response[i];
                if (addedExpenseIds.indexOf(exp.Id) == -1) {
                    newData++;
                    pendingExpenseData.push(new Expense(exp.Id, exp.Name, exp.Amount, exp.Category));
                }
            }
        } else {
            throw "need array input to this function";
        }
        return newData;
    };

    this.ResyncPendingData = function () {
        var initialLen = pendingExpenseData.length;
        for (var i = 0; i < initialLen; i++) {
            var exp = pendingExpenseData.pop();
            expenses.push(exp);
            addedExpenseIds.push(exp.Id);
        }
    };

};
