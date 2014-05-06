/**
 * @fileOverview Encodes an llrp message or parameter to a Buffer object.
 *
 * This file was created at Openovate Labs.
 * 
 * @author Billie Dee R. Ang <billieang24@gmail.com>
 * @author Jeriel Mari E. Lopez <jerielmari@gmail.com>
 */

/*--Requires--
-----------------------------------------------------------------------------*/
var messagesC = require('./LLRPMessagesConstants.js'),
parameterC = require('./LLRPParametersConstants.js');

/**
 * Encodes to a writable buffer the LLRPMessage object.
 * 
 * @param  {LLRPMessage} llrpMessage  object to encode to a buffer.
 * @return {Buffer}             writable buffer object
 */
exports.message = function(llrpMessage) {
	//Create the buffer, should be the length of the message.
	//We will not account for slicing the data.
	var buffer = new Buffer(llrpMessage.length.value);

	//3 bits of reserved value + 3 bits of id value + 2 bits type value from the 9th and 10th bit.
	buffer.writeUInt8((llrpMessage.reserved.value << 5) | (llrpMessage.id.value << 2) | (llrpMessage.type.value & 768) >> 8, 0);
	buffer.writeUInt8(llrpMessage.type.value & 255, 1);				//8 bits from type value.
	buffer.writeUInt32BE(llrpMessage.length.value, 2);				//32 bits from length.
	buffer.writeUInt32BE(llrpMessage.id.value, 6);					//32 bits from id.
	parameter.value.copy(buffer, 10);								//copy the parameter.

	return buffer;
}

/**
 * Encodes to a writable buffer the LLRPParameter object.
 * This does not recurse the subParameters as encoded
 * subParameters are included in value.
 * 
 * @param  {LLRPParameter} llrpParameter object to encode to a buffer.
 * @return {Buffer}		writable buffer object.
 */
exports.parameter = function(llrpParameter) {
	//Create the buffer, should be the length of the llrpParameter.
	//We will not account for slicing the data.
	var buffer = new Buffer(llrpParameter.length);

	//If llrpParameter uses TV encoding
	if(llrpParameter.type < 128) {
		//write the first octet, where the most significant bit of the octet is 1.
		buffer.writeUInt8(llrpParameter.reserved << 7 | llrpParameter.type, 0);
		//set the value of the parameter.
		llrpParameter.value.copy(buffer, 10);
	}
	else { //otherwise it uses TLV encoding
		//6 bits of reserved value + 2 bits of type value
		buffer.writeUInt8((llrpParameter.reserved << 2) | ((llrpParameter.type & 768) >> 8), 0);
		//remaining 8 bits of type, writeUInt8 will take care of discarding excess bits.
		//no need for & 255.
		buffer.writeUInt8(llrpParameter.type, 1);
		//16 bits from length, writeUInt16 will take care of discarding excess bits.
		//no need for & 65535.
		buffer.writeUInt16((llrpParameter.length, 2);
		//copy the value.
		llrpParameter.value.copy(buffer, 4);
	}

	return buffer;
}