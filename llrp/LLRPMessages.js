/**
 * @fileOverview Defines an llrp message class.
 *
 * This file was created at Openovate Labs.
 * 
 * @author Billie Dee R. Ang <billieang24@gmail.com>
 * @author Jeriel Mari E. Lopez <jerielmari@gmail.com>
 */

/*--Requires--
-----------------------------------------------------------------------------*/
var messagesC = require('./LLRPMessagesConstants.js');

/**
 * Contains the decoded LLRPMessage as an object.
 * 
 * @param {Object} data  key value pairs having at least type and length.
 */
var LLRPMessage = function(data) {
	//check if this was invoked as a function
	if (!(this instanceof LLRPMessage)) {
		//create an object of the class.
        return new LLRPMessage(data);
    }

    //check for insufficient parameters, others may have defaults.
	if (data.type === undefined || data.length === undefined) {
		//tell them the error.
		throw new Error('Insufficient parameters.');
	}

	//check for undefined id.
    if (data.id === undefined) {
		data.id = 0;																	//set default.
	}

	//check for undefined reserved.
	if (data.reserved === undefined) {
		data.reserved = 0;																//set default.
	}

	//check for undefined parameter
	if (data.parameter === undefined) {	
		data.parameter = {};															//set empty Array or Buffer.
	}

	//check for undefined version.
	if (data.version === undefined) {
		data.version = 1;																//set default version 1.
	}
	
	//set properties.
	this.reserved = {value: 0, bits: 3};												//01
	this.version = {value: 1, bits: 3};													//02
	this.type = {value: data.type & 1023, bits: 10};									//03
	this.id = {value: data.id & 4294967295 , bits: 32};									//05 -> length is derived and last.
	this.parameter = {value: data.parameter, bits: data.parameter.length * 8};			//06
	this.length = {value: (this.reserved.bits + this.version.bits +						//04
		this.type.bits + this.parameter.bits + this.id.bits + 32 /*length field*/) / 8,
		bits: 32};
}

/*--Set methods--
-----------------------------------------------------------------------------*/
LLRPMessage.prototype.setVersion = function (version) {
	this.version = {value: version & 7, bits: 3}
	return this;
}

LLRPMessage.prototype.setType = function (type) {
	this.type = {value: type & 1023, bits: 10}
	return this;
}

LLRPMessage.prototype.setID = function (id) {
	this.id = {value: id, bits: 32}
	return this;
}

LLRPMessage.prototype.setParameter = function (parameter) {
	this.parameter = {value: parameter, bits: parameter.length * 8};
	this.length = {value: (this.reserved.bits + this.version.bits +
		this.type.bits + this.parameter.bits + this.id.bits + 32 /*length field*/) / 8,
		bits: 32};
	return this;
}

/*--Get methods--
-----------------------------------------------------------------------------*/
LLRPMessage.prototype.getVersion = function() {
	return this.version.value;
}

LLRPMessage.prototype.getType = function() {
	return this.type.value;
}

LLRPMessage.prototype.getTypeName = function() {
	return messagesC[this.type.value];
}

LLRPMessage.prototype.getParameter = function() {
	return this.parameter.value;
}

module.exports = LLRPMessage;