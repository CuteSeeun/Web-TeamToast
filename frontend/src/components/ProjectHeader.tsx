// 2024-11-25 한채경 수정
// ProjectHeader.tsx
//프로젝트 들어간 이후부터 쓰는 헤더




import { ReactComponent as LogoIcon } from "../assets/icons/Logo.svg"; // icons 폴더에서 로고 가져옴
import { IoSettingsOutline, IoChevronDownOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
const ProjectHeader = () => {
  const user = useRecoilValue(userState);
  const space = useRecoilValue(spaceIdState); // 프로젝트 눌렀을때 해당 스페이스의 아이디에 있는 프로젝트출력
  const setUser = useSetRecoilState(userState);
  const navigate = useNavigate();
                                <Link to='/spaceedit'>
                                    <li>스페이스관리</li>
                                </Link>
                            ) : (
                                <li 
                                    onClick={handleUnauthorizedAccess}
                                    style={{ 
                                        color: '#999',
                                        cursor: 'not-allowed'
                                    }}
                                >
                                    스페이스관리
                                </li>
                            )} */}
              <Link to="/spacemanagement">
                <li>스페이스관리</li>
              </Link>
            </ul>
          </div>
          <div className="menu-wrap">
            {/* <span className="menu-text">{user.name} </span> */}
            <div className="user-circle">{user?.uname?.charAt(0)}</div>
            <ul className="sub-menu">
              <Link to="/profile">
                <li>프로필</li>
              </Link>
              <li onClick={logoutGo}>로그아웃</li>
            </ul>
          </div>
        </div>
      </div>

    </ProjectHeaderWrap>
  );
};

export default ProjectHeader;
