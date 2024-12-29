export type TTask = {
  id: string,
  title: string,
  description: string,
  date: string,
  priority: 'low' | 'medium' | 'high',
  isCompleted: boolean,
  isArchive: boolean
}
