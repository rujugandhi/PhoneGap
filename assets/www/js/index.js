var MainApp = function () {
    var expenses = new expenseCollection();
    var dac = new dbDAC();
    
    /* Compiling templates : Is there a better way? */
    var footerTemplateSource = $('#footerTemplate').html();
    var footerTemplate = Handlebars.compile(footerTemplateSource);

    var source = $('#template').html();
    var expenseTemplate  = Handlebars.compile(source);

    var newExpenseSource = $('#newExpenseTemplate').html();
    var newExpenseTemplate = Handlebars.compile(newExpenseSource);

    // Application Constructor
    this.initialize = function () {
        document.addEventListener("deviceready", onDeviceReady, true);
    };

    var refreshData = function (data) {
       
    	$('#contents').html('');
    	
        for (i = 0 ; i < data.length ; i++) {
            $('#contents').append(expenseTemplate(data[i]));
        }
    };
   
    var onDeviceReady = function () {

        //dac.Read(expenses);
        //window.navigator.notification.alert("Device Ready");
        console.log("application is ready");

       
       //Fill device details. 
       var deviceInfo = new DeviceInfo();
       console.log(deviceInfo);
       console.log(deviceInfo.Connection);
       $('#footer .container').append(footerTemplate(deviceInfo));
        if (deviceInfo.IsConnected()){
            //we can connect to the server hence load from the server
            dac = new ServerDAC();
            dac.Read({
                url : "http://splitexpense.apphb.com/UserExpenses/GetAllExpenses",
                objectToRead : expenses
            }).done(expenses.RefreshNewData).done(refreshData);
            }
            else{
                //load from stored data if available.
                dac = new dbDAC();
                dac.Read(expenses).done(expenses.RefreshNewData).done(refreshData); 
            }

        $(window).on('readComplete', function (e, data) {
            console.log("read complete");
            expenses.Clear();

            exp = data.value;

            var source = $('#template').html();

            var expenseTemplate = Handlebars.compile(source);
            console.log(exp.length);
            for (i = 0; i < exp.length; i++) {
                expenses.addExpense(exp[i].name, exp[i].amount, exp[i].category);
                $('#contents').append(expenseTemplate(exp[i]));
            }
        });

        $('ul.nav li').on('click',function(){
            $('li.active').removeClass('active');
            $(this).addClass('active');
        });

        $('#navNewExpense').on('click',function(){
            $('div#contents').html(newExpenseTemplate());
            $('#btnSave').on('click', function () {
                var name = $('#txtName').val();
                var amount = $('#txtAmount').val();
                var cat = $('#txtCategory').val();
                expenses.addExpense(name, amount, cat);
                dac = new dbDAC();
                dac.Save(expenses).done(function(){
                    $('li#navCurrentExpenses').click();
                });
            });
        });

        $('li#navCurrentExpenses').on('click',function(){
            dac.Read(expenses).done(refreshData);
        });

        
       $('#navSync').on('click',function(){
       		console.log("syncing device");
       		dac = new ServerDAC();
            dac.Read({
                url : "http://splitexpense.apphb.com/UserExpenses/GetAllExpenses",
                objectToRead : expenses
            }).done(expenses.RefreshNewData).done(refreshData);
        });
    };
};
