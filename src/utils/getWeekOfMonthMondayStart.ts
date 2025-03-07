import dayjs from "dayjs";

export function getWeekOfMonthMondayStart(date = dayjs()) {
  // 해당 월의 1일
  const firstOfMonth = date.startOf('month');
  
  // 해당 날짜
  const targetDate = date;
  
  // 1일의 요일 (0: 일, 1: 월, ..., 6: 토)
  const firstDayOfWeek = firstOfMonth.day();
  
  // 월요일이 주의 시작이므로, 1일이 속한 주의 월요일 날짜 계산
  // 1일이 월요일(1)이면 그대로, 화~토(2~6)면 이전 월요일, 일요일(0)이면 이전 월요일
  let mondayOfFirstWeek;
  
  if (firstDayOfWeek === 1) { // 월요일
    mondayOfFirstWeek = firstOfMonth;
  } else if (firstDayOfWeek === 0) { // 일요일
    mondayOfFirstWeek = firstOfMonth.subtract(6, 'day'); // 이전 월요일
  } else { // 화~토
    mondayOfFirstWeek = firstOfMonth.subtract(firstDayOfWeek - 1, 'day');
  }
  
  // 타겟 날짜가 속한 주의 월요일 계산
  let mondayOfTargetWeek;
  const targetDayOfWeek = targetDate.day();
  
  if (targetDayOfWeek === 1) { // 월요일
    mondayOfTargetWeek = targetDate;
  } else if (targetDayOfWeek === 0) { // 일요일
    mondayOfTargetWeek = targetDate.subtract(6, 'day');
  } else { // 화~토
    mondayOfTargetWeek = targetDate.subtract(targetDayOfWeek - 1, 'day');
  }
  
  // 주차 계산 (해당 날짜의 월요일과 1일이 속한 주의 월요일 사이의 주 차이 + 1)
  // 일 수 차이를 구하고 7로 나눈 뒤 1을 더함
  const weekDiff = mondayOfTargetWeek.diff(mondayOfFirstWeek, 'day') / 7;
  
  return weekDiff + 1;
}