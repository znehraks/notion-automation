import dotenv from 'dotenv'
dotenv.config()

import 'dayjs/locale/ko' // 한국어 로케일 추가
import dayjs from 'dayjs'
import { makeDailyTasks, makeMonthlyTasks, makeWeeklyTasks } from './makePeriodTasks'

dayjs.locale('ko')

// Lambda 핸들러 함수 - AWS Lambda에서 실행되는 진입점
export const handler = async (event: any) => {
  try {
    console.log('이벤트 시작:', event)

    // 모든 작업 실행
    await makeDailyTasks()
    await makeWeeklyTasks()
    await makeMonthlyTasks()

    console.log('Date test:', new Date().toString())
    return {
      statusCode: 200,
      body: JSON.stringify({ message: '작업 완료됨' }),
    }
  } catch (error) {
    console.error('오류 발생:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: '오류 발생', error: String(error) }),
    }
  }
}
