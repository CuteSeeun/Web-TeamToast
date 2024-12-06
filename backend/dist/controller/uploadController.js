"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDownloadUrl = exports.uploadFiles = void 0;
const s3_1 = __importDefault(require("../utils/s3")); // S3 인스턴스 가져오기
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
// 여러 파일 업로드 컨트롤러
const uploadFiles = (req, res) => {
    const files = req.files;
    if (!files || files.length === 0) {
        res.status(400).json({ success: false, message: 'No files uploaded' });
        return;
    }
    const fileUrls = files.map((file) => file.location);
    const fileNames = files.map((file) => file.key); // 파일 이름만 추출
    res.json({
        success: true,
        fileUrls,
        fileNames,
    });
};
exports.uploadFiles = uploadFiles;
// 파일 다운로드 URL 생성 컨트롤러
const getDownloadUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName } = req.query;
    if (!fileName) {
        res.status(400).json({ success: false, message: 'File name is required' });
        return;
    }
    try {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
        });
        const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3_1.default, command, { expiresIn: 3600 }); // 유효시간: 1시간
        res.json({
            success: true,
            downloadUrl: signedUrl,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate download URL', error });
    }
});
exports.getDownloadUrl = getDownloadUrl;
