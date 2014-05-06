/**
 * @fileOverview Basic reading of RF tags. This is the main starting point.
 *
 * This file was created at Openovate Labs.
 * 
 * @author Billie Dee R. Ang <billieang24@gmail.com>
 * @author Jeriel Mari E. Lopez <jerielmari@gmail.com>
 */

/*--Requires--
-----------------------------------------------------------------------------*/
var messageC = require('./llrp/LLRPMessagesConstants.js'),                  //llrpMessageConstants
parameterC = require('./llrp/LLRPParametersConstants.js'),                  //llrpParameterConstants
LLRPMessage = require('./llrp/LLRPMessages.js'),                            //LLRPMessage class
LLRPParameter = require('./llrp/LLRPParameters.js'),                        //LLRPParameter class
decode = require('./llrp/decode.js'),
net = require('net');

/*--Variables--
-----------------------------------------------------------------------------*/
var socket = new net.Socket(), address = "192.168.0.30",                    //ip address of the rfid.
logMessageResponses = false,                                                 //to show Received: MESSAGE and Sending: MESSAGE or not.
isReaderConfigSet = false,                                                  //flag to tell if config has been set.
isStartROSpecSent = false,                                                  //flag to tell if START_ROSPEC message has been sent to avoid duplicates.
client = socket.connect(5084, address, function() {                         //connect to rfid
    console.log('Connected to: ' + address + ':' + 5084);
    //timeout after 60 seconds.
    socket.setTimeout(60000,function(){
        console.log('connection timeout');                                  //tell the user.
    });
});

//Defined message buffers. Brute force, I know I know.
var bSetReaderConfig = new Buffer('040300000010000000000000e2000580', 'hex'),
bEnableEventsAndReport =  new Buffer('04400000000a00000000','hex'),
bAddRoSpec = new Buffer('04140000005d0000000000b1005300000001000000b2001200b300050000b60009000000000000b700180001000000b8000901000003e800ba000700010100ed001f01000000ee000bffc0015c0005c003ff000d000067ba0000008e01', 'hex'),
bEnableRoSpec = new Buffer('04180000000e0000000000000001', 'hex'),
bStartRoSpec = new Buffer('04160000000e0000000000000001', 'hex'),
bKeepaliveAck = new Buffer('04480000000a00000000', 'hex'),
bDeleteRoSpec = new Buffer('04150000000e0000000000000000', 'hex'),          //not used, yet. We are K.I.S.S.
bDeleteAccessSpec = new Buffer('04290000000e0000000000000000', 'hex');      //not used, yet. We are K.I.S.S.

