"use strict";
// 2024-11-26 한채경
// issueTypes.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Priority = exports.Type = exports.Status = void 0;
// Status ENUM 속성 지정
var Status;
(function (Status) {
    Status["Backlog"] = "\uBC31\uB85C\uADF8";
    Status["Working"] = "\uC791\uC5C5\uC911";
    Status["Dev"] = "\uAC1C\uBC1C\uC644\uB8CC";
    Status["QA"] = "QA\uC644\uB8CC";
})(Status || (exports.Status = Status = {}));
// Type ENUM 속성 지정
var Type;
(function (Type) {
    Type["process"] = "\uC791\uC5C5";
    Type["bug"] = "\uBC84\uADF8";
})(Type || (exports.Type = Type = {}));
// Priority ENUM 속성 지정
var Priority;
(function (Priority) {
    Priority["high"] = "\uB192\uC74C";
    Priority["normal"] = "\uBCF4\uD1B5";
    Priority["low"] = "\uB0AE\uC74C";
})(Priority || (exports.Priority = Priority = {}));
