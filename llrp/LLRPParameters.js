/**
 * @fileOverview Defines an llrp parameter class.
 *
 * This file was created at Openovate Labs.
 * 
 * @author Billie Dee R. Ang <billieang24@gmail.com>
 * @author Jeriel Mari E. Lopez <jerielmari@gmail.com>
 */

/*--Requires--
-----------------------------------------------------------------------------*/
var parameterC = require('./LLRPParametersConstants.js');

/**
 * Contains the decoded LLRPParameter as an object.
 *
 * @param {Array} value
 */
var LLRPParameter = function (data) {
	//check if this was invoked as a function
	if (!(this instanceof LLRPParameter)) {
		//create an object of the class.
        return new LLRPParameter(data);
    }

	//check for insufficient parameters
	if (data.type === undefined || data.length === undefined ||
		data.reserved === undefined || data.value === undefined) {
		//tell them the error.
		throw new Error('Insufficient parameters.');
	}

	//set properties. bits will depend on encoding type.
	this.type = {value: data.type, bits: 0};
	this.length = {value: data.length, bits: 0};
	this.reserved = {value: data.reserved, bits: 0};
	this.value = {value: data.value, bits: data.value.length * 8};
	this.subParameters = data.subParameters;

	//check if it is TV encoded.
	if (isTV(this.type)) {
		this.type.bits = 7;								//type bits is 7.
		this.length.bits = 0;							//length is not encoded.
		this.reserved.bits = 1;							//reserved bits is 1.
	}
	else { //TLV encoded.
		this.type.bits = 10;							//type bits is 10.
		this.length.bits = 16;							//length bits is 16.
		this.reserved.bits = 6;							//reserved bits is 6.
	}
}

/*--Set methods--
-----------------------------------------------------------------------------*/
LLRPParameter.prototype.setValue = function (value) {
	this.value.value = value;								//set type. bits will depend on encoding type.
	this.value.bits = value.length * 8;
	
	//check if it is TV encoded.
	if (isTV(this.type)) {
		this.length.value = 1 + this.value.length;			//length is 1 octet of type + value octets.
	}
	else { //TLV encoded.
		this.length.value = 4 + this.value.length;			//length is 2 octets reserved and type + 2 octets length + value octets
	}

	return this;
}

LLRPParameter.prototype.setSubParameters = function (subParameters) {
	this.subParameters = subParameters;

	return this;
}

/*--Get methods--
-----------------------------------------------------------------------------*/
LLRPParameter.prototype.getTypeName = function() {
	return parameterC[this.type.value];
}

LLRPParameter.prototype.getType = function() {
	return this.type.value;
}

LLRPParameter.prototype.getLength = function() {
	return this.length.value;
}

LLRPParameter.prototype.getValue = function() {
	return this.value.value;
}

LLRPParameter.prototype.getSubParameters = function() {
	return this.subParameters;
}

LLRPParameter.prototype.getEncoding = function() {
	if (isTV(this.type.value)) {
		return parameterC.ENCODING_TV;
	}

	return parameterC.ENCODING_TV;
}

function isTV(type) {
	//TV (type-value) is from 0-127
	return type < 128;
}

module.exports = LLRPParameter;