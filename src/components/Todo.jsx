import React, { useState } from 'react';
import styled from 'styled-components';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Container = styled.div`
  min-height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #129485;
  border-radius: 8px;
  margin-bottom: 10px;
  opacity: ${props => props.checked ? '0.6' : '1'};
  &:hover{
    background-color: #9ecf9e50;
    transition: background-color linear 0.25s;
  }
`;
const Wrapper = styled.div`
  width: 100%;
  margin: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const CustomCheckbox = styled.input`
  height: 30px;
  `;
const TodoContent = styled.p`
  overflow-wrap: break-word;
  width: 80%;
  max-width: 80%;
  margin: 10px 20px;
  text-decoration: ${props => props.checked ? 'line-through' : 'none'};
  transition: ${props => props.checked ? 'text-decoration linear 2500ms' : 'none'};
`;

function Todo({ item, id, onClickEdit }) {
    const [check, setCheck] = useState(item.isDone);
    const idDoc = id;
    const onChangeChecked = async () => {
        await setCheck(!check)
        await updateDoc(doc(db, 'todoList', idDoc), {
            isDone: !item.isDone
        })

    }
    const onClickDeleteTodo = async () => {
        await deleteDoc(doc(db, 'todoList', idDoc))
    }
    return (
        <Container
            checked={check}
        // onClick={(e) => onClick(e)}
        >
            <Wrapper>
                <CustomCheckbox
                    type='checkbox'
                    checked={check}
                    onChange={() => onChangeChecked()}
                />
                <TodoContent
                    checked={check}
                >
                    {item.todo}
                </TodoContent>
                <DeleteOutlined
                    onClick={() => onClickDeleteTodo()}
                />
                <EditOutlined
                    onClick={() => onClickEdit()}
                />
            </Wrapper>
        </Container>
    )
}

export default Todo
