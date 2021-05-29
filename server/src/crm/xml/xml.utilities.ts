export const containsAnyOf = (
  key: string,
  values: string[],
  entityName: string
) => {
  if (!values.length) return "";

  const hasNullValue = !values.every(Boolean);
  const formattedValues = values
    .filter(Boolean)
    .map(s => `<value>${s}<value>`)
    .join("");

  const nonNullConditionsString = !!formattedValues
    ? `
			<condition entityname="${entityName}" attribute="${key} operator="in">
				${formattedValues}
			</condition>
		`
    : "";

  return !hasNullValue
    ? nonNullConditionsString
    : `
			<filter type="or">
				<condition entityname="${entityName} attribute=${key} operator="null" />
				${nonNullConditionsString}
			</filter>
		`;
};

export const comparisonOperator = (
  key: string,
  value: string,
  operator: string,
  entityName: string
) => {
  return `<condition entityname="${entityName}" attribute="${key}" operator="${operator}" value="${value}" />`;
};

export const containsString = (
  key: string,
  value: string,
  entityName: string
) => comparisonOperator(key, `%25${value}%25`, "like", entityName);

export const equalsAnyOf = (
  key: string,
  values: string[],
  entityName: string
) => {
  return values.map(v => containsString(key, v, entityName));
};

export const any = (...conditions: string[]) => [
  '<filter type="or">',
  ...conditions,
  "</filter>"
];
