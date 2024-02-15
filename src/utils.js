export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

  return `${day}. ${month} ${year} at ${hours}:${minutes}:${seconds}.${milliseconds}`;
};

export const renderAdditionalInfo = (additionalProperties) => {
  try {
    // Remove surrounding quotes if present
    const jsonString = additionalProperties.replace(/^"(.*)"$/, '$1');
    const parsedProps = JSON.parse(jsonString);
    return parsedProps.author || additionalProperties;
  } catch (error) {
    // If parsing fails, check if the string is a simple string
    if (/^"[^"]*"$/.test(additionalProperties)) {
      // If it's a quoted string, remove surrounding quotes and return
      return additionalProperties.replace(/^"(.*)"$/, '$1');
    } else {
      // Otherwise, return the original string
      return additionalProperties;
    }
  }
};
