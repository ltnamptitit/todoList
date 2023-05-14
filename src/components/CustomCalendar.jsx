import dayjs from 'dayjs';
import React, { useState } from 'react'
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  border-radius: 8px;
  background-color: #ffffff;
  overflow: hidden;
`;
const Header = styled.div`
  border-bottom: 1px solid #12121230;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const CalendarWeeks = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  font-size: 14px;
  gap: 5px;
`;
const CalendarCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  position: relative;
  transition: 0.3s;
  cursor: context-menu;
`;
const CalendarDateCell = styled(CalendarCell)`
  background-color: ${props => props.isSelected ? '#0055a081' : 'transparent'};
  border: ${props => props.isToday ? '2px solid #636ad1a7' : '1px solid #20000020;'};
`;
const CalendarDates = styled.div`
  display: grid;
  gap: 5px;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
  &>${CalendarCell}:hover{
	background-color: #5d8db681;
  }
`;
const Notification = styled.div`
  position: absolute;
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: ${props => props.isAllDone ? 'green' : 'red'};
  top: 4px;
  right: 4px;
  display: ${props => props.isHasTodo ? 'block' : 'none'}
`;


const rangeDate = (start, end) => {
	let arr = []
	if (end === undefined) {
		for (let i = 0; i < start; i++) {
			arr[i] = i
		}
		return arr
	}
	else {
		for (let i = 0; i < end - start + 1; i++) {
			arr[i] = i + start
		}
		return arr
	}
}


function CustomCalendar({ todoListTest, dateCalendar, onChangeDateCalendar }) {
	const [dayObj, setDayObj] = useState(dayjs());
	const today = dayjs().format('DD/MM/YYYY')
	const todoList = [...todoListTest.filter(item => !item.isDone)]
	const doneList = [...todoListTest.filter(item => item.isDone)]


	const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
	const thisYear = dayObj.year()
	const thisMonth = dayObj.month() + 1
	const datesInMonth = dayObj.daysInMonth()
	const firstDateOfMonthObj = dayjs(`${thisYear}-${thisMonth}-1`) //the first date of month
	const firstDayOfMonth = firstDateOfMonthObj.day() //define what day of the week the first date of month was. Return [0-6], 0 is Sunday, 6 is Saturday
	const arrDateMonth = [...rangeDate(1, datesInMonth)]


	const formatNumber = (number) => {
		return (number < 10) ? '0' + number : number
	}

	const onClickPre = () => {
		setDayObj(dayObj.subtract(1, 'month'))
	}

	const onClickNext = () => {
		setDayObj(dayObj.add(1, 'month'))
	}

	const onClickCalendar = (e) => {
		let selectedDate = dayjs(`${dayObj.year()}-${dayObj.month() + 1}-${e.target.outerText}`).format('DD/MM/YYYY')
		onChangeDateCalendar(selectedDate)
	}

	//check if there are tasks on this day
	const checkNotification = (day) => {
		let daysHaveTodo = [...new Set(todoList.map(item => { return item.time }))]
		let daysHaveDone = [...new Set(doneList.map(item => { return item.time }))]
		if (daysHaveTodo.includes(day) || daysHaveDone.includes(day)) {
			return 1
		}
		else {
			return 0
		}
	}

	//check if all tasks have been completed
	const checkAllDone = (day) => {
		let countTodo = todoList.filter(item => { return item.time === day }).length
		let countDone = doneList.filter(item => { return item.time === day }).length
		if (countDone !== 0 && countTodo === 0) {
			return 1
		}
		else return 0
	}
	return (
		<Container>
			<Header>
				<span
					onClick={() => onClickPre()}
				>
					&#8592;
				</span>
				<span>{dayObj.format('MM/YYYY')}</span>
				<span
					onClick={() => onClickNext()}
				>
					&#8594;
				</span>
			</Header>
			<CalendarContainer>
				<CalendarWeeks>
					{days.map(item => {
						return <CalendarCell key={item}>
							{item}
						</CalendarCell>
					})}
				</CalendarWeeks>
				<CalendarDates>
					{
						arrDateMonth.map((item, index) => {
							let currentDateItem = `${formatNumber(item)}/${formatNumber(thisMonth)}/${thisYear}`
							let hasNotification = checkNotification(currentDateItem)
							let isAllDone = checkAllDone(currentDateItem)
							let isToday = currentDateItem === today ? 1 : 0
							let isSelected = currentDateItem === dateCalendar ? 1 : 0
							if (index === 0) {
								return <CalendarDateCell
									key={uuidv4()}
									onClick={(e) => {
										onClickCalendar(e)
									}}
									style={{ 'gridColumnStart': `${firstDayOfMonth}` }}
									isToday={isToday}
									isSelected={isSelected}
								>
									{item}
									<Notification
										isHasTodo={hasNotification}
										isAllDone={isAllDone}
									/>
								</CalendarDateCell>
							}
							return <CalendarDateCell
								key={uuidv4()}
								onClick={(e) => {
									onClickCalendar(e)
								}}
								isToday={isToday}
								isSelected={isSelected}
							>
								{item}
								<Notification
									isHasTodo={hasNotification}
									isAllDone={isAllDone}
								/>
							</CalendarDateCell>

						})
					}
				</CalendarDates>
			</CalendarContainer>

		</Container>
	)
}

export default CustomCalendar
