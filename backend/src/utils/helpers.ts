// helpers.ts

// ENUM 타입 검사를 위한 헬퍼 함수
type ValidMapping<T> = Record<string, T>;

export const validateAndMap = <T>(
  rawValue: string | undefined,
  validMapping: ValidMapping<T>,
  fieldName: string
): T => {
  if (!rawValue || !(rawValue in validMapping)) {
    throw new Error(
      `${fieldName} 값이 유효하지 않습니다. 허용된 값: ${Object.keys(validMapping).join(', ')}` // 예외 처리
    );
  }
  return validMapping[rawValue];
};