export default {
  VAT_VALUES: [
    {
      label: '0%',
      value: 0,
    },
    {
      label: '5%',
      value: 5,
    },
    {
      label: '8%',
      value: 8,
    },
    {
      label: '23%',
      value: 23,
    },
  ],
  BASIC_INTEREST_RATE: 13,
  LOCALE_DATE: {
    /* starting with Sunday */
    days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
    daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
    firstDayOfWeek: 1,
  },
  COLORS: {
    INVOICE: '#ed6d13',
  },
}
