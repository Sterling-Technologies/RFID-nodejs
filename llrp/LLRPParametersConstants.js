/**
 * @fileOverview Defines constants used integral to decoding llrp parameters.
 *
 * This file was created at Openovate Labs.
 * 
 * @author Jeriel Mari E. Lopez <jerielmari@gmail.com>
 */

/**
 * Sets an LLRPParameter constant.
 * 
 * @param  {String}  name             the parameter name.
 * @param  {Int}     value            the parameter type number.
 * @param  {Object}  exportsObject    the object that will contain the "constants"
 * @param  {Boolean} hasSubParameter  does the parameter possibly contain
 * @param  {Int}     tvLength         how long in bytes the entire TV encoded parameter is.
 * @param  {Int}     staticLength     how long in bytes is the encoded parameter up to the last value, excluding sub-parameters and variable length values.
 */
var define = function (name, value, exportsObject, hasSubParameter, tvLength, staticLength)
{
    //check if exportsObject is set.
    if (exportsObject === undefined) {
        //tell them there is an error.
        throw new Error('Undefined exportsObject in defining constants.');
    }

    //check if tvLengths has been set
    if (exportsObject.tvLengths === undefined) {
        //create a new array for it if not.
        exportsObject.tvLengths = {};
    }

    //check if tvLengths has been set
    if (exportsObject.staticLengths === undefined) {
        //create a new array for it if not.
        exportsObject.staticLengths = {};
    }

    //check if hasSubParameters has been set
    if (exportsObject.hasSubParameters === undefined) {
        //create a new array for it if not.
        exportsObject.hasSubParameters = {};
    }

    //is tvLength set and greater than 0.
    if (tvLength !== undefined && tvLength > 0) {
        //set tvLengths, use parameter type number (value) as the key.
        //defining our constant.
        Object.defineProperty(exportsObject.tvLengths, value, {
            'value': tvLength,
            'enumerable': true,
            'writable': false,                                  //non-writable, making it a constant.
        });
    }

    //is staticLength set and greater than 0.
    if (staticLength !== undefined && staticLength > 0) {
        //set tvLengths, use parameter type number (value) as the key.
        //defining our constant.
        Object.defineProperty(exportsObject.staticLengths, value, {
            'value': staticLength,
            'enumerable': true,
            'writable': false,                                  //non-writable, making it a constant.
        });
    }

    //set defaults.
    exportsObject.hasSubParameters[value] = false;
    //is hasSubParameter set.
    if (hasSubParameter !== undefined) {
        //set hasSubParameters, use parameter type number (value) as the key.
        //defining our constant.
        Object.defineProperty(exportsObject.hasSubParameters, value, {
            'value': hasSubParameter,
            'enumerable': true,
            'writable': false,                                  //non-writable, making it a constant.
        });
    }

    //defining our constant.
    Object.defineProperty(exportsObject, name, {
        'value': value,
        'enumerable': true,
        'writable': false,                                      //non-writable, making it a constant.
    });

    //defining our constant, reversed with key as value and value as key.
    Object.defineProperty(exportsObject, value, {
        'value': name,
        'enumerable': false,                                     //don't include as an enumerable parameter
        'writable': false,                                      //non-writable, making it a constant.
    });
}

var exportsObject = new Object();

