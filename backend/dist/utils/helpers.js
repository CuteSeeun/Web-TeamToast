"use strict";
// helpers.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAndMap = void 0;
const validateAndMap = (rawValue, validMapping, fieldName) => {
    if (!rawValue || !(rawValue in validMapping)) {
        throw new Error(`${fieldName} 값이 유효하지 않습니다. 허용된 값: ${Object.keys(validMapping).join(', ')}` // 예외 처리
        );
    }
    return validMapping[rawValue];
};
exports.validateAndMap = validateAndMap;
