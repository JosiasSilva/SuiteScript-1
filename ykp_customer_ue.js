/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(["N/record", "N/https", "SuiteScripts/crypto-js.min.js"], function (record, https, CryptoJS) {
	
	var getToken = function (namespace, tokenValue, tokenName) {
		var uri = 'https://' + namespace + '.servicebus.windows.net/';
		var endocedResourceUri = encodeURIComponent(uri);
		var t0 = new Date(1970, 1, 1, 0, 0, 0, 0);
		var t1 = new Date(new Date().getTime() + (new Date().getTimezoneOffset() * 60000));
		var expireInSeconds = +(31 * 24 * 3600) + 3600 + (((t1.getTime() - t0.getTime()) / 1000) | 0);
		var plainSignature = endocedResourceUri + "\n" + expireInSeconds;
		var hash = CryptoJS.HmacSHA256(plainSignature, tokenValue);
		var base64HashValue = CryptoJS.enc.Base64.stringify(hash);
		var token = 'SharedAccessSignature sr=' + endocedResourceUri + '&sig=' + encodeURIComponent(base64HashValue) + '&se=' + expireInSeconds + '&skn=' + tokenName;
		return token;
	};
	
	function getRecordType(newRecord, oldRecord)
	{		
		if(newRecord)
		{
			return  newRecord.type;
		}
		
		if(oldRecord)
		{
			return  oldRecord.type;
		}	

		return null;		
	}
	
	function afterSubmit(context) {
		
		// criar novo -> oldRecord == null && newRecord != null 
		// editar -> oldRecord != null && newRecord != null 
		// remove  -> oldRecord != null && newRecord == null 
		
		const newRecord = context.newRecord;
		const oldRecord = context.oldRecord;

		var fields;
		var url;
		var token;
		
		var recordType = getRecordType(newRecord, oldRecord);
		
		var prodSettings = {
					dealerUpdateUrl: "",
					ownerUpdateUrl: "",
					tokenDealerValue: "",	
					tokenOwnerValue: "",						
					namespace: "",					
					tokenName: ""
				};
				
		var sandBoxSettings = {
					dealerUpdateUrl: "",
					ownerUpdateUrl: "",
					tokenDealerValue: "",
					//tokenOwnerValue: "YcqViula552JM45kPZyISk/jUPpXOPKeFbhCTT8Lf+k=",	
					namespace: "",					
					tokenName: ""
				};

		//TODO: Set this with the according environment
		var activeSettings = prodSettings;
				
		if(recordType)
		{
			if (recordType === record.Type.CONTACT) {
				
				url = activeSettings.ownerUpdateUrl;
				token = activeSettings.tokenOwnerValue;
								
				fields = {
					"id": "id",
					"firstname": "firstName",
					"lastname": "lastName",
					"email": "email",
					"phone": "phone",

				};
				
			} else {
						
				url = activeSettings.dealerUpdateUrl;
				token = activeSettings.tokenDealerValue;
						
				fields = {
					"entitynumber": "id",
					"externalid": "externalId",
					"entitystatus": "status",
					"companyname": "legalName",
					"custentitycustomentity_dist": "brand",
					"custentity_ykp_contato_principal": "ownerId",
                  	"custentity_cnpj": "authorityId",
					"id": "vendorId",
					"custentity_dealerid":"dealerid"


				};
				
			} 
		}
	
		var changed = false;
			
		// If both defined, compare them   Se ambos definidos, compare-os
		if(oldRecord && newRecord){
				Object.keys(fields).forEach(function (key) {
					var newField = newRecord.getValue({fieldId: key});
					var oldField = oldRecord.getValue({fieldId: key});
				if (oldField != newField) {
				changed = true;
					}
				})
		}
		// If both are null, nothing changed Se ambos forem nulos, nada mudou
		else if(!oldRecord && !newRecord) {
			changed = false;
		}
		else {
			changed = true;
		}
		
		if(changed == true)
		{		
			// Map newRecord => newData
			if(newRecord)
			{
				newData = {};
				Object.keys(fields).forEach(function (key) {
					newData[fields[key]] = newRecord.getValue({
						fieldId: key
					})
				})
			}
			
			// Map oldRecord => newRecord
			var oldData;	
			if (oldRecord) {
				oldData = {};
				Object.keys(fields).forEach(function (key) {
					oldData[fields[key]] = oldRecord.getValue({
						fieldId: key
					})
				})
			} 
			
			
			// Call api
			var jsonPayload = {
				before: oldData,
				after: newData,
				eventSentAtUtc: (new Date()).toISOString()
			}
			var headers = {
				"Content-Type": "application/json",
				"Authorization": getToken(activeSettings.namespace, token, activeSettings.tokenName) // =========================
			};
			var response = https.post({
				url: url,
				body: JSON.stringify(jsonPayload),
				headers: headers

			});
			
			// Logging
			log.debug({
				title: "integ-body",
				details: jsonPayload
			});
			log.debug({
				title: "integ-headers",
				details: headers
			});
			log.debug({
				title: "integ-response",
				details: response
			});

								
	
		}				
	
	}
	return {
		afterSubmit: afterSubmit
	}
})

