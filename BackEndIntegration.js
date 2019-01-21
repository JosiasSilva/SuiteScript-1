function putTcMessageChange(data)
{
  	var id = data.id;
  	var tcVersion = data.tcVersion;
	var eventName = data.eventName;
 	var eventTimestamp = data.eventTimestamp;
  	var recCustomer = nlapiLoadRecord("customer", id);
  	recCustomer.setFieldValue('custentitycustentity_chama_tc_last_versi',tcVersion);
  	recCustomer.setFieldValue('custentity_chama_tc_digital_date',eventTimestamp);
 	if(eventName=="tcAccepted"){
   		recCustomer.setFieldValue('custentitycustomentity_tec_dig','T');
      	recCustomer.setFieldValue('custentity_chama_tc_digital_expired','F');
 	};
	if(eventName=="tcExpired"){
		recCustomer.setFieldValue('custentity_chama_tc_digital_expired','T');
      	recCustomer.setFieldValue('custentitycustomentity_tec_dig','F');
	};
	var submit = nlapiSubmitRecord(recCustomer, true);
  	return true
}
