import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../../recoil/atoms/userAtoms';
import { allIssuesState } from '../../recoil/atoms/issueAtoms';
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
    const user = useRecoilValue(userState);
    const [allIssues, setAllIssues] = useRecoilState(allIssuesState);
    const chatAreaRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    }, [comments]);

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentComment(e.target.value);
    };

    const handleCommentSubmit = async () => {
        if (currentComment.trim() === "") return;

        if (!user || !user.uname || !user.email) {
            console.error('사용자 정보가 없습니다.');
            return;
        }

        if (!isid) {
            console.error('isid가 없습니다.');
            return;
        }

        try {
            const currentDate = new Date();
            currentDate.setHours(currentDate.getHours() + 9); // UTC+9 시간대로 변환
            const timestamp = currentDate.toISOString().slice(0, 19).replace('T', ' ');

            const commentData = {
                issueId: parseInt(isid, 10),
                content: currentComment,
                timestamp: timestamp,
                user: user.email
            };

            const response = await axios.post(`/comment`, commentData);
            const updatedComments = [...comments, { ...response.data, user: user.uname }];
            setComments(updatedComments);

            // 이슈 상태 업데이트
            setAllIssues(prevIssues =>
                prevIssues.map(issue =>
                    issue.isid === parseInt(isid, 10)
                        ? { ...issue, comments: updatedComments }
                        : issue
                )
            );

            setCurrentComment("");
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCommentSubmit();
        }
    };

    const handleEditComment = async (cid: number, newContent: string) => {
        try {
            const response = await axios.put(`/comment/edit/${cid}`, { content: newContent });
            if (response.status === 200) {
                const updatedComments = comments.map(comment =>
                    comment.cid === cid ? { ...comment, content: newContent } : comment
                );
                setComments(updatedComments);

                // 이슈 상태 업데이트
                setAllIssues(prevIssues =>
                    prevIssues.map(issue =>
                        issue.isid === parseInt(isid || '0', 10)
                            ? { ...issue, comments: updatedComments }
                            : issue
                    )
                );
            }
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };

    const handleDeleteComment = async (cid: number) => {
        try {
            const response = await axios.delete(`/comment/delete/${cid}`);
            if (response.status === 200) {
                const updatedComments = comments.filter(comment => comment.cid !== cid);
                setComments(updatedComments);

                // 이슈 상태 업데이트
                setAllIssues(prevIssues =>
                    prevIssues.map(issue =>
                        issue.isid === parseInt(isid || '0', 10)
                            ? { ...issue, comments: updatedComments }
                            : issue
                    )
                );
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <CommentContainer>
            <InputArea>
                <CommentField
                    placeholder="댓글을 입력하세요"
                    value={currentComment}
                    onChange={handleCommentChange}
                    onKeyDown={handleKeyDown}
                />
                <SendButton onClick={handleCommentSubmit}>입력</SendButton>
            </InputArea>
            <ChatArea ref={chatAreaRef}>
                {comments.length === 0 ? (
                    <p>댓글이 없습니다. 첫 댓글을 작성해 보세요!</p>
                ) : (
                    comments.map((comment) => (
                        <Comment
                            key={comment.cid}
                            cid={comment.cid}
                            content={comment.content}
                            timestamp={comment.timestamp}
                            user={comment.user}
                            onEdit={handleEditComment}
                            onDelete={handleDeleteComment}
                        />
                    ))
                )}
            </ChatArea>
        </CommentContainer>
    );
};

export default CommentList;
