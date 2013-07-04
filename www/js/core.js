//Core data models for this app will lie here. 

var fileDAC = function () {
    var obToSave = null;

    var gotFS = function (fileSystem) {
        var filename = obToSave.SaveKey + ".txt";
        fileSystem.root.getFile(filename, { create: true, exclusive: false }, gotFileEntry, failedFS);
    };
    var failedFS = function (evt) {
        console.log("failed to get the file system");
        console.log(evt.target.error.code);
    };
    var gotFileEntry = function (fileEntry) {
        console.log("Got file entry. will create a writer now out of it.");
        fileEntry.createWriter(gotFileWriter, failedFS);
    };

    var gotFileWriter = function (writer) {
        console.log("got the writer. now will start writing to the file");
        writer.write(obToSave.DataToSave());
    };
    this.Save = function (objectToSave) {
        console.log("saving to file");
        obToSave = objectToSave;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, failedFS);

        console.log("save successfull");
    };
    this.Read = function (objectToSave) {
        var returnObject = null;
        console.log("reading from file");
        obToSave = objectToSave;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            var fileName = obToSave.SaveKey + ".txt";
            fileSystem.root.getFile(fileName, null, function (fileEntry) {
                fileEntry.file(function (file) {
                    var reader = new FileReader();
                    reader.onload = function (evt) {
                        console.log(evt.target.result);
                        returnObject = JSON.parse(evt.target.result);
                        $.event.trigger('readComplete', { value: returnObject });
                    };
                    reader.readAsText(file);
                }, failedFS);
            }, failedFS);
        }, failedFS);
    };
};

var dbDAC = function () {
    this.Save = function (objectToSave) {
        var deferred = $.Deferred();
        console.log("Saving in database");
        var result = window.localStorage.setItem(objectToSave.SaveKey, objectToSave.DataToSave());
        deferred.resolveWith(objectToSave, [objectToSave]);
        return deferred.promise();
    };
    this.Read = function (objectToRead) {
        console.log("Reading from database");
        var deferred = $.Deferred();
        var returnObject = window.localStorage.getItem(objectToRead.SaveKey);
        deferred.resolveWith(objectToRead, [JSON.parse(returnObject)]);
        return deferred.promise();
        //$.event.trigger('readComplete',{value:returnObject})
    };
};

var ServerDAC = function () {


    this.Read = function (data) {
        //read data from server
        return $.ajax({
            type: "POST",
            url: data.url,
            dataType: "json",
            context: data.objectToRead
        });
    };

    this.Save = function (data) {
        throw "Not implemented yet";
    };
};
var DeviceInfo = function () {

    this.Connection = function () {
        //this function returns the connection type if cordova is loaded. 
        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.CELL] = 'Cell generic connection';
        states[Connection.NONE] = 'No network connection';

        var networkState = navigator.connection.type;
        return states[networkState];
    };
    this.IsConnected = function () {
        if (this.Connection() == "No network connection") {
            return false;
        } else {
            return true;
        }
    };
};