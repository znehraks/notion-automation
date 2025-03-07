import { describe, expect, it } from 'vitest';
import dayjs from 'dayjs';
import { getWeekOfMonthMondayStart } from '../utils/getWeekOfMonthMondayStart';

describe('getWeekOfMonthMondayStart', () => {
  // 2025년 3월 테스트 케이스 (토요일 시작)
  describe('2025년 3월', () => {
    it('3월 1일(토)은 1주차여야 함', () => {
      const date = dayjs('2025-03-01');
      expect(getWeekOfMonthMondayStart(date)).toBe(1);
    });

    it('3월 2일(일)은 1주차여야 함', () => {
      const date = dayjs('2025-03-02');
      expect(getWeekOfMonthMondayStart(date)).toBe(1);
    });

    it('3월 3일(월)은 2주차여야 함', () => {
      const date = dayjs('2025-03-03');
      expect(getWeekOfMonthMondayStart(date)).toBe(2);
    });

    it('3월 9일(일)은 2주차여야 함', () => {
      const date = dayjs('2025-03-09');
      expect(getWeekOfMonthMondayStart(date)).toBe(2);
    });

    it('3월 10일(월)은 3주차여야 함', () => {
      const date = dayjs('2025-03-10');
      expect(getWeekOfMonthMondayStart(date)).toBe(3);
    });

    it('3월 31일(월)은 6주차여야 함', () => {
      const date = dayjs('2025-03-31');
      expect(getWeekOfMonthMondayStart(date)).toBe(6);
    });
  });

  // 2024년 1월 테스트 케이스 (월요일 시작)
  describe('2024년 1월', () => {
    it('1월 1일(월)은 1주차여야 함', () => {
      const date = dayjs('2024-01-01');
      expect(getWeekOfMonthMondayStart(date)).toBe(1);
    });

    it('1월 7일(일)은 1주차여야 함', () => {
      const date = dayjs('2024-01-07');
      expect(getWeekOfMonthMondayStart(date)).toBe(1);
    });

    it('1월 8일(월)은 2주차여야 함', () => {
      const date = dayjs('2024-01-08');
      expect(getWeekOfMonthMondayStart(date)).toBe(2);
    });
  });

  // 2024년 2월 테스트 케이스 (목요일 시작)
  describe('2024년 2월', () => {
    it('2월 1일(목)은 1주차여야 함', () => {
      const date = dayjs('2024-02-01');
      expect(getWeekOfMonthMondayStart(date)).toBe(1);
    });

    it('2월 4일(일)은 1주차여야 함', () => {
      const date = dayjs('2024-02-04');
      expect(getWeekOfMonthMondayStart(date)).toBe(1);
    });

    it('2월 5일(월)은 2주차여야 함', () => {
      const date = dayjs('2024-02-05');
      expect(getWeekOfMonthMondayStart(date)).toBe(2);
    });

    it('2월 29일(목)은 5주차여야 함', () => {
      const date = dayjs('2024-02-29');
      expect(getWeekOfMonthMondayStart(date)).toBe(5);
    });
  });
  
  // 월말/월초 경계 테스트
  describe('월말/월초 경계 테스트', () => {
    it('2024년 1월 31일(수)은 5주차여야 함', () => {
      const date = dayjs('2024-01-31');
      expect(getWeekOfMonthMondayStart(date)).toBe(5);
    });
    
    it('2024년 2월 1일(목)은 1주차여야 함', () => {
      const date = dayjs('2024-02-01');
      expect(getWeekOfMonthMondayStart(date)).toBe(1);
    });
  });
  
  // 예외 케이스 처리
  describe('현재 날짜 및 기타 테스트', () => {
    it('인수 없이 호출 시 현재 날짜의 주차를 반환해야 함', () => {
      // 현재 날짜의 주차 확인은 실제 날짜에 따라 달라짐
      // 정확한 값보다 함수가 에러 없이 동작하는지 확인
      expect(() => getWeekOfMonthMondayStart()).not.toThrow();
    });
  });
}); 