// helpers.ts

// ENUM 타입 검사를 위한 헬퍼 함수
export type ValidMapping<T> = Record<string, T>;

export const validateAndMap = <T>(
  rawValue: string | undefined,
  validMapping: ValidMapping<T>,
  fieldName: string
): T | undefined => {
  if (!rawValue || !(rawValue in validMapping)) {
    return undefined;
  }
  return validMapping[rawValue];
};