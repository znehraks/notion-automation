import dayjs from 'dayjs'
import { notion } from './notionClient'
import 'dayjs/locale/ko'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { getWeekOfMonthMondayStart } from './utils/getWeekOfMonthMondayStart'

// 필요한 모든 플러그인 추가
dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.locale('ko')

// 기간 타입 정의
type PeriodType = 'daily' | 'weekly' | 'monthly'

interface PeriodConfig {
  dbName: string // 'Daily Tasks', 'Weekly Tasks', 'Monthly Tasks'
  getDateRange: () => { start: dayjs.Dayjs; end: dayjs.Dayjs }
  formatTitle: (start: dayjs.Dayjs, end: dayjs.Dayjs) => string
  shouldExcludeTask?: (task: any) => boolean
}

// 각 기간 타입별 설정
const periodConfigs: Record<PeriodType, PeriodConfig> = {
  daily: {
    dbName: 'Daily Tasks',
    getDateRange: () => {
      const today = dayjs()
      return { start: today, end: today }
    },
    formatTitle: (start) => start.format('YYYY.MM.DD (ddd)'),
    shouldExcludeTask: (taskRowResult) => {
      // 진행도가 완료 또는 중단인 항목 제외
      const progress = taskRowResult.properties['진행도']?.select?.name
      return progress === '완료' || progress === '중단'
    },
  },
  weekly: {
    dbName: 'Weekly Tasks',
    getDateRange: () => {
      const today = dayjs()
      const targetDayOfWeek = today.day() // 0: 일, 1: 월, ..., 6: 토
      let monday, sunday

      if (targetDayOfWeek === 0) {
        // 일요일이면
        monday = today.subtract(6, 'day')
        sunday = today
      } else {
        // 월~토요일이면
        monday = today.subtract(targetDayOfWeek - 1, 'day')
        sunday = monday.add(6, 'day')
      }

      return { start: monday, end: sunday }
    },
    formatTitle: (start, end) =>
      `${start.format('YYYY.MM.DD')}(${start.format('ddd')}) - ${end.format('YYYY.MM.DD')}(${end.format('ddd')})`,
    shouldExcludeTask: (taskRowResult) => {
      // 진행도가 완료 또는 중단인 항목 제외
      const progress = taskRowResult.properties['진행도']?.select?.name
      return progress === '완료' || progress === '중단'
    },
  },
  monthly: {
    dbName: 'Monthly Tasks',
    getDateRange: () => {
      const today = dayjs()
      return {
        start: today.startOf('month'),
        end: today.endOf('month'),
      }
    },
    formatTitle: (start) => start.format('YYYY.MM'),
    shouldExcludeTask: (taskRowResult) => {
      // 진행도가 완료 또는 중단인 항목 제외
      const progress = taskRowResult.properties['진행도']?.select?.name
      if (progress === '완료' || progress === '중단') {
        return true
      }

      // Daily 관련 항목 제외
      const taskType = taskRowResult.properties['Task Type']
      const taskName = taskRowResult.properties['Name']?.title?.[0]?.plain_text || ''

      return (
        taskType?.select?.name === 'Daily' ||
        taskName.includes('Daily') ||
        taskName.includes('일일') ||
        // 일일 작업 패턴 (YYYY.MM.DD 형식) 확인
        /\d{4}\.\d{2}\.\d{2}/.test(taskName)
      )
    },
  },
}

export async function makePeriodTasks(periodType: PeriodType) {
  const config = periodConfigs[periodType]
  const { start, end } = config.getDateRange()

  const taskDB = (
    await notion.search({
      query: `TasksDB-${dayjs().format('YYYY')}`,
    })
  ).results.find((result) => result.object === 'database')

  if (!taskDB?.id) {
    console.log('TasksDB를 찾을 수 없습니다.')
    return
  }

  const taskRowResults = (
    await notion.databases.query({
      database_id: taskDB.id,
    })
  ).results as any[]

  // 해당 기간에 적합한 작업 필터링
  const filteredTasks = taskRowResults
    .filter((taskRowResult) => {
      // 계획 기간 속성이 있는지 확인
      const planPeriod = taskRowResult.properties['계획 기간']

      if (!planPeriod || planPeriod.type !== 'date' || !planPeriod.date) {
        return false
      }

      // 추가 제외 조건이 있으면 검사
      if (config.shouldExcludeTask && config.shouldExcludeTask(taskRowResult)) {
        return false
      }

      const startDate = planPeriod.date.start ? dayjs(planPeriod.date.start) : null
      const endDate = planPeriod.date.end ? dayjs(planPeriod.date.end) : startDate

      // 날짜가 정의되지 않은 경우
      if (!startDate) {
        return false
      }

      // 기간별 필터링 로직
      if (periodType === 'daily') {
        // 오늘 날짜가 시작일과 종료일 사이에 있는지 확인
        if (endDate) {
          return start.isAfter(startDate.subtract(1, 'day')) && start.isBefore(endDate.add(1, 'day'))
        } else {
          return start.format('YYYY-MM-DD') === startDate.format('YYYY-MM-DD')
        }
      } else {
        // 주간/월간 필터링 (기간이 겹치는지 검사)
        if (endDate) {
          return startDate.isSameOrBefore(end) && endDate.isSameOrAfter(start)
        } else {
          return startDate.isSameOrAfter(start) && startDate.isSameOrBefore(end)
        }
      }
    })
    .map((task) => ({ id: task.id }))

  // 대상 데이터베이스 찾기
  const targetDB = (
    await notion.search({
      query: config.dbName,
      filter: {
        property: 'object',
        value: 'database',
      },
    })
  ).results.find((result) => result.object === 'database' && (result as any).title?.[0]?.plain_text === config.dbName)

  if (!targetDB?.id) {
    console.log(`${config.dbName} 데이터베이스를 찾을 수 없습니다.`)
    return
  }

  // 제목 포맷팅
  const title = config.formatTitle(start, end)

  // 이미 동일한 제목의 항목이 있는지 확인
  const existingTasks = await notion.databases.query({
    database_id: targetDB.id,
    filter: {
      property: '이름',
      title: {
        equals: title,
      },
    },
  })

  if (existingTasks.results.length === 0) {
    // 새 항목 생성
    const newTask = await notion.pages.create({
      parent: {
        database_id: targetDB.id,
      },
      properties: {
        이름: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        ToDos: {
          relation: filteredTasks,
        },
        Date: {
          date: {
            start: start.format('YYYY-MM-DD'),
            ...(periodType !== 'daily' ? { end: end.format('YYYY-MM-DD') } : {}),
          },
        },
      },
    })

    console.log(`${periodType} 작업이 ${config.dbName}에 추가되었습니다: ${newTask.id}`)
  } else {
    console.log(`${periodType} 이미 ${title} 항목이 존재합니다.`)
  }
}

// 편의를 위한 래퍼 함수들
export const makeDailyTasks = () => makePeriodTasks('daily')
export const makeWeeklyTasks = () => makePeriodTasks('weekly')
export const makeMonthlyTasks = () => makePeriodTasks('monthly')
