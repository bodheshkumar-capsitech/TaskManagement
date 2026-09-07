import React from 'react'
import { Dropdown ,Option} from '@fluentui/react-components'
import type { TodoStatusProps } from '../types/TodoStatusProps'

const TodoStatus = ({status}:TodoStatusProps) => {

const options = ["All","Completed","Pending"]

  return (
    <Dropdown key={"dropdown"} placeholder="Select status" className="w-60">
        {
          options.map((option) =>
          (
            <Option key = {option} disabled = {option === "All"}>{option}</Option>
          ))
        }
      </Dropdown>
  )
}

export default TodoStatus