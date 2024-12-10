import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms/userAtoms'; // 경로는 실제 경로로 변경하세요
import { CommentContainer, ChatArea, CommentField, InputArea, SendButton } from './issueStyle';
import Comment from './Comment';

// 댓글 데이터 타입 정의
interface CommentData {
    cid: number;
    content: string;
    timestamp: string;
    issue_id: number;
    user: string;
}

const CommentList: React.FC = () => {
    const { isid } = useParams<{ isid: string }>();
    const [comments, setComments] = useState<CommentData[]>([]);
    const [currentComment, setCurrentComment] = useState<string>("");
    const user = useRecoilValue(userState); // Recoil 상태에서 사용자 정보 가져오기

    useEffect(() => {
        const fetchComments = async () => {
            try {
                if (!isid) {
                    throw new Error('isid가 없습니다.');
                }
                const response = await axios.get(`/comment/${isid}`);
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };
        fetchComments();
    }, [isid]);

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentComment(e.target.value);
    };

    const handleCommentSubmit = async () => {
        if (currentComment.trim() === "") return;

        // 사용자 정보가 필요한지 확인
        if (!user || !user.uname || !user.email) {
            console.error('사용자 정보가 없습니다.');
            return;
        }

        if (!isid) { // isid가 undefined인지 확인
            console.error('isid가 없습니다.');
            return;
        }

        try {
            // 현재 시간 구하기
            const timestamp = new Date().toISOString();

            const commentData = {
                issueId: parseInt(isid, 10), // 숫자로 변환하여 전달
                comment: currentComment,
                timestamp: timestamp,
                user: user.email // Recoil에서 가져온 사용자 정보 사용
            };

            console.log('전송할 데이터:', commentData); // 로그 추가

            const response = await axios.post(`/comment`, commentData);

            console.log('서버 응답:', response.data); // 로그 추가

            setComments([...comments, response.data]);
            setCurrentComment("");
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    return (
        <CommentContainer>
            <InputArea>
                <CommentField
                    placeholder="댓글을 입력하세요"
                    value={currentComment}
                    onChange={handleCommentChange}
                />
                <SendButton onClick={handleCommentSubmit}>입력</SendButton>
            </InputArea>
            <ChatArea>
                {comments.length === 0 ? (
                    <p>댓글이 없습니다. 첫 댓글을 작성해 보세요!</p>
                ) : (
                    comments.map((comment) => (
                        <Comment key={comment.cid} content={comment.content} timestamp={comment.timestamp} user={comment.user} />
                    ))
                )}
            </ChatArea>
        </CommentContainer>
    );
};

export default CommentList;
