const months = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ];
export const convertDateToString = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const hour = date.getHours();
  const minutes = date.getMinutes();

  return `${day} de ${months[month]} de ${year} a las ${hour.toString().padStart(2,'0') }:${minutes.toString().padStart(2, '0')}`;

}
