export const capitalizeFirstWord = (str: string) => {
  if (!str) return "";
  let formattedStr = str.trim().split("_").join(" ");
   

  return formattedStr.charAt(0).toUpperCase() + formattedStr.slice(1);
};
