var HomeView = function(dal,applicationDataModel) {
    this.dal = dal;
    this.adm = applicationDataModel;
    this.el = null;
    this.Initialize = function () {
        //Defining a div wrapper for a view to display elements and bind events on. 
        this.el = $('<div/>');
        //Bind Events here. 
    };
    this.Render = function() {
        //Call the dal (Data Access Layer) to get expenses and render them into the div wrapper
        this.dal.Read(this.adm).done(function(exp) {
            //When read is done. 
            var renderedText = HomeView.ExpenseListTemplate(exp);
            return renderedText;
        });
    };
    this.Initialize();
};


HomeView.ExpenseListTemplate = Handlebars.compile($('#ExpenseListTemplate').html());