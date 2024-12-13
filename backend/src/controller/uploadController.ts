// // 2024-12-03 한채경
// // uploadController.js
// import { Request, Response } from 'express';
// import s3 from '../utils/s3'; // S3 인스턴스 가져오기
// import { GetObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// // 여러 파일 업로드 컨트롤러
// export const uploadFiles = (req: Request, res: Response): void => {
//   const files = req.files as Express.MulterS3.File[];
//   if (!files || files.length === 0) {
//     res.status(400).json({ success: false, message: 'No files uploaded' });
//     return;
//   }

//   const fileUrls = files.map((file) => file.location);
//   const fileNames = files.map((file) => file.key); // 파일 이름만 추출

//   res.json({
//     success: true,
//     fileUrls,
//     fileNames,
//   });
// };

// // 파일 다운로드 URL 생성 컨트롤러
// export const getDownloadUrl = async (req: Request, res: Response): Promise<void> => {
//   const { fileName } = req.query;
//   if (!fileName) {
//     res.status(400).json({ success: false, message: 'File name is required' });
//     return;
//   }

//   try {
//     const command = new GetObjectCommand({
//       Bucket: process.env.S3_BUCKET_NAME!,
//       Key: fileName as string,
//     });

//     const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 유효시간: 1시간
//     res.json({
//       success: true,
//       downloadUrl: signedUrl,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Failed to generate download URL', error });
//   }
// };





// 2024-12-03 한채경
// uploadController.js
import { Request, Response } from 'express';
import s3 from '../utils/s3'; // S3 인스턴스 가져오기
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// 여러 파일 업로드 컨트롤러
export const uploadFiles = (req: Request, res: Response): void => {
  try {
    const files = req.files as Express.MulterS3.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: 'No files uploaded' });
      return;
    };

    // Multer-S3가 이미 처리한 데이터를 사용
    const uploadedFiles = files.map((file) => ({
      originalFilename: file.originalname, // 원본 파일 이름
      previewUrl: file.location, // S3에서의 URL
      key: file.key, // S3 Key
    }));

    res.status(200).json({
      success: true,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error('File processing error:', error);
    res.status(500).json({ success: false, message: 'File upload failed', error });
  };
};

// 파일 다운로드 URL 생성 컨트롤러
export const getDownloadUrl = async (req: Request, res: Response): Promise<void> => {
  const { fileName } = req.query;
  if (!fileName) {
    res.status(400).json({ success: false, message: 'File name is required' });
    return;
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileName as string,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 유효시간: 1시간
    res.status(200).json({
      success: true,
      downloadUrl: signedUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate download URL', error });
  }
};