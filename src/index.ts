import dotenv from 'dotenv'
dotenv.config() // 여기서 한 번만 호출
import 'dayjs/locale/ko' // 한국어 로케일 추가
import dayjs from 'dayjs'
import { makeDailyTasks, makeMonthlyTasks, makeWeeklyTasks } from './makePeriodTasks'
dayjs.locale('ko')

async function main() {
  await makeDailyTasks()
  await makeWeeklyTasks()
  await makeMonthlyTasks()
}

// TODO AWS lambda에서 특정 시간에 실행되도록 설정
main()
