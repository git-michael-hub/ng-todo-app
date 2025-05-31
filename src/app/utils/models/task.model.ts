export type TTask = {
  id?: string,
  title: string,
  description: string,
  dueDate: string,
  priority: TPriority,
  // isCompleted?: boolean,
  status: TStatus,
  isArchive: boolean,
  createdAt: string,
  updatedAt: string
}


export type TSORT = 'asc' | 'desc';
export type TStatus = 'todo' | 'inprogress' | 'done' | 'block' | 'inreview';
export type TPriority = 'low' | 'medium' | 'high';