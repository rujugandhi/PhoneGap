var NewExpenseView = function(dac, adm) {
    this.dac = dac;
    this.adm = adm;
    this.el = null;
    this.Initiliaze = function() {
        var self = this;
        this.el = $('<div/>');
        //Bind events. 
        this.el.on('click', '#btnSave', function() {
                var name = $('#txtName').val();
                var amount = $('#txtAmount').val();
                var cat = $('#txtCategory').val();
                self.adm.AddExpense(name, amount, cat);
                self.dac.Save(self.adm).done(function() {
                $('li#navCurrentExpenses').click();
            });
        });
    };

    this.Render = function() {
        this.el.html(NewExpenseView.NewExpenseTemplate());
        return this.el;
    };

    this.Initiliaze();
};

NewExpenseView.NewExpenseTemplate = Handlebars.compile($('#newExpenseTemplate').html());