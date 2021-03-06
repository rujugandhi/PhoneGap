

var MainApp = function () {
    var expenses = new expenseCollection();
    var dac = new dbDAC();

    /* Compiling templates : Is there a better way? */
    var footerTemplateSource = $('#footerTemplate').html();
    var footerTemplate = Handlebars.compile(footerTemplateSource);

    var source = $('#template').html();
    var expenseTemplate = Handlebars.compile(source);

    var newExpenseSource = $('#newExpenseTemplate').html();
    var newExpenseTemplate = Handlebars.compile(newExpenseSource);

    // Application Constructor
    this.initialize = function () {
        console.log("binding device ready events");
        document.addEventListener("deviceready", onDeviceReady, true);
    };

    this.RemoveExpense = function (obj) {
        expenses.RemoveExpense(obj);
        dac = new dbDAC();
        dac.Save(expenses).done(function() {
            $('li#navCurrentExpenses').click();
        });
    };

    this.EditExpense = function (expId) {
        navigator.notification.alert("You need to be authenticated to make changes.");
        //var exp = expenses.GetExpenseById(expId);
        //var editTemplate = Handlebars.compile($('#editExpenseTemplate').html());

        //$('#exp_' + expId).html(editTemplate(exp));
    };

    this.CancelEdit = function(expId) {
        var exp = expenses.GetExpenseById(expId);
        
    };

    var refreshTemplate = function (data) {

        $('#contents').html('');
        if (data != null && data.length > 0) {
            for (i = 0; i < data.length; i++) {
                $('#contents').append(expenseTemplate(data[i]));
            }
        } else {
            $('#contents').append("<span class='label label-info'>No expense where found. Starting adding them!</span>");

        }
        

    };

    var fetchNewDataFromServer = function() {
        if (deviceInfo.IsConnected) {
            //Update the wifi icon
            $('#wifiStatus').addClass("icon-signal");
            var servDac = new ServerDAC();
            servDac.Read({
                url: "http://splitexpense.apphb.com/UserExpenses/GetAllExpenses",
                objectToRead: expenses
            }).done(function (response) {
                console.log("data recieved from server");
                console.log(response);
                var newExpensesCount = expenses.ProcessNewServerData(response);
                $('#badgeExpense').html(newExpensesCount);
            }).fail(function () {
                console.log("request failed");
            });
        } else {
            $('#wifiStatus').removeClass("icon-signal");
        }
    };

    var onDeviceReady = function () {

        //dac.Read(expenses);
        //window.navigator.notification.alert("Device Ready");
        console.log("application is ready");


        //Fill device details. 
        deviceInfo = new DeviceInfo();
       
       // $('#footer .container').append(footerTemplate(deviceInfo));
        dac = new dbDAC();
        dac.Read(expenses).done(expenses.RefreshNewData).done(refreshTemplate);
        fetchNewDataFromServer();
        $('ul.nav li').on('click', function () {
            $('li.active').removeClass('active');
            $(this).addClass('active');
            fetchNewDataFromServer();
        });

        $('#navNewExpense').on('click', function () {
            $('div#contents').html(newExpenseTemplate());
            $('#btnSave').on('click', function () {
                var name = $('#txtName').val();
                var amount = $('#txtAmount').val();
                var cat = $('#txtCategory').val();
                expenses.AddExpense(name, amount, cat);
                dac = new dbDAC();
                dac.Save(expenses).done(function () {
                    $('li#navCurrentExpenses').click();
                });
            });
        });

        $('li#navCurrentExpenses').on('click', function () {
            dac.Read(expenses).done(refreshTemplate);
        });


        $('#navSync').on('click', function () {
            console.log("syncing device");
            expenses.ResyncPendingData();
            dac = new dbDAC();
            dac.Save(expenses).done(function() {
                $('li#navCurrentExpenses').click();
            });
        });
    };
};
