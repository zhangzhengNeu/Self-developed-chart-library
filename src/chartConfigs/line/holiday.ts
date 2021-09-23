import echarts from 'echarts';
import { SpecificChartConfig } from '../../types';
import currentYearDates from '../../utils/rocket-holiday/2020.json'
import prevYearDates from '../../utils/rocket-holiday/2019.json'
import beforePrevYearDates from '../../utils/rocket-holiday/2018.json'
import dayjs from 'dayjs';

// 时间timestamp格式
const getTime = (date: any) => new Date(date).getTime()

// 前一天
const getPrevDay = (date: any) => new Date(getTime(date) - 24*60*60*1000).getTime()

// 后一天
const getNextDay = (date: any) => new Date(getTime(date) + 24*60*60*1000).getTime()

// format YYYY-MM-DD
const formatDate = (date: any) => dayjs(date).format('YYYY-MM-DD')

// 数据聚合
const getDates = () => {
  // 今天数据
  const datesCurrent: any = currentYearDates;
  // 去年数据
  const datesBefore: any = prevYearDates;
  // 前年数据
  const datesBeforePrev: any = beforePrevYearDates;
  const dates = {
    holidays: {},
    restDays: {},
    workDays: {},
    weekend: {},
  }
  const daysMap = (name: string, dates: any) => {
    dates[name] = Object.assign({}, datesCurrent[name], datesBefore[name], datesBeforePrev[name]);
  }
  Object.keys(dates).forEach(key => {
    daysMap(key, dates);
  })
  return dates;
}

/**
 * 判断节假日期中有多少节日名称是重复，并计算重复次数
 * @param days 
 */
const holidayDaysMap = (days: Record<string, any>) => {
  const daysDuration: any = {}, dateMap: any = {};
  Object.keys(days).forEach(date => {
    const name = days[date];
    const date_year = date.toString().split('-')[0];
    // 数据聚合以防几年的节日重叠，如春节
    const map_name = date_year + '-' + name;
    if (!daysDuration[map_name]) {
      daysDuration[map_name] = {
        date,
        count: 1,
      };
    }else daysDuration[map_name].count += 1;
  })
  Object.keys(daysDuration).map(name => {
    const { date, count } = daysDuration[name];
    const dayName = name.split('-')[1]
    dateMap[date] = {
      name: dayName,
      count,
    }
  })
  return dateMap;
}

// 筛选数据源
const filterSource = (dateSource: any, start: number, end: number) => {
  const source: any = {};
  Object.keys(dateSource).forEach(date => {
    if (getTime(date) >= start && getTime(date) <= end) {
      source[date] = dateSource[date];
    }
  })
  return source;
}

// 判断调休中是否有周末
const isSingleWeekend = (date: string, restDays: any) => {
  const prevDay = getPrevDay(date);
  const nextDay = getNextDay(date);
  const momentPrevDay = formatDate(prevDay)
  const momentNextDay = formatDate(nextDay)
  return !!restDays[momentPrevDay] || !!restDays[momentNextDay]
}

// 创建markArea
const createMarkArea = (name: string, start: number, end: number, source: any[]) => {
  return [
    {
      name,
      yAxis: null,
      xAxis: source[start]
    }, {
      yAxis: null,
      xAxis: source[end]
    }
  ]
}

const createHolidaySeries = (formatSource: string[], realSource: string[], ranges: string[], show: boolean): ({
  barData: any[];
  markAreaData: any[];
}) => {
  const showHoliday = ranges.includes('holiday');
  const showWeekend = ranges.includes('weekend');
  const len = realSource.length;
  const { holidays, weekend, restDays } = getDates();
  // 日期数据源第一个日期和最后一个日期的timestamp格式
  const [start, end] = [getTime(formatSource[0]), getTime(formatSource[len - 1])];
  // 在start和end范围内的节假日
  const allHolidays: any = {
    holidays: {},
    weekend: {}
  };
  // 筛选出在时间范围内的节假日
  allHolidays.holidays = filterSource(holidays, start, end);
  allHolidays.weekend = filterSource(weekend, start, end);
  // 柱状图数据
  const barData: (number | null)[] = [];
  // 节假日markArea部分
  const holidayDateMap = holidayDaysMap(allHolidays.holidays);
  const markAreaData: any[] = [];
  
  const reverseFormatSource = formatSource.reverse();
  const reverseRealSource = realSource.reverse();
  // 从后向前遍历
  reverseFormatSource.forEach((date, cursor) => {
    const order = len - 1 - cursor;
    // 传统节日
    if (holidayDateMap[date] && showHoliday) {
      const { count = 0, name = '' } = holidayDateMap[date] || {};
      if (count === 1) {
        // 只有一天的情况
        barData[order] = 0
      } else if (count > 1) {
        // 超过一天的情况
        markAreaData.push(createMarkArea(show ? name : '', cursor, cursor - count + 1, reverseRealSource))
        barData[order] = null
      }
    } else if (allHolidays.weekend[date] && showWeekend) {
      // 周末
      if (isSingleWeekend(date, restDays)) {
        barData[order] = 0;
      } else if (cursor >= 1 && allHolidays.weekend[reverseFormatSource[cursor]] === '周末' && allHolidays.weekend[reverseFormatSource[cursor - 1]] === '周末') {
        markAreaData.push(createMarkArea(show ? '周末' : '', cursor, cursor - 1, reverseRealSource))
        barData[order] = null;
      } else barData[order] = null;
    } else barData[order] = null;
  });
  return {
    barData,
    markAreaData
  }
}

const config: SpecificChartConfig = {
  defaultChartProps: {},

  optionHandler(options, datasetParams = {}) {
    const { dataset: { source }, series } = options;
    const { ranges = ['holiday', 'weekend'], show = true } = datasetParams;
    if (source.length > 1) {
      const realSource = source[0].slice(1);
      const formatSource = realSource.map((date: any) => {
        return echarts.format.formatTime('yyyy-MM-dd', date);
      })
      const { barData, markAreaData } = createHolidaySeries(formatSource, realSource, ranges, show);
      const backgroundColor = 'rgba(170, 170, 170, 0.08)';
      const barMinHeight = 2000;
      const barWidth = '40%';
      const holidaySeries = {
        type: 'bar',
        data: barData,
        barGap: '-100%',
        barCategoryGap: 0,
        barMinHeight,
        itemStyle: {
          color: backgroundColor,
          barWidth,
        },
        markArea: {
          data: markAreaData,
          itemStyle: {
            color: backgroundColor,
          },
          label: {
            color: '#000'
          }
        },
        tooltip: {show: false}, 
      }
      series.push(holidaySeries)
    }
  }
}

export default config;
