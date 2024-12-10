import React from 'react';
import { CommentBoxContainer, CommentUserInfo, CommentContent, AvatarImage } from './issueStyle';

// 댓글 타입 정의
interface CommentProps {
    content: string;
    timestamp: string;
    user: string;
}

// 타임스탬프 포맷팅 함수
const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now.getTime() - date.getTime();

    const diffMinutes = Math.floor(diff / (1000 * 60));
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    const diffMonths = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    const diffYears = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

    if (diffYears > 0) {
        return `${diffYears}년 전`;
    } else if (diffMonths > 0) {
        return `${diffMonths}달 전`;
    } else if (diffWeeks > 0) {
        return `${diffWeeks}주 전`;
    } else if (diffDays > 0) {
        return `${diffDays}일 전`;
    } else if (diffHours > 0) {
        return `${diffHours}시간 전`;
    } else {
        return `${diffMinutes}분 전`;
    }
};

const Comment: React.FC<CommentProps> = ({ content, timestamp, user }) => {
    const firstLetter = user ? user.charAt(0).toUpperCase() : '';

    return (
        <CommentBoxContainer>
            <CommentUserInfo>
                <AvatarImage>{firstLetter}</AvatarImage>
                <p>{user}</p>
                <p>{formatTimestamp(timestamp)}</p>
            </CommentUserInfo>
            <CommentContent>
                <p>{content}</p>
            </CommentContent>
        </CommentBoxContainer>
    );
};

export default Comment;
