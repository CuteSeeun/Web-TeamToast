import React, { useState } from 'react';
import { CommentBoxContainer, CommentUserInfo, CommentContent, AvatarImage, CommentUserDetails, CommentActions } from './issueStyle';

// 댓글 타입 정의
interface CommentProps {
    content: string;
    timestamp: string;
    user: string;
    onEdit: (cid: number, newContent: string) => void;
    onDelete: (cid: number) => void;
    cid: number;
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
    } else if (diffMinutes > 0) {
        return `${diffMinutes}분 전`;
    } else {
        return `방금 전`;
    }
};

const Comment: React.FC<CommentProps> = ({ content, timestamp, user, onEdit, onDelete, cid }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newContent, setNewContent] = useState(content);
    const firstLetter = user ? user.charAt(0).toUpperCase() : '';

    const handleSave = () => {
        onEdit(cid, newContent);
        setIsEditing(false);
    };

    return (
        <CommentBoxContainer>
            <CommentUserInfo>
                <CommentUserDetails>
                    <AvatarImage>{firstLetter}</AvatarImage>
                    <p>{user}</p>
                    <p>{formatTimestamp(timestamp)}</p>
                </CommentUserDetails>
                <CommentActions>
                    {isEditing ? (
                        <span onClick={handleSave}>확인</span>
                    ) : (
                        <>
                            <span onClick={() => setIsEditing(true)}>수정</span>
                            <span onClick={() => onDelete(cid)}>삭제</span>
                        </>
                    )}
                </CommentActions>
            </CommentUserInfo>
            <CommentContent>
                {isEditing ? (
                    <input
                        type="text"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        style={{ width: '100%' }}
                    />
                ) : (
                    <p>{content}</p>
                )}
            </CommentContent>
        </CommentBoxContainer>
    );
};

export default Comment;