/*--Events--
-----------------------------------------------------------------------------*/
//whenever reader sends data.
client.on('data', function(data) {
    //check if there is data.
    if (data === undefined) {
        throw new Error('Undefined data returned by the rfid.');
    }
    
    //decoded message(s), passable to LLRPMessage class.
    var messagesKeyValue = decode.message(data);

    //loop through the message.
    for (index in messagesKeyValue) {
        //possible we have more than 1 message in a reply.
        var message = new LLRPMessage(messagesKeyValue[index]);
        //to show log or not based on variable flag above.
        if (logMessageResponses) {
            //rfid's response
            console.log('Receiving: ' + message.getTypeName());
        }

        //Check message type and send appropriate response.
        //This send-receive is the most basic form to read a tag in llrp.
        switch(message.getType()) {
            case messageC.READER_EVENT_NOTIFICATION:
                var parametersKeyValue = decode.parameter(message.getParameter());

                parametersKeyValue.forEach(function(decodedParameters) {
                    if (decodedParameters.type == parameterC.ReaderEventNotificationData) {
                        var subParameters = mapSubParameters(decodedParameters);
                        if (subParameters[parameterC.ROSpecEvent] !== undefined) {
                            //Event type is End of ROSpec
                            if (subParameters[parameterC.ROSpecEvent].readUInt8(0) == 1) {
                                //We only have 1 ROSpec so obviously it would be that.
                                //So we would not care about the ROSpecID and
                                //just reset flag for START_ROSPEC.
                                resetIsStartROSpecSent();
                            }
                        }
                    }
                });

                //global configuration and enabling reports has not been set.
                if (!isReaderConfigSet) { //set them.
                    writeMessage(client, bSetReaderConfig);                         //send SET_READER_CONFIG, global reader configuration in reading tags.
                    writeMessage(client, bEnableEventsAndReport);                   //send ENABLE_EVENTS_AND_REPORT, enable sending of reports containing tag data.    
                    isReaderConfigSet = true;                                       //we have set the reader configuration.
                }
                else {
                    sendStartROSpec();                    
                }
                break;
            case messageC.SET_READER_CONFIG_RESPONSE:
                //send ADD_ROSPEC
                writeMessage(client, bAddRoSpec);
                break;
            case messageC.ADD_ROSPEC_RESPONSE:
                //send ENABLE_ROSPEC
                writeMessage(client, bEnableRoSpec);
                break;
            case messageC.ENABLE_ROSPEC_RESPONSE:
                //send START_ROSPEC
                sendStartROSpec();
                break;
            case messageC.RO_ACCESS_REPORT:
                //reset flag for START_ROSPEC.
                resetIsStartROSpecSent();
                //show current date.
                console.log('RO_ACCESS_REPORT at ' + (new Date()).toString());
                //read Parameters
                //this contains the TagReportData
                var parametersKeyValue = decode.parameter(message.getParameter());
                parametersKeyValue.forEach(function(decodedParameters) {
                    //read TagReportData Parameter only.
                    if (decodedParameters.type == parameterC.TagReportData) {
                        var subParameters = mapSubParameters(decodedParameters),
                        output = '';
                        var tagID = 0, tagSeenCount = 0;

                        if (subParameters[parameterC.EPC96] !== undefined) {
                            tagID = subParameters[parameterC.EPC96].toString('hex');
                        }

                        if (subParameters[parameterC.TagSeenCount] !== undefined) {
                            tagSeenCount = subParameters[parameterC.TagSeenCount].readUInt16BE(0);
                        }

                        output += 'ID: ' + tagID + "\tRead count: " + tagSeenCount;
                        console.log(output)
                    }
                });
                break;
            case messageC.KEEPALIVE:
                //send KEEPALIVE_ACK
                writeMessage(client, bKeepaliveAck);       
                break;
            default:
                //Default, doing nothing.
        }
    }
});

//the reader or client has ended the connection.
client.on('end', function() {
    //the session has ended
    console.log('client disconnected');
});

//cannot connect to the reader other than a timeout.
client.on('error',function(err){
    //error on the connection
    console.log(err);
});

/*--Helper functions--
-----------------------------------------------------------------------------*/
/**
 * Send message to rfid and write logs.
 * 
 * @param  {[type]} client  rfid connection.
 * @param  {Buffer} buffer  to write.
 */
function writeMessage(client, buffer) {
    //to show log or not based on variable flag above.
    if (logMessageResponses) {
        //rfid's response
        console.log('Sending ' + getMessageName(buffer));
    }

    return client.write(buffer);
}

/**
 * Gets the name of the message using the encoded Buffer.
 * 
 * @param  {Buffer} data
 * @return {string} name of the message
 */
function getMessageName(data) {
    //get the message code
    //get the name from the constants.
    return messageC[getMessage(data)];
}

/**
 * Gets the message type using the encoded Buffer.
 * 
 * @param  {Buffer} data
 * @return {int} corresponding message type code.
 */
function getMessage(data) {
    //message type resides on the first 2 bits of the first octet
    //and 8 bits of the second octet.
    return (data[0] & 3) << 8 | data[1];
}

/**
 * Sends a START_ROSPEC message if it has not been sent.
 *
 * @return {Int} returns the length written or false if there was an error writing.
 */
function sendStartROSpec() {
    //START_ROSPEC has not been sent.
    if (!isStartROSpecSent) {
        isStartROSpecSent = true;                                           //change state of flag.
        return writeMessage(client, bStartRoSpec);                          //send START_ROSPEC
    }
}

/**
 * Resets the isStartROSpecSent flag to false.
 */
function resetIsStartROSpecSent() {
    isStartROSpecSent = false;
}

/**
 * Simple helper function to map key value pairs using the typeName and value.
 * Probably should be built in with LLRPParameter class.
 * 
 * @param  {Object} decodedParameters  object returned from decode.parameter.
 * @return {Object}  the key value pair.
 */
function mapSubParameters(decodedParameters) {
    //create an object that will hold a key value pair.
    var properties = {};
    var subP = decodedParameters.subParameters;
    for (tag in subP) {
        //where key is the Parameter type.
        //and value is the Parameter value as Buffer object.
        properties[subP[tag].type] = subP[tag].value;
    }

    return properties;
}