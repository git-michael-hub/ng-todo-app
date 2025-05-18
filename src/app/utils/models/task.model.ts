export type TTask = {
  id?: string,
  title: string,
  description: string,
  dueDate: string,
  priority: 'low' | 'medium' | 'high',
  isCompleted?: boolean,
  isArchive: boolean,
  createdAt: string,
  updatedAt: string
}
