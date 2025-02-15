export const formartNumber = (number_data: number) => {
  if (number_data >= 1000 && number_data < 1000000) {
    return `${Math.floor(number_data / 1000)} K`;
  } else if (number_data >= 1000000 && number_data < 1000000000) {
    return `${Math.floor(number_data / 1000000)} M`;
  } else if (number_data >= 1000000000 && number_data < 1000000000000) {
    return `${Math.floor(number_data / 1000000000)} B`;
  }
  return number_data;
};

export default function trim(data: string) {
  if (data.length <= 35) {
    return data;
  }
  return data.slice(0, 35) + "..";
}
