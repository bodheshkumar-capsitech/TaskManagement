import { Button } from '@fluentui/react-components'

export interface TaskListProps {
  page: number;
  pagesize: number;
  total: number;
  setPage: (page : number) => void;
}

const TaskPage = ({page,pagesize,total,setPage} : TaskListProps) => {

     const totalPages = Math.ceil(total / pagesize);
  return (
    <div>
      <div className="flex items-center justify-center gap-1">
      <Button
        appearance="transparent"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Previous
      </Button>

      <span>
        {page}/{totalPages}
      </span>

      <Button
        appearance="transparent"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </Button>
    </div>
    </div>
  )
}

export default TaskPage