/*--Constants--
-----------------------------------------------------------------------------*/
//General Parameters
define('UTCTimeStamp', 128, exportsObject, false, 0, 12);
define('Uptime', 129, exportsObject, false, 0, 12);
//Reader Device Capabilities Parameters
define('GeneralDeviceCapabilities', 137, exportsObject, true, 0, 18);
define('ReceiveSensitivityTableEntry', 139, exportsObject, false, 0, 8);
define('PerAntennaAirProtocol', 140, exportsObject, false, 0, 12);
define('GPIOCapabilities', 141, exportsObject, false, 0, 8);
define('LLRPCapabilities', 142, exportsObject, false, 0, 32);
define('RegulatoryCapabilities', 143, exportsObject, true, 0, 8);
define('UHFBandCapabilities', 144, exportsObject, true, 0, 4);
define('TransmitPowerLevelTableEntry', 145, exportsObject, false, 0, 8);
define('FrequencyInformation', 146, exportsObject, true, 0, 5);
define('FrequencyHopTable', 147, exportsObject, false, 0, 8);                                          //Variable number of frequencies 1-n
define('FixedFrequencyTable', 148, exportsObject, false, 0, 6);                                          //Variable number of frequencies 1-n
define('PerAntennaReceiveSensitivityRange', 149, exportsObject, false, 0, 10);
//Reader Operations Parameters
define('ROSpec', 177, exportsObject, true, 0, 10);
define('ROBoundarySpec', 178, exportsObject, true, 0, 4);
define('ROSpecStartTrigger', 179, exportsObject, true, 0, 5);
define('PeriodicTriggerValue', 180, exportsObject, true, 0, 12);
define('GPITriggerValue', 181, exportsObject, false, 0, 11);
define('ROSpecStopTrigger', 182, exportsObject, true, 0, 9);
define('AISpec', 183, exportsObject, true, 0, 6);
define('AISpecStopTrigger', 184, exportsObject, true, 0, 9);
define('TagObservationTrigger', 185, exportsObject, false, 0, 16);
define('InventoryParameterSpec', 186, exportsObject, true, 0, 7);
define('RFSurveySpec', 187, exportsObject, true, 0, 14);
define('RFSurveySpecStopTrigger', 188, exportsObject, false, 0, 13);
//Access Operation Parameters
define('AccessSpec', 207, exportsObject, true, 0, 16);
define('AccessSpecStopTrigger', 208, exportsObject, false, 0, 8);
define('AccessCommand', 209, exportsObject, true, 0, 4);
define('ClientRequestOpSpec', 210, exportsObject, false, 0, 6);
define('ClientRequestResponse', 211, exportsObject, true, 0, 8);
//Configuration Parameters
define('LLRPConfigurationStateValue', 217, exportsObject, false, 0, 8);
define('Identification', 218, exportsObject, false, 0, 7);                                          //variable length ReaderID
define('GPOWriteData', 219, exportsObject, false, 0, 8);
define('KeepaliveSpec', 220, exportsObject, false, 0, 9);
define('AntennaProperties', 221, exportsObject, false, 0, 9);
define('AntennaConfiguration', 222, exportsObject, true, 0, 6);
define('RFReceiver', 223, exportsObject, false, 0, 6);
define('RFTransmitter', 224, exportsObject, false, 0, 10);
define('GPIPortCurrentState', 225, exportsObject, false, 0, 8);
define('EventsAndReports', 226, exportsObject, false, 0, 5);
//Reporting Parameters
define('ROReportSpec', 237, exportsObject, true, 0, 7);
define('TagReportContentSelector', 238, exportsObject, true, 0, 6);
define('AccessReportSpec', 239, exportsObject, false, 0, 6);
define('TagReportData', 240, exportsObject, true, 0, 4);
define('EPCData', 241, exportsObject, false, 0, 6);                                          //variable length EPC
define('EPC96', 13, exportsObject, false, 13, 13);
define('ROSpecID', 9, exportsObject, false, 5, 5);
define('SpecIndex', 14, exportsObject, false, 3, 3);
define('InventoryParameterSpecID', 10, exportsObject, false, 3, 3);
define('AntennaID', 1, exportsObject, false, 3, 3);
define('PeakRSSI', 6, exportsObject, false, 2, 2);
define('ChannelIndex', 7, exportsObject, false, 3, 3);
define('FirstSeenTimestampUTC', 2, exportsObject, false, 9, 9);
define('FirstSeenTimestampUptime', 3, exportsObject, false, 9, 9);
define('LastSeenTimestampUTC', 4, exportsObject, false, 9, 9);
define('LastSeenTimestampUptime', 5, exportsObject, false, 9, 9);
define('TagSeenCount', 8, exportsObject, false, 3, 3);
define('ClientRequestOpSpecResult', 15, exportsObject, false, 3, 3);
define('AccessSpecID', 16, exportsObject, false, 5, 5);
define('RFSurveyReportData', 242, exportsObject, true, 0, 4);
define('FrequencyRSSILevelEntry', 243, exportsObject, true, 0, 14);
define('ReaderEventNotificationSpec', 244, exportsObject, true, 0, 4);
define('EventNotificationState', 245, exportsObject, false, 0, 7);
define('ReaderEventNotificationData', 246, exportsObject, true, 0, 4);
define('HoppingEvent', 247, exportsObject, false, 0, 8);
define('GPIEvent', 248, exportsObject, false, 0, 7);
define('ROSpecEvent', 249, exportsObject, false, 0, 13);                                          //PreemptingROSpecID is ignored if EventType != 2
define('ReportBufferLevelWarningEvent', 250, exportsObject, false, 0, 5);
define('ReportBufferOverflowErrorEvent', 251, exportsObject, false, 0, 4);
define('ReaderExceptionEvent', 252, exportsObject, true, 0, 6);                                          //variable length UTF8 Message
define('OpSpecID', 17, exportsObject, false, 3, 3);
define('RFSurveyEvent', 253, exportsObject, false, 0, 11);
define('AISpecEvent', 254, exportsObject, true, 0, 11);
define('AntennaEvent', 255, exportsObject, false, 0, 7);
define('ConnectionAttemptEvent', 256, exportsObject, false, 0, 6);
define('ConnectionCloseEvent', 257, exportsObject, false, 0, 4);
//LLRP Error Parameters
define('LLRPStatus', 287, exportsObject, false, 0, 8);                                          //variable length UTF8 ErrorDescription
define('FieldError', 288, exportsObject, false, 0, 8);
define('ParameterError', 289, exportsObject, true, 0, 8);
define('Custom', 1023, exportsObject, false, 0, 12);                                          //VendorParameter Vendor specific value
//Air Protocol Specific Parameters
//Class-1 Generation-2 (C1G2) Protocol Parameters
//Capabilities Parameters
define('C1G2LLRPCapabilities', 327, exportsObject, false, 0, 7);
define('UHFC1G2RFModeTable', 328, exportsObject, true, 0, 4);
define('UHFC1G2RFModeTableEntry', 329, exportsObject, false, 0, 32);
//Reader Operations Parameters
define('C1G2InventoryCommand', 330, exportsObject, true, 0, 5);
define('C1G2Filter', 331, exportsObject, true, 0, 5);
define('C1G2TagInventoryMask', 332, exportsObject, false, 0, 9);                                          //Variable length bit count TagMask
define('C1G2TagInventoryStateAwareFilterAction', 333, exportsObject, false, 0, 6);
define('C1G2TagInventoryStateUnawareFilterAction', 334, exportsObject, false, 0, 5);
define('C1G2RFControl', 335, exportsObject, false, 0, 8);
define('C1G2SingulationControl', 336, exportsObject, true, 0, 11);
define('C1G2TagInventoryStateAwareSingulationAction', 337, exportsObject, false, 0, 5);
//Access Operation Parameters
define('C1G2TagSpec', 338, exportsObject, true, 0, 4);
define('C1G2TargetTag', 339, exportsObject, false, 0, 9);                                          //Variable length bit count TagMask, plus 16 bit DataBitCount and ariable length bit count TagData
//C1G2 OpSpecs
define('C1G2Read', 341, exportsObject, false, 0, 15);
define('C1G2Write', 342, exportsObject, false, 0, 15);                                          //Variable length word count WriteData
define('C1G2Kill', 343, exportsObject, false, 0, 10);
define('C1G2Lock', 344, exportsObject, true, 0, 10);
define('C1G2LockPayload', 345, exportsObject, false, 0, 6);
define('C1G2BlockErase', 346, exportsObject, false, 0, 15);
define('C1G2BlockWrite', 347, exportsObject, false, 0, 15);                                          //Variable length word count WriteData
//Reporting Parameters
define('C1G2EPCMemorySelector', 348, exportsObject, false, 0, 5);
define('C1G2PC', 12, exportsObject, false, 3, 3);
define('C1G2CRC', 11, exportsObject, false, 3, 3);
define('C1G2SingulationDetails', 18, exportsObject, false, 5, 5);
//C1G2 OpSpec Results
define('C1G2ReadOpSpecResult', 349, exportsObject, false, 0, 9);                                          //Variable word count ReadData
define('C1G2WriteOpSpecResult', 350, exportsObject, false, 0, 9);
define('C1G2KillOpSpecResult', 351, exportsObject, false, 0, 7);
define('C1G2LockOpSpecResult', 352, exportsObject, false, 0, 7);
define('C1G2BlockEraseOpSpecResult', 353, exportsObject, false, 0, 7);
define('C1G2BlockWriteOpSpecResult', 354, exportsObject, false, 0, 9);

//extra constants outside the form of our define function.
//defining ENCODING_TV.
Object.defineProperty(exportsObject, "ENCODING_TV", {
    'value': 1,                                             //1, mask 01
    'enumerable': false,                                    //don't include as an enumerable parameter
    'writable': false,                                      //non-writable, making it a constant.
});

//defining ENCODING_TV.
Object.defineProperty(exportsObject, "ENCODING_TLV", {
    'value': 2,                                             //2, mask 10
    'enumerable': false,                                    //don't include as an enumerable parameter
    'writable': false,                                      //non-writable, making it a constant.
});

module.exports = exportsObject;