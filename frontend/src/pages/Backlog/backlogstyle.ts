import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  /* height: 100vh; */
  /* background: pink; */
  /* flex: 1; */
`;

export const BoardContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding-left: 25px; 
  padding-right: 70px;
  width: 1600px;
  overflow: hidden;
`;

export const BoardHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width:100%;
  padding: 20px;
`;

export const BoardTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;

export const Breadcrumb = styled.div`
  font-size: 14px;
  color: #6c757d;
  margin-top: 8px;
`;

export const Filters = styled.div`
  display: flex;
  align-items: center;
  margin-top: 50px;
  margin-bottom: 0px;

  & > label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-right: 20px;
    font-size: 14px;
    cursor: pointer;

    svg {
      margin-left: 5px;
    }

    select {
      margin-top: 5px;
      padding: 5px;
      border: none; 
      outline: none;       
      box-shadow: none; 
      font-size: 14px;
    }
  }
`;


export const StyledSprintBox = styled.div`
  background-color: #f2f2f2;
  margin-top: 20px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1300px; 
`;

export const SprintHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const SprintName = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

export const SprintPeriod = styled.p`
  font-size: 14px;
  color: #6c757d;
`;

export const SprintControls = styled.div`
  display: flex;
  align-items: center;

  button {
    background-color: #038c8c;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 10px;

    &:hover {
      background-color: #026b6b;
    }

    &:active {
      transform: translateY(2px);
    }
  }

  .menu-icon {
    font-size: 20px;
    cursor: pointer;
    color: #6c757d;

    &:hover {
      color: #333;
    }
  }
`;

export const IssueTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;

  th {
    background-color: #e9ecef;
    text-align: left;
    padding: 8px;
    font-size: 14px;
    font-weight: bold;
    color: #495057;
  }

  td {
    padding: 8px;
    border-bottom: 1px solid #dee2e6;
    font-size: 14px;
  }

  tr:hover {
    background-color: #f8f9fa;
  }
`;

export const AddIssueLink = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #4D4D4D;
  cursor: pointer;

  &:active {
    transform: translateY(2px);
  }
`;

export const AddSprint = styled.button`
background-color: #fff;
border: 1px solid #dee2e6;
border-radius: 5px;
padding: 10px 20px;
cursor: pointer;
font-size: 14px;
color: #495057;
margin-right: 10px;

&:hover {
    background-color: #026b6b;
    color: #fff;
}

&:active {
    transform: translateY(2px);
}
`;

export const BacklogSection = styled.div`
    margin-top: 20px;
`;

export const Div = styled.div`
display:flex;
justify-content: center;
align-items:center;
flex-direction: column;
position:relative;
`;
