import styled from 'styled-components';
import CustomCalendar from "./components/CustomCalendar";
import Todo from "./components/Todo";
import { useState, useRef, useEffect } from 'react';
import { DatePicker, Button } from 'antd';
import dayjs from 'dayjs';

import { db } from './firebase';
import { query, collection, onSnapshot, addDoc, doc, updateDoc } from 'firebase/firestore';

const Container = styled.div`
	height: 100vh;
	width: 100vw;
	min-width: 960px;
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #5c8493;
`
const Wrapper = styled.div`
	width: 80%;
	height: 80%;
	border: 1px solid #282c3420;
	border-radius: 10px;
	overflow: hidden;
	display: flex;
	flex-direction: row;
	background-color: #fff;
`
const SidePanelContainer = styled.div`
	width: 360px;
	min-width: 360px;
	display: flex;
	flex-direction: column;
	align-items: center;
	border-right: 1px solid #00000040;
`
const TodoContainer = styled.div`
	display: flex;
	flex-direction: column;
	max-width: 920px;
	height: 100%;
	width: 100%;
	align-items: center;
`
const InputContainer = styled.div`
  height: 100px;
  min-height: 100px;
  width: 100%;
  border-bottom: 1px solid;
`
const InputWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Input = styled.input`
  border: none;
  border-radius: 5px;
  height: 50px;
  width: 90%;
  padding: 0px 30% 0px 20px;
  /* border: 1px solid #ccc; */
  &:focus{
    outline: none;
  };
  /* @media (max-width: 1145px) {
	width: 100%;
  } */
`;
const ControlContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  right: 50px;
`;
const CustomDatePicker = styled(DatePicker)`
  /* position: absolute;
  right: 150px; */
  margin-right: 16px;
`;
const CustomButton = styled(Button)`
  /* position: absolute;
  right: 50px; */
`;
const ListContainer = styled.div`
	width: 100%;
	height: 100%;
	padding: 10px 0px;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: scroll;
	&::-webkit-scrollbar{
		display: none;
	}
`;
const ListWrapper = styled.div`
	width: 90%;
`;

export default function App() {

	const [todo, setTodo] = useState('');
	const [editedItem, seteditedItem] = useState();
	const [isEdit, setIsEdit] = useState(false);
	const ref = useRef(null)

	const [todoListTest, setTodoListTest] = useState([]);
	const [inputDate, setInputDate] = useState(dayjs);

	const [dateCalendar, setDateCalendar] = useState(dayjs().format("DD/MM/YYYY"));



	useEffect(() => {
		const todoQuery = query(collection(db, "todoList"))
		const unSubscribeTodo = onSnapshot(todoQuery, (querySnapshot) => {
			let todoArr = []
			querySnapshot.forEach((doc) => {
				todoArr.push({ ...doc.data(), id: doc.id })
			})
			setTodoListTest([...todoArr])
		})
		return () => {
			unSubscribeTodo()
		}
	}, [])

	const onChangeInput = (str) => {
		setTodo(str)
	}

	const createNewTodo = async () => {
		if (todo.trim()) {
			if (!isEdit) {
				await addDoc(collection(db, "todoList"), {
					todo: todo.trim(),
					time: inputDate.format("DD/MM/YYYY"),
					isDone: false
				})
			}
			else {
				await updateDoc(doc(db, 'todoList', editedItem.id), {
					todo: todo.trim(),
					time: inputDate.format("DD/MM/YYYY"),
					isDone: editedItem.isDone
				})
				setIsEdit(false)
			}
			setTodo('')
			return
		}
	}

	const onClickEdit = (obj) => {
		setTodo(obj.todo)
		setIsEdit(true)
		seteditedItem(obj)
		ref.current.focus()
		ref.current.setSelectionRange(obj.todo.trim().length - 1, obj.todo.trim().length - 1)
	}

	const onKeyPressEnter = (event) => {
		if (event.charCode === 13) {
			createNewTodo()
		}
		return;
	}
	const onChangeDate = (dateString) => {
		setInputDate(dayjs(dateString, 'DD/MM/YYYY'))
	}

	return (
		<Container>
			<Wrapper>
				<SidePanelContainer>
					<CustomCalendar
						todoListTest={todoListTest}
						onChangeDateCalendar={(e) => {
							setInputDate(dayjs(e, 'DD/MM/YYYY'))
							setDateCalendar(e)
						}}
						dateCalendar={dateCalendar}
					/>
				</SidePanelContainer>
				<TodoContainer>
					<InputContainer>
						<InputWrapper>
							<Input
								type='text'
								value={todo}
								onChange={(e) => onChangeInput(e.target.value)}
								onKeyPress={(e) => onKeyPressEnter(e)}
								placeholder='Add new ask'
								ref={ref}
							/>
							<ControlContainer>
								<CustomDatePicker
									defaultValue={inputDate}
									value={inputDate}
									format={'DD/MM/YYYY'}
									onChange={(date, dateString) => { dateString && onChangeDate(dateString) }}
								/>
								<CustomButton
									type="primary"
									// onClick={() => onClickMainButton()}
									onClick={() => createNewTodo()}
								>
									{
										isEdit ? 'Update' : 'Add'
									}
								</CustomButton>
							</ControlContainer>
							{/* <DatePicker /> */}
						</InputWrapper>
					</InputContainer>

					<ListContainer>
						<ListWrapper>
							{
								todoListTest.filter(item => !item.isDone).filter(item => item.time == dateCalendar).map(item => {
									return <Todo item={item} key={item.id} id={item.id} onClickEdit={() => onClickEdit(item)} />
								})
							}
						</ListWrapper>
						<ListWrapper>
							{
								todoListTest.filter(item => item.isDone).filter(item => item.time == dateCalendar).map(item => {
									return <Todo item={item} key={item.id} id={item.id} onClickEdit={() => onClickEdit(item)} />
								})
							}
						</ListWrapper>
					</ListContainer>
				</TodoContainer>
			</Wrapper>
		</Container >
	);
}