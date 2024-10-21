const validCustomFieldNames = ["K01", "K02", "K03", "K04", "K05", "K06", "K07", "K08", "K09", "K10", "K11", "K12", "K13", "K14", "K15", "K16", "K17", "K18", "X01", "X02", "X03", "X04", "X05", "X06", "X07", "X08", "X09", "X10", "X11", "X12", "M01", "M02", "M03", "M04", "M05", "M06", "M07", "M08", "M09", "M10", "M11", "M12", "Q01", "Q02", "Q03", "Q04", "Q05", "Q06", "Q07", "Q08", "Q09", "Q10", "Q11", "Q12", "Q13", "Q14", "R01", "R02", "R03", "CW"];
const validCustomFieldValues = [1];

/**
 * Validate a list of subscriptions.
 * @param {object} subscriptions - The subscriptions address to validate.
 * @returns {boolean}
 */
export default function validateSubscriptions(subscriptions: object) {
  if (!subscriptions)
		return false;
		
	if(!(Object.entries(subscriptions).length>0))
		return false;

	for (const [key, value] of Object.entries(subscriptions)) {
		if (!validCustomFieldNames.includes(key))
			return false
		if (!validCustomFieldValues.includes(value))
			return false
	}

	return true;
};